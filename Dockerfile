# Build stage
FROM docker.repo.stinascloud.ir/node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the app
RUN npm run build

# Final image
FROM docker.repo.stinascloud.ir/nginx:1.27.2

# Copy build files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Set up Nginx configuration inline
COPY /deployments/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY /deployments/scripts/docker-entrypoint.sh ./docker-entrypoint.sh

# List contents of nginx html directory (for debugging)
RUN ls -la /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run the entrypoint script which injects environment variables and starts Nginx
CMD ["./docker-entrypoint.sh"]
