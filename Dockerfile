# ---- Base Image ----
    FROM node:22.12.0-alpine3.20 AS base
    RUN npm install -g pnpm@9.15.1
    
    WORKDIR /app/chess-royale
    COPY . . 
    COPY package.json pnpm-lock.yaml ./
    
    # ---- Dependencies Layer ----
    FROM base AS deps
    RUN pnpm install --frozen-lockfile
    
    # Optional: Ensure that Prisma is correctly generated
    RUN cd packages/database/prisma && pnpm prisma generate 
    
    # Expose only ports needed for development (if any)
    EXPOSE 3000 3001 8080 6379
    
    # Default command to keep the container running, you can adjust it later
    CMD ["pnpm", "install"]
    