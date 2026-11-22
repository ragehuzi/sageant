# Sageant: working rules for Claude

Project: .NET 10 Web API (`SageantWebApi/`) with EF Core and PostgreSQL on Azure. Models are generated from the database. Details are in the repo, so read it before asking me things the files already answer.

## Ask first, always
- Never guess. If anything is confusing, stop and ask me which way to go.
- If I ask a question or my prompt is unclear, do not write code. Ask first.
- Before you edit, rename or delete any file, tell me what and why, and wait for my yes.
- Never delete anything (files, code, tables, Azure resources) without my clear yes.

## Keep it simple
- Do only what I asked. No extra features, no "nice to have" code.
- No extra classes, files or layers unless I ask.
- Do not overpromise. Only suggest things that can really be done in this project.
- If a request is too big or unclear, say so and propose a smaller step.

## Packages
- After writing code, check that every NuGet package it uses is installed (`dotnet list SageantWebApi package`).
- If an uncommon package is missing, install it with `dotnet add SageantWebApi package <name>`, then build to confirm.
- Run `dotnet build SageantWebApi` after changes and tell me the result.

## Comments
- Write short comments in easy words.
- One line only. No long paragraphs.

## Git and GitHub
- Never run git or GitHub commands (no add, commit, push, pull, merge, branch).
- Only tell me the command and I will run it myself.

## Secrets
- Never read, print or edit `.env`. Never put passwords or keys in code.
- Do not edit generated files in `Data/Entities/` or `Data/AppDbContext.cs`. Tell me to re-run the scaffold command instead.
