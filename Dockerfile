FROM node:12-stretch
LABEL maintainer = 'Junior Miranda'

ENV API=/home/api

EXPOSE 8080

COPY ./package.json $API/package.json

WORKDIR $API

RUN yarn install 

COPY . $API/

CMD yarn start:dev