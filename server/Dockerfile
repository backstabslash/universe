FROM node:20

WORKDIR /server-app

COPY package.json ./
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]
