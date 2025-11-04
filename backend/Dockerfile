FROM node:20-alpine

WORKDIR /backend

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]