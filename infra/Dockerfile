FROM node:20-slim
WORKDIR /app
COPY package.json ./
RUN npm install --omit=optional || true
COPY . .
CMD ["node", "services/orchestrator/server.js"]
