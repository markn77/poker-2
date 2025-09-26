FROM node:18-alpine

WORKDIR /app

# Copy and install root dependencies
COPY package*.json ./
RUN npm install

# Copy and install server dependencies
COPY server/package*.json ./server/
RUN npm install --prefix ./server

# Copy all application code
COPY . .

# Change to server directory and start
WORKDIR /app/server
EXPOSE 3001

CMD ["node", "server.js"]