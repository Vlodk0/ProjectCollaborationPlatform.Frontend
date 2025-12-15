# Stage: Development
# Use lightweight Node.js base image
FROM node:18-alpine

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Set working directory
WORKDIR /app

# Copy only dependency definitions
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose development server port
EXPOSE 4200

# Start Angular development server
CMD ["ng", "serve", "--host", "0.0.0.0"]

