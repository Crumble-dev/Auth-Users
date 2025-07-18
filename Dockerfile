# Usar la imagen oficial de Node.js
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer el puerto 3000
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"] 