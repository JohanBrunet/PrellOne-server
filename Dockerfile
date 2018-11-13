FROM node:latest

# Create app directory
RUN mkdir /home/prellone-api
WORKDIR /home/prellone-api

# Install app dependencies
COPY package.json .

RUN npm install --production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]