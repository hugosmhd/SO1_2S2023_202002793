# Desde que lenguaje o imagen queremos trabajar
FROM golang:1.20

# Crear directorio virtual
RUN mkdir /api
# Copiamos los archivos go
COPY go.* /api

# Establecemos /api workdir
WORKDIR /api
# Descargamos todas las dependecias
RUN go mod download

# Copiamos todos los archivos al contenedor
COPY . /api

# Compilar la aplicación
RUN go build -o app

# Corremos el archivo
CMD ["./app"]