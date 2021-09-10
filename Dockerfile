FROM node:10

# Create app directory

RUN mkdir /slack-clone-server  

WORKDIR /slack-clone-server

# Bundle app source
COPY . /slack-clone-server

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

RUN npm run build
# EXPOSE 8080
CMD [ "npm", "run", "start" ]