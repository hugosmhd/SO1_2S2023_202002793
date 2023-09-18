# Utilizamos la imagen base de Node.js
FROM node:18

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos el archivo package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto de los archivos al directorio de trabajo
COPY . .

# Puerto en el que escucha tu aplicación (ajusta esto según tu proyecto)
EXPOSE 3000

# Comando para iniciar la aplicación cuando se inicie el contenedor
CMD ["npm", "run", "dev", "--", "--host"]