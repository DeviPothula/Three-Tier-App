# Step 1: Build the React app
FROM node:18-alpine AS build

# Setting working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install the required dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the application
RUN npm run build

# Step 2: Serve the app using Nginx
FROM nginx

# Copy the build output to Nginx's web directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port 80 for nginx server
EXPOSE 80

# Start the application
CMD ["nginx", "-g", "daemon off;"]
