FROM Node:latest
LABEL authors="collins"

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 4200

CMD ["npm", "run", "serve"]
