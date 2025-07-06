#!/bin/bash

# Create and set permissions for the execution directory
sudo mkdir -p /var/tmp/execution
sudo chmod 777 /var/tmp/execution

# Ensure Docker service is running
if ! systemctl is-active --quiet docker; then
    echo "Docker is not running. Starting Docker..."
    sudo systemctl start docker
fi

# Add current user to docker group if not already added
if ! groups | grep -q docker; then
    echo "Adding current user to docker group..."
    sudo usermod -aG docker $USER
    echo "Please log out and log back in for group changes to take effect"
fi

# Pull required Docker images
echo "Pulling required Docker images..."
docker pull gcc:12.4.0-bookworm
docker pull openjdk:17-alpine
docker pull python:3.11-alpine
docker pull node:20-alpine

echo "Setup complete!"
