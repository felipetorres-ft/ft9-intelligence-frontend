# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files from root
COPY package.json pnpm-lock.yaml ./

# Copy all necessary directories
COPY client ./client
COPY server ./server
COPY shared ./shared
COPY patches ./patches

# Install pnpm
RUN npm install -g pnpm@latest

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the project
RUN pnpm build

# Production stage
FROM nginx:alpine

# Copy built files from dist directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
