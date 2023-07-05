# Set the base image to Node 17.1.0-alpine
FROM node:17.1.0-alpine

# Set the working directory for all subsequent commands
WORKDIR /app/admin

# Copy the package.json and yarn lock files to the working directory
COPY package.json .
COPY yarn.* .

# Run the apk update command to update package information
RUN apk update

# Install sharp to enable image precessing
RUN yarn add sharp --network-timeout 1000000

# Install the dependencies
RUN yarn --network-timeout 1000000

# Copy all files in the current directory (.) to the working directory in the container
COPY . .

# Run the yarn build command to build the application
RUN yarn build

# Set the default command to serve the built application
ENTRYPOINT [ "yarn", "serve"]