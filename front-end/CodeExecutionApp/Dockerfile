# Build stage
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM openjdk:17-slim

# Install required languages and tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user with limited permissions
RUN useradd -r -s /bin/false coderunner
RUN mkdir /app && chown coderunner:coderunner /app

# Set working directory
WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Create directories for temporary files with proper permissions
RUN mkdir /app/temp && chown coderunner:coderunner /app/temp
RUN chmod 700 /app/temp

# Switch to non-root user
USER coderunner

# Environment variables
ENV MAX_MEMORY=512m
ENV TIMEOUT_SECONDS=30
ENV TEMP_DIR=/app/temp
ENV THREAD_POOL_SIZE=4

# Expose port
EXPOSE 8080

# Run the application without security manager
ENTRYPOINT ["java", \
    "-jar", \
    "-Xmx512m", \
    "-Dcode.execution.timeout=${TIMEOUT_SECONDS}", \
    "-Dcode.execution.pool.size=${THREAD_POOL_SIZE}", \
    "app.jar"]