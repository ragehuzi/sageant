# CLAUDE.md

## File Access Rules (STRICT — NEVER BREAK)

- **Root / working folder:** `D:\sageant\SageantFrontend`
- **Write access:** ONLY inside `D:\sageant\SageantFrontend`. Code, create, edit, and delete files here only.
- **Read-only access:** the rest of `D:\sageant` (e.g. `D:\sageant\SageantWebApi`) may be read for clarity and context, but must NEVER be modified, created in, deleted from, or otherwise changed.
- **No access beyond `D:\sageant`:** never move outside it.
- This applies to every tool and command (Write, Edit, Bash, PowerShell, git, package installs, scripts, etc.). Do not run commands that alter anything outside `D:\sageant\SageantFrontend`.
- If a task seems to require a change outside `SageantFrontend`, stop and tell the user instead of doing it.

## Frontend Design Skills (ALWAYS USE)

Whenever writing or changing frontend/UI code in this project, invoke these skills first (installed in `.claude/skills/`):

- **impeccable** — for designing, building, critiquing, auditing, polishing and animating any UI.
- **ui-ux-pro-max** — for style, palette, typography, UX and accessibility decisions.
- **stageshow** — only when the task is faux/mock product UI (demo windows, hero illustrations, animated cursor walkthroughs), not for real app screens.

### Skill bootstrap (MUST run before any frontend code)

At the start of any frontend/UI task, check that these exist in `D:\sageant\SageantFrontend\.claude\skills\`:
`impeccable/SKILL.md`, `ui-ux-pro-max/SKILL.md`, `stageshow/SKILL.md`.

If any is missing, install it first, then use it. Do not write frontend code until they are installed:

| Skill | Repo | Folder to copy from repo |
|---|---|---|
| impeccable | https://github.com/pbakaus/impeccable | `.claude/skills/impeccable` |
| ui-ux-pro-max | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | `.claude/skills/ui-ux-pro-max` |
| stageshow | https://github.com/benjitaylor/skills | `stageshow` |

Install steps (stay inside `SageantFrontend`, per the File Access Rules):
1. `git clone --depth 1 <repo> .claude/.skill-src/<name>`
2. Copy only the folder listed above into `.claude/skills/<name>/`.
3. Skim the skill's `SKILL.md` and scripts before use; skip anything that looks malicious.
4. Delete `.claude/.skill-src/`.
5. Newly installed project skills load at session start, so if the Skill tool doesn't list them, read the skill's `SKILL.md` directly and follow it, and tell the user to restart the session.

Alternative if Node is installed: `npx skills add <repo> --skill <name>`.

## Brand Colour Palette (USE THESE ONLY)

Keep these as CSS variables in `src/index.css`; never hard-code hex values in components. This palette replaces all earlier ones.

| Token | Name | Hex | Use |
|---|---|---|---|
| `--cream` | Cream White | `#F5F8F2` | Page background |
| `--paper` | Paper | `#FBFDF9` | Slightly lighter areas (form side of auth pages) |
| `--white` | White | `#FFFFFF` | Cards, modals, tables, inputs |
| `--sage` | Sage Green | `#9CB8A4` | Panels and big soft backgrounds (auth left panel, CTA band) |
| `--mint-soft` | Mint | `#D6EBDD` | Light surfaces and hover states |
| `--jade` | Jade / Teal | `#2FA58A` | Main brand colour: fills, dots, rings, decoration. Only 3.1:1 with white, so not behind text |
| `--jade-strong` | Deep Jade | `#1F7A66` | Jade darkened to 5.2:1 with white: primary buttons, link text, focus ring |
| `--teal` | Deep Teal-Slate | `#16403B` | Headings and small dark anchors (footer, dark cards). Replaces forest green |
| `--brass` | Brass | `#B8954A` | The single small accent: rule lines, badges. Never as text |
| `--slate` | Slate | `#475569` | Body text and secondary UI |
| `--terracotta` | Terracotta | `#C0683F` | Alerts and highlights (e.g. a shortage) |
| `--sky` | Sky Blue | `#3B82F6` | Info / processing, analytics |
| `--mint` | Mint Green | `#10B981` | Success |
| `--amber` | Amber | `#F59E0B` | Pending status |
| `--rose` | Rose | `#EF4444` | Error / failed |

Ink tokens for text on tinted chips: `--brass-ink`, `--terracotta-ink`, `--amber-ink`, `--sky-ink`.

Rules:
- Deep teal is for headings and small dark anchors only, not big surfaces.
- Avoid purple, neon and pastel pink. Blue is only for info/analytics.
- Status colours carry meaning: mint = done, terracotta = alert, sky = info/processing, amber = pending, rose = failed. Don't use them as decoration.
- Always pair a status colour with an icon or label, never colour alone.
- Text needs 4.5:1 contrast. Use teal, jade-strong or slate for text; teal on sage is 5.4:1, but slate on sage is only 3.5:1, so don't put slate text on sage.
- Logos are dark on light. Keep them on cream, paper, mint or white. On sage the lockup works; on dark surfaces use the solid app icon (`public/favicon.png`) plus a white wordmark.
