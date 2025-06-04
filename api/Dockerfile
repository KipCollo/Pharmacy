FROM openjdk as build
LABEL authors="collins"

WORKDIR /app

COPY pom.xml .

RUN mvn clean install

COPY ./src .

