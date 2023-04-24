FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8000
EXPOSE 3000:8000/tcp

CMD [ "npm", "start" ]
