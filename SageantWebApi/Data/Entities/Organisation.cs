using System;
using System.Collections.Generic;

namespace SageantWebApi.Data.Entities;

public partial class Organisation
{
    public long OrgId { get; set; }

    public string Name { get; set; } = null!;

    public string? Website { get; set; }

    public string? LogoStorageKey { get; set; }

    public string PasswordHash { get; set; } = null!;

    public string Timezone { get; set; } = null!;

    public string Currency { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public string Email { get; set; } = null!;
}
