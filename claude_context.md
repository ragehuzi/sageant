# Sageant: full context handoff for Claude Code

Paste this whole file as your first message in Claude Code (opened on the repo root `D:\sageant`), then save the stable parts into `CLAUDE.md`. It covers everything decided and built in the earlier chat, 15 to 20 November 2026. It contains no passwords or keys. Never ask for them, never print them, and never commit them.

## 1. Who I am and how to work with me

- I am Huzaifa Farooqui, a student at FAST NUCES Karachi (Computer Science, Fall 2026). We are three people on the FYP: Taha Akhtar, Saaim Zeeshan, Huzaifa Farooqui.
- Taha owns the Supervisor/Order Agent, Shopify and the dashboard shell. Saaim owns the Customer/CRM Agent, Notification Agent and WhatsApp. Huzaifa owns the Inventory Agent, stock, demo data and tests.
- Style I want: direct, plain language, short sentences. Simplest option that works. I am a student with limited weeks, so say what to cut first.
- Answer only what I ask. Do not add "next steps" unless I ask for them. Do not repeat things I already did.
- When I do ask for a plan: give tasks with an owner, how, and a "done when" test.
- Do not invent numbers or API behaviour. If unsure, say so and tell me which official doc to check.
- I often paste screenshots and error text. Read the exact error before guessing.
- Before changing anything, read the relevant files. Keep changes small. Build to verify (`dotnet build SageantWebApi`). Ask before any destructive step (dropping tables, deleting Azure resources, force-pushing).

## 2. The product

Sageant is an ERP-style hub that connects the tools a small online shop uses (Shopify, WhatsApp, email, spreadsheets). It keeps orders, stock, customers, messages and run history in one database. AI agents do routine cross-system work. Staff watch and make the final call on anything sensitive. We do not replace Shopify.

Main story: "We received 20 new orders. Check stock, find shortages, update affected orders, notify the customers." Order Agent loads orders, Inventory Agent checks stock, shortages are tagged in Shopify, Notification Agent messages customers on WhatsApp, every step is logged.

