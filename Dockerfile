# Use the latest LTS version of Node (v20) which satisfies Angular CLI requirements.
FROM node:20-alpine as build

# Setting WORKDIR and copying package files remains the same
WORKDIR /app
COPY ./package*.json .

# Install dependencies
RUN npm ci

# Copy the rest of the source code and run the build
COPY . .
RUN npm run build

# --- Production Stage ---
# Nginx base image remains the same
FROM nginx:1.23.0-alpine
# Standard Cloud Run port recommendation (you can also use 80)
EXPOSE 8080
# Copy Nginx config and built artifacts
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/ /usr/share/nginx/html
