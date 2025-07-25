# Container Usage Guide for Coloris Game

This document explains how to use container images for Coloris, a tetris-like game. While we primarily use Docker, we've included instructions for modern alternatives as well.

## Available Docker Images

The Coloris game is automatically built and published as a Docker image to the GitHub Container Registry.

### Image Registry

```
ghcr.io/mangobanaani/coloris
```

### Available Tags

- `latest`: Most recent build from the main branch
- `main`: Latest build from the main branch
- `<commit-sha>`: Specific commit version (e.g., `ghcr.io/mangobanaani/coloris:abc123def456`)
- `v1.0.0`: Specific release version (when tagged)

## Running the Docker Image

### Basic Usage

```bash
docker run -p 3000:3000 ghcr.io/mangobanaani/coloris:latest
```

Then open your browser to http://localhost:3000

### Custom Port

```bash
docker run -p 8080:3000 ghcr.io/mangobanaani/coloris:latest
```

Then open your browser to http://localhost:8080

## Docker Compose Example

Create a `docker-compose.yml` file:

```yaml
version: '3'
services:
  coloris:
    image: ghcr.io/mangobanaani/coloris:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

Then run:

```bash
docker-compose up
```

## Building the Docker Image Locally

To build the Docker image locally:

```bash
docker build -t coloris:local .
docker run -p 3000:3000 coloris:local
```

## Environment Variables

- `PORT`: The port the server will listen on (default: 3000)
- `HOSTNAME`: The hostname to bind to (default: 0.0.0.0)

## Modern Container Alternatives

While Docker remains popular, you might prefer using one of these modern alternatives:

### Podman

Podman is a daemonless container engine compatible with Docker:

```bash
# Install Podman (on macOS)
brew install podman

# Initialize Podman machine (macOS)
podman machine init
podman machine start

# Run the Coloris container with Podman
podman run -p 3000:3000 ghcr.io/mangobanaani/coloris:latest
```

### Buildah

Buildah is focused on building OCI container images:

```bash
# Install Buildah (on macOS)
brew install buildah

# Build an image with Buildah from Dockerfile
buildah bud -t coloris:local .

# Run with Podman
podman run -p 3000:3000 coloris:local
```

### Lima (macOS)

Lima provides a Linux virtual machine with automatic file sharing:

```bash
# Install Lima
brew install lima

# Start with Docker template
limactl start template://docker

# Use Docker CLI with Lima
docker run -p 3000:3000 ghcr.io/mangobanaani/coloris:latest
```

### Kubernetes Deployment

For production environments, you might prefer Kubernetes:

```yaml
# coloris-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: coloris
spec:
  replicas: 2
  selector:
    matchLabels:
      app: coloris
  template:
    metadata:
      labels:
        app: coloris
    spec:
      containers:
      - name: coloris
        image: ghcr.io/mangobanaani/coloris:latest
        ports:
        - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: coloris-service
spec:
  selector:
    app: coloris
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

Apply with:

```bash
kubectl apply -f coloris-deployment.yaml
```

## License

This project is licensed under the GNU GPL v3.0 License.
