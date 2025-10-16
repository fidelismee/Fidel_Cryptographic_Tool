# Fidel Cryptographic Tool - Docker Deployment Guide

## Overview
This project is dockerized into a single image containing both the React frontend and Flask backend, served through nginx.

## Docker Image Details

**Image Name:** `fidel-crypto-tool`

**Ports:**
- `80` - Frontend (served by nginx)
- `5000` - Backend API (Flask)

## Building the Docker Image

```bash
# Build the image
docker build -t fidel-crypto-tool .

# Tag for registry (optional)
docker tag fidel-crypto-tool your-registry/fidel-crypto-tool:latest
```

## Running the Container

### Basic Usage
```bash
docker run -d -p 80:80 --name fidel-crypto fidel-crypto-tool
```

### With Environment Variables
```bash
docker run -d \
  -p 80:80 \
  -e ENCRYPTION_KEY="your-encryption-key-here" \
  --name fidel-crypto \
  fidel-crypto-tool
```

### Production Deployment
```bash
docker run -d \
  -p 80:80 \
  -e ENCRYPTION_KEY="your-secure-encryption-key" \
  --restart unless-stopped \
  --name fidel-crypto \
  fidel-crypto-tool
```

## Environment Variables

- `ENCRYPTION_KEY` (optional): AES encryption key. If not provided, a new key will be generated on first run.

## Health Check

The container includes a health check endpoint:
```bash
curl http://localhost:5000/health
```

## Docker Compose (Alternative)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  fidel-crypto:
    build: .
    ports:
      - "80:80"
    environment:
      - ENCRYPTION_KEY=your-secure-key-here
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## Pushing to Registry

```bash
# Login to your registry
docker login your-registry.com

# Tag and push
docker tag fidel-crypto-tool your-registry.com/fidel-crypto-tool:latest
docker push your-registry.com/fidel-crypto-tool:latest
```

## Server Deployment

1. **Transfer the image to your server:**
   ```bash
   # Save image to tar file
   docker save fidel-crypto-tool > fidel-crypto-tool.tar
   
   # Transfer to server (using scp)
   scp fidel-crypto-tool.tar user@your-server:/path/to/
   
   # On server, load the image
   docker load < fidel-crypto-tool.tar
   ```

2. **Run on server:**
   ```bash
   docker run -d -p 80:80 --name fidel-crypto fidel-crypto-tool
   ```

## Troubleshooting

### Check Container Status
```bash
docker ps
docker logs fidel-crypto
```

### Health Check
```bash
curl http://localhost/health
```

### Stop and Remove
```bash
docker stop fidel-crypto
docker rm fidel-crypto
```

## Architecture

- **Frontend:** React/Vite app built and served as static files by nginx
- **Backend:** Flask API running on port 5000
- **Proxy:** nginx serves frontend on port 80 and proxies `/api/*` to backend
- **Single Container:** All services run in one container managed by the startup script
