FROM node:16

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y build-essential
RUN apt-get install -y python

RUN npm install npm -g
RUN npm install node-gyp -g

COPY . ./
COPY ./package.json ./package-lock.json* ./
COPY ./.env.example ./.env

RUN npm cache clean --force

RUN npm install bcrypt --save

RUN npm install --ignore-scripts

EXPOSE 3000

CMD [ "npm", "run", "dev" ]