# Installs Node.js image
FROM node:16.15-alpine3.14
# Create app directory
WORKDIR /usr/src/backend
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied

COPY package*.json ./
RUN npm install
#Copy other source files and folders
COPY index.js ./
COPY ./controllers ./controllers
COPY ./csv ./csv
COPY ./routes ./routes
COPY .env.* ./
#expose port 3000 for server
EXPOSE 3000
#start commands
CMD [ "npm", "start" ]