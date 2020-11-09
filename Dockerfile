FROM node:10.15.0-alpine

# Create dir in container
RUN mkdir /home/dockerServerJS

# Create app code directory
WORKDIR /home/dockerServerJS

# Bundle app source
COPY . /home/dockerServerJS

# Install app dependencies
RUN npm install

EXPOSE 8080

CMD ["node", "server.js"]
