using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using SageantWebApi.Data;
using SageantWebApi.Data.Entities;

namespace SageantWebApi.Controllers
{
    [Route("api/sageant/organisation")]
    [ApiController]
    public class OrganisationController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;
        private readonly ILogger<OrganisationController> _logger;

        // allowed logo file types and the biggest size (2 MB)
        private static readonly Dictionary<string, string> LogoTypes = new()
        {
            [".png"] = "image/png",
            [".jpg"] = "image/jpeg",
            [".jpeg"] = "image/jpeg",
            [".webp"] = "image/webp"
        };
        private const long MaxLogoBytes = 2 * 1024 * 1024;

        public OrganisationController(AppDbContext db, IConfiguration config, ILogger<OrganisationController> logger)
        {
            _db = db;
            _config = config;
            _logger = logger;
        }

        // POST api/sageant/organisation/signup
        // form-data: email, password, name, website (optional), logo (optional file)
        [AllowAnonymous]
        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromForm] SignupRequest req)
        {
            var email = req.Email.Trim().ToLower();

            // check the logo first, before anything is saved
            var logoExt = "";
            if (req.Logo is not null)
            {
                logoExt = Path.GetExtension(req.Logo.FileName).ToLower();
                if (!LogoTypes.TryGetValue(logoExt, out var type) || req.Logo.ContentType != type)
                    return BadRequest(new { message = "Logo must be a png, jpg or webp image." });
                if (req.Logo.Length == 0 || req.Logo.Length > MaxLogoBytes)
                    return BadRequest(new { message = "Logo must be between 1 byte and 2 MB." });
            }

            if (await _db.Organisations.AnyAsync(o => o.Email.ToLower() == email))
                return Conflict(new { message = "Email already registered." });

            // currency and timezone come from the database defaults
            var org = new Organisation
            {
                Email = email,
                Name = req.Name.Trim(),
                Website = req.Website?.Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password)
            };
            _db.Organisations.Add(org);

            try
            {
                await _db.SaveChangesAsync();
            }
            // two signups at the same moment: the unique index stops the second one
            catch (DbUpdateException ex) when (ex.InnerException is PostgresException { SqlState: PostgresErrorCodes.UniqueViolation })
            {
                return Conflict(new { message = "Email already registered." });
            }

            // the account is saved; a failed logo upload does not undo it
            string? logoMessage = null;
            if (req.Logo is not null)
            {
                try
                {
                    var key = $"organisations/{org.OrgId}/logo{logoExt}";
                    var container = new BlobContainerClient(
                        _config["ImageStorage:ConnectionString"], _config["ImageStorage:Container"]);
                    await using var stream = req.Logo.OpenReadStream();
                    await container.GetBlobClient(key).UploadAsync(stream, new BlobUploadOptions
                    {
                        HttpHeaders = new BlobHttpHeaders { ContentType = req.Logo.ContentType }
                    });

                    org.LogoStorageKey = key;
                    org.UpdatedAt = DateTime.UtcNow;
                    await _db.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Logo upload failed for org {OrgId}", org.OrgId);
                    logoMessage = "Account created, but the logo upload failed. You can add the logo later.";
                }
            }

            return StatusCode(StatusCodes.Status201Created, new
            {
                org.OrgId,
                org.Name,
                org.Website,
                org.LogoStorageKey,
                org.Currency,
                org.Timezone,
                message = logoMessage
            });
        }

        // POST api/sageant/organisation/login
        // body: { "email": "shop@example.com", "password": "MyPassword123" }
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Verify([FromBody] VerifyRequest req)
        {
            // email match ignores upper/lower case
            var email = req.Email.Trim().ToLower();
            var org = await _db.Organisations
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.Email.ToLower() == email);

            // same message for every failure, so it doesn't reveal which field was wrong
            if (org is null || !BCrypt.Net.BCrypt.Verify(req.Password, org.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password." });

            var (token, expiresAt) = CreateToken(org.OrgId, org.Name);

            return Ok(new
            {
                org.OrgId,
                org.Name,
                org.LogoStorageKey,
                org.Currency,
                org.Timezone,
                token,
                expiresAt
            });
        }

        // GET api/sageant/organisation/me
        // header: Authorization: Bearer <token>
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            // org id comes from the token, never from the request
            if (!long.TryParse(User.FindFirstValue("org_id"), out var orgId))
                return Unauthorized();

            var org = await _db.Organisations
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.OrgId == orgId);

            if (org is null)
                return Unauthorized();

            return Ok(new
            {
                org.OrgId,
                org.Name,
                org.LogoStorageKey,
                org.Currency,
                org.Timezone
            });
        }

        // makes a signed token that holds the org id and name
        private (string Token, DateTime ExpiresAt) CreateToken(long orgId, string orgName)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var minutes = int.TryParse(_config["Jwt:ExpiryMinutes"], out var m) ? m : 1440;
            var expiresAt = DateTime.UtcNow.AddMinutes(minutes);

            var jwt = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: new[]
                {
                    new Claim("org_id", orgId.ToString()),
                    new Claim("name", orgName)
                },
                expires: expiresAt,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

            return (new JwtSecurityTokenHandler().WriteToken(jwt), expiresAt);
        }
    }

    public record SignupRequest(
        [Required, EmailAddress, MaxLength(150)] string Email,
        [Required, MinLength(8), MaxLength(100)] string Password,
        [Required, MaxLength(150)] string Name,
        [Url, MaxLength(255)] string? Website,
        IFormFile? Logo);

    public record VerifyRequest(
        [Required, EmailAddress, MaxLength(255)] string Email,
        [Required, MaxLength(100)] string Password);
}
