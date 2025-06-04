FROM node
LABEL authors="collins"

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4200

CMD ["npm", "run", "serve"]
