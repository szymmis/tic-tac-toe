FROM node:20

COPY package.json /app/

WORKDIR /app

RUN npm install

COPY . /app

RUN npm run build

CMD ["npm", "start"]
