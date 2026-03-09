FROM node:20-alpine

WORKDIR /app

# Install all dependencies (including dev) to allow TypeScript build
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build && npm prune --omit=dev

ENV NODE_ENV=production
EXPOSE 3000

# Run migrations first; if they fail, still start (may already be applied)
CMD ["sh", "-c", "npm run migrate || true; node dist/index.js"]
