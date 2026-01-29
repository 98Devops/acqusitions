![API Banner](assets/api-banner.png)

# acquisitions — Docker + Neon Local setup

Quick guide to run the app locally with Neon Local (development) and how to deploy with Neon Cloud (production).

Prerequisites:

- Docker and Docker Compose installed
- Node.js (for local development outside containers)

Development (Neon Local):

1. Copy the development env sample and adjust values if needed:

```bash
cp .env.development.sample .env.development
# edit .env.development to set ARCJET_KEY etc.
```

2. Start Neon Local and the app (builds the image and mounts source for live reload):

```bash
docker compose -f docker-compose.dev.yml up --build
```

Neon Local will run a Postgres proxy on the compose network at `neon-local:5432`. The app reads `DATABASE_URL` from `.env.development` (example: `postgres://user:password@neon-local:5432/dbname`). Neon Local can create ephemeral branches for development.

Production (Neon Cloud):

1. Create `.env.production` from the sample and set `DATABASE_URL` to your Neon Cloud URL:

```bash
cp .env.production.sample .env.production
# set DATABASE_URL=postgres://...your-project.neon.tech... and ARCJET_KEY
```

2. Build and run production container (or use your CI/CD to build/push image):

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Notes:

- The production compose file does not run Neon Local; it expects `DATABASE_URL` to point to Neon Cloud.
- Secrets must be provided via environment variables; do not commit real secrets.
- If you need persistent Neon Local branches per git branch, keep the `.neon_local` volume mapping.
  A production-ready authentication microservice following clean architecture principles with Express 5, Drizzle ORM, and Neon serverless PostgreSQL. It implements secure authentication patterns (bcrypt + JWT), input validation (Zod), structured logging (Winston), and follows modern JavaScript practices with ES modules and subpath imports. The codebase is well-organized into routes → controllers → services → models layers, making it maintainable and testable, though it currently needs completion of sign-in/sign-out flows and authentication middleware for protected routes.
