# Build the frontend 
FROM node:latest as build

# Set working directory for frontend
WORKDIR /app

# Copy package.json and package-lock.json
COPY . .

# Install npm dependencies
RUN npm install --force 
RUN npm install grunt-cli -g --force 
RUN grunt

# Use an ubuntu image
FROM ubuntu:latest

# Update the package lists and install Nginx
RUN apt-get update && apt-get install -y nginx

# Remove default Nginx configuration
RUN rm /etc/nginx/sites-enabled/default


# Install OpenJDK 11
RUN apt-get install -y openjdk-11-jdk
  
# Copy the contents of your HTML folder to the container
COPY --from=build /app/deploy /var/www/html


# Start Fuseki & Nginx server
WORKDIR /fuseki
COPY --from=build /app/libs/fuseki .

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8000,3030 
EXPOSE 8000
EXPOSE 3030


# Start Nginx service
CMD java -jar fuseki-server.jar --update --loc=db /dataset &  nginx -g "daemon off;"