Stack decisions:
- Backend system of record: .NET Core Web API (REST) with EF Core and PostgreSQL.
- Agents: CrewAI (Python), a separate service later. Agents act only through tools that call the .NET API. Agents never write to the database directly.
- No LangChain or LangGraph unless CrewAI clearly cannot do something. If we ever add them, say why first.
- Front end: React/Next.js dashboard (12 screens designed, light mode, accent #2F54D8).
- pgvector in FYP-II for RAG.
- Free tiers: Shopify dev store, WhatsApp Cloud API test number, a free LLM API, free email option. Each integration sits behind an interface.
- Secrets live only on the server. The browser never sees them.

Design principles: (1) the .NET API owns the data; (2) agents use a small allow-listed set of tools and business rules are plain code; (3) humans decide sensitive actions; (4) every tool call is logged with secrets and phone numbers masked; (5) every dashboard button works or is visibly disabled.

Scope: FYP-I (Sep to Dec 2026, demo on or after 7 Dec 2026, date unconfirmed) covers requirements, Supervisor routing for 3 intents, Order Agent with Shopify, Inventory Agent, CRM Agent, Notification Agent with WhatsApp, and a dashboard. FYP-II (4 Jan to 30 Apr 2027) adds approval pause/resume, forecasting, RAG, audit log and roles, workflow builder, and evaluation against a single-agent baseline.

## 3. Azure setup (current state)

Account: Azure for Students (no card, $100 credit), signed in with an SSUET student account. The subscription only allows these regions: East Asia, Malaysia West, Poland Central, Central India, UAE North. Everything is in **East Asia**. Resource group: **Huzi**. An old group, Huzaifa2, exists from a failed attempt; check it holds no leftover server.

| Resource | Name | Details |
|---|---|---|
| PostgreSQL Flexible Server | `sageant-db-fyp` | Burstable B1ms, 1 vCore, 2 GiB, 32 GiB, version 16.15, HA off, zone 2. Host `sageant-db-fyp.postgres.database.azure.com`. Admin user `huzaifa`. Database `sageant`. Public access on, "Allow public access from any Azure service" ticked (both confirmed by screenshot). |
| App Service plan | `ASP-Huzi-9659` | F1 (Free), Linux, 1 instance |
| Web App | `sageant-api` | .NET 10, code deployment. Live URL: `https://sageant-api-gfeyeddhhsbcdvcr.eastasia-01.azurewebsites.net` |
| Storage account | `sageantimages` | StorageV2, Standard, LRS. Blob container `sageantimages` (same name as the account). Keep it private. |

App settings already set on `sageant-api`: `ConnectionStrings__Default`, `ImageStorage__ConnectionString`, `ImageStorage__Container`.

Free-tier facts (re-check in the portal before relying on them): Postgres B1ms is free for 12 months counted from when the Azure account was created, up to 750 hours a month and 32 GB. Only one Postgres server may run. F1 has no Always On (cold start after idle) and a daily CPU quota, which matters for Shopify/WhatsApp webhooks. The storage account and App Service cost have not yet been confirmed as $0 in Cost Management. pgAdmin4 connects as server "Sageant_DB".

Problems already solved (do not repeat them):
- Server create failed with `SkuNotAvailable`, `RequestDisallowedByAzure` and a bad region ("Pakistan"). Fix was to use an allowed region (East Asia).
- pgAdmin "password authentication failed" was a stale saved password in the server's Connection tab. The second "no pg_hba.conf entry... no encryption" message is only pgAdmin retrying without SSL.
- Extensions must be allow-listed in the server parameter `azure.extensions` before `CREATE EXTENSION`. I was told to tick **VECTOR** and **PGCRYPTO**. `pgcrypto` failed with "not allow-listed" earlier. Status now: unconfirmed. Check with `SHOW azure.extensions;`.

## 4. Repository and deployment

- GitHub repo: `ragehuzi/sageant`, branch `main`. Local folder: `D:\sageant`.
- Current layout: `SageantWebApi/` (.NET 10 project with `SageantWebApi.csproj`, `SageantWebApi.slnx`, `Program.cs`, `Controllers/`, `Data/`, `Properties/launchSettings.json`, `appsettings*.json`), `.github/workflows/main_sageant-api.yml`, `README.md`, `.gitignore` (from `dotnet new gitignore`, already ignores `.env`; verified with `git check-ignore -v .env`).
- Planned monorepo layout: `api/` (or keep `SageantWebApi/`), `agents/`, `web/`, `db/` (schema and numbered SQL scripts), `deploy/`, `docs/`, plus root `CLAUDE.md`, `README.md`, `.env`, `.env.example`, `docker-compose.yml`. If the API folder is renamed, update the workflow paths.
- Deployment: Azure Deployment Center connected to the repo. GitHub Actions builds and publishes, App Service only runs the output. I edited the generated workflow so it triggers only on pushes to `main` that touch `SageantWebApi/**` or the workflow file (plus `workflow_dispatch`), and builds/publishes `SageantWebApi/SageantWebApi.csproj`. The first run failed (default paths), the second succeeded. Postman `GET /weatherforecast` on the live URL returned 200.
- Deployment mode is **code mode**: Dockerfiles are ignored by App Service. Docker is only for teammates running locally. Docker Compose is not built yet. Plan: one root `docker-compose.yml` for API and agents using the Azure database, optional local Postgres profile, root `.env` via `env_file`.
- Do not put Dockerfiles in `.gitignore`. They must be committed.

## 5. Configuration and secrets (how it works)

- Real values live in a git-ignored `D:\sageant\.env`. Keys use double underscores: `ConnectionStrings__Default`, `ImageStorage__ConnectionString`, `ImageStorage__Container`. Values containing spaces are in double quotes. `.env.example` (names, fake values) should be committed.
- `Program.cs` starts with `try { DotNetEnv.Env.TraversePath().Load(); } catch (FileNotFoundException) { }` so it finds the root `.env` and ignores the missing file on Azure.
- On Azure the same names come from App settings. `GetConnectionString("Default")` reads `ConnectionStrings:Default`; the database name `sageant` comes from `Database=` inside the value.
- `dotnet user-secrets` is the alternative for local values. Keep only one source, or keep them identical. Environment variables override `appsettings.json`.
- Local and deployed code both use the same hosted Azure database, so local writes land in the live data. Each teammate needs their IP in the Postgres firewall.
- Plan: create a restricted app role `sageant_app` (CONNECT, SELECT/INSERT/UPDATE/DELETE, sequence usage, default privileges) for the running API. Use `huzaifa` (admin) only for schema work and for now locally. Not done yet.
- Image settings are read by no code yet.

## 6. Code state

Packages in the project: `Microsoft.AspNetCore.OpenApi`, `Npgsql.EntityFrameworkCore.PostgreSQL`, `Microsoft.EntityFrameworkCore.Design`, `DotNetEnv`, `Swashbuckle.AspNetCore.SwaggerUI`. `BCrypt.Net-Next` was recommended but the build showed `CS0103: The name 'BCrypt' does not exist`, so it was not installed or restored. Resolve this first (`dotnet add SageantWebApi package BCrypt.Net-Next`, `dotnet restore`).

`Program.cs` currently: usings for `Microsoft.EntityFrameworkCore` and `SageantWebApi.Data`; DotNetEnv load; `AddControllers()`; `AddOpenApi()`; `AddDbContext<AppDbContext>(UseNpgsql(GetConnectionString("Default")))`; in Development only: `MapOpenApi()` and `UseSwaggerUI` with endpoint `/openapi/v1.json`, label "Sageant", `RoutePrefix = "sageant"` (UI at `https://localhost:7232/sageant`); then HTTPS redirection, authorization, `MapControllers()`, `Run()`. I was told to set `launchBrowser: true` and `launchUrl: "sageant"` in `Properties/launchSettings.json`; confirm it is done. Swagger is Development-only, so the Azure app does not show it.

Models are generated from the database (database-first), not hand-written:
```
dotnet ef dbcontext scaffold "Name=ConnectionStrings:Default" Npgsql.EntityFrameworkCore.PostgreSQL --project SageantWebApi --context AppDbContext --context-dir Data --output-dir Data/Entities --no-onconfiguring --force
```
Stop the running app first. Add `--table organisations` to limit it, and drop it to regenerate everything (with `--table`, other tables fall out of the context). Never edit `Data/Entities/*` or `Data/AppDbContext.cs` by hand; use partial classes. Scaffold gave `Organisation` with `OrgId, Name, Website, LogoStorageKey, Timezone, Currency, CreatedAt, UpdatedAt` and `DbSet<Organisation> Organisations`. It must be re-run after the `password_hash` column was added, so `PasswordHash` appears.

`OrganisationController` (route `api/sageant/[controller]`):
- `GET` returns the list with safe fields only (no hash).
- `POST verify` takes `record VerifyRequest([Required] long OrgId, [Required, MaxLength(150)] string Name, [Required, MaxLength(100)] string Password)`, loads the row by id and name, checks `BCrypt.Net.BCrypt.Verify(req.Password, org.PasswordHash)`, returns `401` with one generic message on any failure, and returns the safe fields on success. Hashes created with pgcrypto `crypt(..., gen_salt('bf'))` should verify with BCrypt.Net, but this is untested; if it fails, create the hash in C# instead (a small create endpoint).
- Earlier I changed the id route parameter from `long` to `int` because Swagger UI rejected the int64 path value. Use `FirstOrDefaultAsync(o => o.OrgId == id)`, not `FindAsync` with a mismatched type (`FindAsync` needs the exact key type, here `long`).

## 7. Database

Source of truth is `sageant_schema_draft3.sql` (in the Claude Project, 16 tables): `organisations, users, customers, categories, products, product_variants, product_images, inventory_levels, suppliers, purchases, purchase_items, orders, order_items, inventory_movements, messages`. It is multi-tenant: `org_id` on tenant tables, composite foreign keys `(org_id, id)`, JSONB columns, a generated column `available` in `inventory_levels`, partial unique indexes, `NULLS NOT DISTINCT`. The draft says: map composite FKs in EF with `HasForeignKey(new { OrgId, XId })` plus `HasPrincipalKey(new { OrgId, Id })`, and add a global query filter on `OrgId` taken from the JWT, never from the request body. Agent tables and Shopify sync tables come in a later draft. Images are stored in Blob Storage; the database stores only a `storage_key` path, not a URL.

Actually created in the live database so far: only `organisations`. I changed it from Draft 3: added `logo_storage_key VARCHAR(800)` and (by request) a `password_hash TEXT NOT NULL` column, dropped and recreated the table. Confirm the current columns in pgAdmin. Note the deviation: Draft 3's `organisations` has no password, while `users` has `password_hash`. An organisation-level password was my choice; reconcile it with the user/login design before building auth. Plan: run the rest of Draft 3 in a `sageant` Query Tool (check the tab says `sageant/huzaifa@...`), then re-scaffold. Save each change as numbered SQL in `db/` (`001_...sql`).

## 8. API conventions and decisions

- Use a modular, feature-folder structure in one project (not Clean Architecture with many projects): `Features/<Name>/` (controller, service, DTOs), `Integrations/` (Shopify, WhatsApp, Storage, each behind an interface), `Data/`, `Common/` (ApiResponse, ApiError, exception middleware). Folders need no configuration in .NET; register each feature's services in an extension method. The current code is still flat.
- Business rules (stock arithmetic, approval rules, WhatsApp window checks) are plain code in services; controllers stay thin.
- I said I wanted simple code and did not want DTOs for now, so entities are returned directly except where a secret is involved (never return `password_hash`). DTOs are recommended as tables grow; avoid creating them unless I ask.
- Request validation with attributes on record parameters; generic `401` messages; POST with a JSON body for credentials; hash in the app (BCrypt) rather than in SQL. Real auth later: JWT, with `[Authorize]` and `OrgId` from the token.
- Write the response/error format once in `docs/api-conventions.md` (suggested: success as `{ "data": ... }`, error as `{ "error": { "code", "message", "details" } }`). Not written yet.
- Image URLs: the API currently returns only `logoStorageKey` (a path). Undecided: private container with short-lived SAS links (recommended) versus a public container. Blob code is not written yet (needs `Azure.Storage.Blobs` and the `ImageStorage:*` settings).
- Claude Code files plan: root `CLAUDE.md` (short, always read), `api/CLAUDE.md` and `agents/CLAUDE.md` only when they have their own rules, `.claude/settings.json` with permissions and hooks (for example a hook that blocks editing `.env`), `docs/GUARDRAILS.md`. Check the current Claude Code docs for exact hook syntax.

## 9. Open items

1. Install and restore `BCrypt.Net-Next`; rebuild.
2. Confirm `PGCRYPTO` and `VECTOR` are in `azure.extensions`, and the `organisations` table has `password_hash`; re-run scaffold.
3. Run `/api/sageant/Organisation` and `/verify` locally in Swagger, then push and test on Azure (the app settings and firewall are already in place).
4. Run the rest of the Draft 3 schema and re-scaffold.
5. Create `sageant_app` and switch the deployed app to it.
6. Write blob/image code and decide SAS versus public.
7. Check Cost Management shows $0 for Postgres, App Service and storage, and confirm the end date of the 12-month free offer (must run past 30 Apr 2027).
8. Commit `.env.example`, `CLAUDE.md`, Docker files, and numbered SQL scripts. Add a Dockerfile and `docker-compose.yml` for teammates.
9. Create the `agents/` (CrewAI) and `web/` folders; deploy CrewAI as a second service in East Asia later.

## 10. First task for you

Read the repo, confirm the state above against the real files (especially `Program.cs`, the controller, `Data/Entities/Organisation.cs`, the workflow and `launchSettings.json`), list any difference, and fix the build error from item 1. Then stop and wait for my next instruction.
