# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
LABEL authors="collins"
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY ./src ./src
RUN mvn clean package -Dskiptests

# Runtime stage
FROM amazoncorretto:21

ARG PROFILE=dev
ARG APP_VERSION=1.0.0

WORKDIR /app
COPY --from=build build/target/api-*.jar /target/api.jar
EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=${PROFILE}
ENV APP_VERSION=${APP_VERSION}
ENV DB_URL=jdbc:postgresql://localhost:5432/Pharmacy

CMD java -jar -Dspring.profiles.active=${PROFILE}  -Dspring.datasource.url=${DB_URL} api-${APP_VERSION}.jar

