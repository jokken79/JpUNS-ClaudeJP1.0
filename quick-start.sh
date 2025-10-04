#!/bin/bash

# ===========================================
# FactoryFlow HR - Quick Start Script
# ===========================================

set -e

echo "🏭 FactoryFlow HR - Quick Start"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed."
    echo "Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed."
    echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker is installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env

    echo ""
    echo "⚠️  IMPORTANT: You need to configure your GEMINI_API_KEY"
    echo ""
    echo "1. Get your API key from: https://makersuite.google.com/app/apikey"
    echo "2. Edit .env file and replace 'your_gemini_api_key_here' with your actual API key"
    echo ""
    read -p "Press Enter to open .env file in default editor..."

    # Try to open .env with common editors
    if command -v nano &> /dev/null; then
        nano .env
    elif command -v vim &> /dev/null; then
        vim .env
    elif command -v vi &> /dev/null; then
        vi .env
    else
        echo "Please manually edit .env file and add your GEMINI_API_KEY"
        echo "File location: $(pwd)/.env"
        read -p "Press Enter when you're done editing..."
    fi
else
    echo "✅ .env file exists"
fi

# Check if GEMINI_API_KEY is set
if grep -q "your_gemini_api_key_here" .env; then
    echo ""
    echo "❌ Error: GEMINI_API_KEY is not configured in .env"
    echo "Please edit .env and add your API key before continuing."
    exit 1
fi

echo ""
echo "🐳 Starting Docker containers..."
echo ""

# Use docker compose (new) or docker-compose (old)
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Build and start containers
$DOCKER_COMPOSE up -d --build

echo ""
echo "⏳ Waiting for application to start..."
sleep 5

# Check if container is running
if $DOCKER_COMPOSE ps | grep -q "Up"; then
    echo ""
    echo "✅ FactoryFlow HR is now running!"
    echo ""
    echo "🌐 Access the application at:"
    echo "   http://localhost:9002"
    echo ""
    echo "📊 Useful commands:"
    echo "   View logs:    $DOCKER_COMPOSE logs -f"
    echo "   Stop:         $DOCKER_COMPOSE down"
    echo "   Restart:      $DOCKER_COMPOSE restart"
    echo "   Rebuild:      $DOCKER_COMPOSE up -d --build"
    echo ""

    # Try to open browser (optional)
    read -p "Open browser? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if command -v xdg-open &> /dev/null; then
            xdg-open http://localhost:9002
        elif command -v open &> /dev/null; then
            open http://localhost:9002
        else
            echo "Please open http://localhost:9002 in your browser"
        fi
    fi
else
    echo ""
    echo "❌ Error: Container failed to start"
    echo "Check logs with: $DOCKER_COMPOSE logs"
    exit 1
fi
