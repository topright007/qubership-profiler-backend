FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x ./mvnw

COPY target target
COPY src src

FROM eclipse-temurin:21-jre AS runtime
ENV APP_UID=10001 \
    JVM_KEYSTORE="/etc/ssl/certs/java/cacerts"

WORKDIR /app

USER root

# Copy the build artifacts from the build stage
COPY --from=build /app/target/app/lib/ /app/lib/
COPY --from=build /app/target/app/*.jar /app/
COPY --from=build /app/target/app/app/ /app/app/
COPY --from=build /app/target/app/quarkus/ /app/quarkus/
RUN chown -R ${APP_UID} /app
USER ${APP_UID}

EXPOSE 1710 1715 5005 8080 8180

RUN mkdir /app/bin
COPY docker/start.sh /app/bin/start.sh
CMD ["/bin/bash", "/app/bin/start.sh"]
