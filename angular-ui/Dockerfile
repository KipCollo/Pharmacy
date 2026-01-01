FROM node AS builder
LABEL authors="collins"

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN ng build

EXPOSE 4200

FROM nginx

WORKDIR www

COPY --from=builder . .

EXPOSE 80
