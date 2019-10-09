# Imagen base
FROM node:latest

# Directorio de la app
WORKDIR /app

#Copiado de archivos
ADD . /app

#Dependencias
RUN npm install

#Puerto que expongo
EXPOSE 3000

# Comando
CMD ["npm", "start"]