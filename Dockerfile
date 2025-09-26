FROM node:18-alpine

WORKDIR /app

# Copy and install root dependencies (React app)
COPY package*.json ./
RUN npm install

# Copy and install server dependencies
COPY server/package*.json ./server/
RUN npm install --prefix ./server

# Copy all application code
COPY . .

# Build React app for production
RUN npm run build

# Change to server directory
WORKDIR /app/server

# Expose port 8080 (Railway assigns this)
EXPOSE 8080

CMD ["node", "server.js"]