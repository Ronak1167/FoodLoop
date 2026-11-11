# Stage 1: Build the Vite React Frontend
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Production Server Runner
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Install Server Dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copy Server Source Code
COPY server/ ./server/

# Copy Pre-built Client Dist into app
COPY --from=client-builder /app/client/dist ./client/dist

# Expose port
EXPOSE 5000

# Start unified full-stack server
CMD ["node", "server/src/server.js"]

