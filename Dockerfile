# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies and build
RUN npm install && npm run build

# Expose port and start
EXPOSE 3000
CMD ["npm", "start"]

