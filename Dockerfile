FROM node:argon-slim

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/
RUN npm install

COPY . /app

EXPOSE 6464
CMD [ "npm", "start" ]
