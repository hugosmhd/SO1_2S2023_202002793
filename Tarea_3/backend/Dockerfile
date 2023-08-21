# Utiliza una imagen base de Alpine con Go ya instalado
FROM golang:alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el código fuente al contenedor
COPY . .

# Compila la aplicación de Go
RUN go build -o myapp

EXPOSE 8000
# Ejecuta la aplicación al iniciar el contenedor
# ENV DB_HOST=MYSQL_Base
# ENV DB_USER=root
# ENV DB_PASSWORD=secret
# ENV DB_PORT=3306
# ENV DB_NAME=tarea3
CMD ["./myapp"]

#docker build -t app_go .