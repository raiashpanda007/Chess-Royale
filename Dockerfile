# ---- Base Image ----
    FROM node:22.12.0-alpine3.20 AS base
    RUN npm install -g pnpm@9.15.1
    
    WORKDIR /app/chess-royale
    COPY . . 
    COPY package.json pnpm-lock.yaml ./
    
    # ---- Dependencies Layer ----
    FROM base AS deps
    RUN pnpm install --frozen-lockfile
    
    # ---- Build Layer ----
    FROM base AS builder
    COPY --from=deps /app/chess-royale/node_modules ./node_modules
    RUN pnpm turbo run build --filter=...
    
    # ---- Production Layer ----
    FROM node:22.12.0-alpine3.20 AS runner
    WORKDIR /app/chess-royale
    
    COPY --from=builder /app/chess-royale/apps/backend ./apps/backend
    COPY --from=builder /app/chess-royale/apps/frontend ./apps/frontend
    COPY --from=builder /app/chess-royale/packages/database ./packages/database
    COPY --from=deps /app/chess-royale/node_modules ./node_modules
    COPY package.json pnpm-lock.yaml ./
    
    # Prisma: Ensure database migrations & client generation
    RUN pnpm prisma generate --schema=packages/database/prisma/schema.prisma
    
    # Expose necessary ports
    EXPOSE 3000 3001 8080 6379
    
    # Start the application (adjust if needed)
    CMD ["pnpm", "start"]
    