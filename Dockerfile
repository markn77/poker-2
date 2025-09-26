FROM node:18-alpine

WORKDIR /app

# Copy root package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy server package files and install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy all application code
COPY . .

# Expose the port your server runs on
EXPOSE 3001

# Start the server (only runs during start phase, not build)
CMD ["sh", "-c", "cd server && node server.js"]