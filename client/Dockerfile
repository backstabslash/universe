FROM node:20 

WORKDIR /client-app

COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]
