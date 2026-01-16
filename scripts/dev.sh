#!/bin/bash

# Development startup script for Acquisition App with Neon Local
# This script starts the application in development mode with Neon Local

echo "🚀 Starting Acquisition App in Development Mode"
echo "================================================"

# Check if .env.development exists
if [ ! -f .env.development ]; then
    echo "❌ Error: .env.development file not found!"
    echo "   Please copy .env.development from the template and update with your Neon credentials."
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "   Please start Docker Desktop and try again."
    exit 1
fi

# Create .neon_local directory if it doesn't exist
mkdir -p .neon_local

# Add .neon_local to .gitignore if not already present
if ! grep -q ".neon_local/" .gitignore 2>/dev/null; then
    echo ".neon_local/" >> .gitignore
    echo "✅ Added .neon_local/ to .gitignore"
fi

echo "📦 Building and starting development containers..."
echo "   - Neon Local proxy will create an ephemeral database branch"
echo "   - Application will run with hot reload enabled"
echo ""

# Start Neon Local detached so the proxy is available for migrations
echo "📦 Starting Neon Local (detached)..."
docker compose -f docker-compose.dev.yml up -d neon-local

# Wait for the database to be ready (retry loop)
echo "⏳ Waiting for the database to be ready..."
RETRIES=30
until docker compose -f docker-compose.dev.yml exec -T neon-local pg_isready -h localhost -p 5432 -U neon >/dev/null 2>&1 || [ $RETRIES -le 0 ]; do
    echo "  waiting for neon-local... ($RETRIES)"
    sleep 2
    RETRIES=$((RETRIES - 1))
done
if [ $RETRIES -le 0 ]; then
    echo "❌ neon-local did not become ready in time"
    docker compose -f docker-compose.dev.yml logs neon-local --tail=50
    exit 1
fi

# Run migrations with Drizzle (now that Neon Local is up)
echo "📜 Applying latest schema with Drizzle..."
npm run db:migrate

# Start application (attach, with build)
echo "📦 Starting application service..."
docker compose -f docker-compose.dev.yml up --build app

echo ""
echo "🎉 Development environment started!"
echo "   Application: http://localhost:5173"
echo "   Database: postgres://neon:npg@localhost:5432/neondb"
echo ""
echo "To stop the environment, press Ctrl+C or run: docker compose down"