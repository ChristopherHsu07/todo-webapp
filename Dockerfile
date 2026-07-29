# Dockerfile is the instructions on how to build a container for our project

# use an official node.js runtime as a parent image ()
FROM node:22-alpine

# set the working directory in the container
WORKDIR /app

# Copy the package.json and the package-lock.json files to the container
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
# Docker reads top down, so if we change source code,
# it will only rerun this command. Otherwise, it'll reinstall and rewrite everything
COPY . .

RUN npx prisma generate

# Expose the port that the app runs on
EXPOSE 3000

# define the command to run the application
CMD ["node", "./src/server.js"]