# Stage 1: Build the Next.js app
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Serve the built app with a minimal image
FROM node:22-bookworm-slim AS runner

WORKDIR /app

# Ensure production dependencies only
ENV NODE_ENV=production

# Copy built files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install only production dependencies using the lockfile
RUN npm ci --omit=dev

# Expose port 3000
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
