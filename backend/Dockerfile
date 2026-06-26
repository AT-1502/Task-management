# Backend Dockerfile for Task Manager
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
