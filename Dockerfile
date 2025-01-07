# Stage 1: Build the Next.js app
FROM node:18 AS builder

WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application files
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Serve the built app with a minimal image
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Install only production dependencies
RUN npm install --force

# Set environment variable to run Next.js in production mode
ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
