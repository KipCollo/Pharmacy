FROM maven AS build

LABEL authors="collins"

WORKDIR /app

COPY pom.xml .

RUN mvn clean install

COPY ./src ./app/src

RUN mvn clean package -Dskiptests

FROM java

ARG APP_VERSION=1.0.0

WORKDIR /target

COPY --from=build app/target /target

EXPOSE 8080

ENV APP_VERSION=APP_VERSION
ENV DB_URL=jdbc:postgresql://localhost:5432/Pharmacy

CMD java -jar api-${APP_VERSION}.jar

