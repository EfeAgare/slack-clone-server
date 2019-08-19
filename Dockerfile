FROM node:10

# Create app directory

RUN mkdir /slack-clone-server  

WORKDIR /slack-clone-server

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /slack-clone-server

# RUN npm run migrate
# EXPOSE 8080
CMD [ "npm", "run","dev" ]