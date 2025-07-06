FROM openjdk:11-alpine

# Security updates
RUN apk update && apk upgrade

# Create non-root user
RUN adduser -D -s /bin/sh judgeuser

# Set working directory
WORKDIR /app

# Switch to non-root user
USER judgeuser

# Default command
CMD ["java"]