# GitHub Actions CI/CD Workflows

This directory contains three GitHub Actions workflows for automated CI/CD pipeline:

## 🔍 Workflows Overview

### 1. `lint-and-format.yml` - Code Quality

**Triggers:** Push/PR to `main` and `staging` branches

- Runs ESLint to check code quality
- Validates Prettier formatting
- Provides clear error messages with fix suggestions
- Fails fast if issues are found

### 2. `tests.yml` - Testing & Coverage

**Triggers:** Push/PR to `main` and `staging` branches

- Sets up PostgreSQL test database
- Runs Jest tests with coverage
- Uploads coverage reports as artifacts (30-day retention)
- Generates detailed test summaries
- Provides annotations for failures

### 3. `docker-build-and-push.yml` - Container Deployment

**Triggers:** Push to `main` branch or manual dispatch

- Builds multi-platform Docker images (amd64/arm64)
- Pushes to Docker Hub with multiple tags
- Uses build caching for efficiency
- Generates deployment summaries

## 🔧 Required Secrets

Add these secrets to your GitHub repository settings:

```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password-or-token
```

## 📋 Workflow Features

### Lint and Format Workflow

- ✅ Node.js 20.x with npm caching
- ✅ ESLint with auto-fix suggestions
- ✅ Prettier formatting validation
- ✅ Clear error annotations

### Tests Workflow

- ✅ PostgreSQL service container
- ✅ Environment variables for testing
- ✅ Coverage report generation
- ✅ Artifact uploads
- ✅ GitHub step summaries
- ✅ Test failure annotations

### Docker Workflow

- ✅ Multi-platform builds (linux/amd64, linux/arm64)
- ✅ Docker Buildx setup
- ✅ Metadata extraction with multiple tags
- ✅ Build caching (GitHub Actions cache)
- ✅ Production-optimized Dockerfile
- ✅ Security best practices

## 🏷️ Docker Tags Generated

The Docker workflow creates these tags:

- `latest` (main branch only)
- `main-<commit-sha>` (branch + commit)
- `prod-YYYYMMDD-HHmmss` (timestamped production)

## 🚀 Usage

1. **Development:** Push to feature branches triggers lint/test workflows
2. **Staging:** Push/PR to `staging` triggers all quality checks
3. **Production:** Push to `main` triggers full pipeline including Docker build
4. **Manual Deploy:** Use workflow_dispatch to manually trigger Docker builds

## 📊 Monitoring

- Check workflow status in the Actions tab
- Review coverage reports in workflow artifacts
- Monitor Docker image builds and tags
- Use GitHub step summaries for quick status overview

## 🔒 Security Features

- Non-root Docker user
- Multi-stage builds for minimal attack surface
- Production-only dependencies in final image
- Health checks included
- Secrets properly managed
