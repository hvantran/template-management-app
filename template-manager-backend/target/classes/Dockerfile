FROM openjdk:17-jdk-alpine
ADD template-manager-backend-1.0.0-SNAPSHOT.jar template-manager-backend-1.0.0-SNAPSHOT.jar
ADD https://repo1.maven.org/maven2/co/elastic/apm/elastic-apm-agent/1.33.0/elastic-apm-agent-1.33.0.jar elastic-apm-agent-1.33.0.jar
ENTRYPOINT ["java", "-javaagent:elastic-apm-agent-1.33.0.jar", "-jar", "template-manager-backend-1.0.0-SNAPSHOT.jar"]