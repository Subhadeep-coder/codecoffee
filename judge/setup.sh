#!/bin/bash

# Pull required Docker images
echo "Pulling required Docker images..."
docker pull gcc:12.4.0-bookworm
docker pull openjdk:17-alpine
docker pull python:3.11-alpine
docker pull node:20-alpine

# Verify images
echo "Verifying Docker images..."
docker images | grep -E 'gcc|openjdk|python|node'

echo "Setup complete!"
