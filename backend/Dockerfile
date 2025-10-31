# -----------------------------------------------------------
# ETAPA 1: COMPILACIÓN (BUILDER)
#
# Usamos el tag genérico '24-jdk', que es más probable que exista 
# y cumple con el requisito de Java 24 de tu build.gradle.
# -----------------------------------------------------------
FROM eclipse-temurin:24-jdk AS builder 

# Establece el directorio de trabajo
WORKDIR /app

# Copia el Gradle Wrapper y su configuración
COPY gradlew .
COPY gradle/ gradle/ 

# Copia los archivos de configuración y código fuente
COPY build.gradle settings.gradle ./
COPY src/ src/

# Otorga permisos de ejecución al wrapper
RUN chmod +x ./gradlew

# Ejecuta la compilación con el JDK 24
RUN ./gradlew clean build --no-daemon -x test

# -----------------------------------------------------------
# ETAPA 2: EJECUCIÓN (RUNTIME)
#
# Usamos el JRE 24 para asegurar la compatibilidad total en runtime.
# -----------------------------------------------------------
FROM eclipse-temurin:24-jre
# RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Puerto de la aplicación
EXPOSE 8080 8787

# Ruta al JAR compilado
ARG JAR_FILE=/app/build/libs/*.jar

# Copia el JAR compilado desde la etapa 'builder'
COPY --from=builder ${JAR_FILE} /app.jar

# Comando de entrada: Ejecuta la aplicación
ENTRYPOINT ["java","-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:8787", "-jar", "/app.jar", "--spring.profiles.active=dev"]
