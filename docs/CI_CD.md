# CI/CD

## What you have

| Part | Where | What it does |
|------|--------|--------------|
| **CD (Deploy)** | Render | Push to `main` → Render builds and deploys automatically. No extra setup. |
| **CI (Test)** | GitHub Actions | On every push/PR to `main` or `master`, runs tests in the cloud. |

## CI workflow

- **File:** `.github/workflows/ci.yml`
- **Runs on:** Push and pull requests to `main` or `master`
- **Steps:** Install deps → Prisma generate → Migrate DB → Seed → `npm test`
- **Database:** Uses a temporary Postgres 15 service in the workflow (not your Neon DB).

## Do you need to do anything?

- **Render:** Already deploys on push. Nothing to change.
- **GitHub:** Push the repo (including `.github/workflows/ci.yml`). Actions will run on the next push or PR. Check the **Actions** tab on GitHub.

## Branch names

If your default branch is not `main` or `master`, either rename it or edit `ci.yml` and change the `branches` list to match.
