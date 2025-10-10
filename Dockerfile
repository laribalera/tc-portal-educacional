FROM node:20

# diretorio dentro do container
WORKDIR /app

COPY package*.json ./

# dependencias
RUN npm install

COPY . .

# porta
EXPOSE 3000

# cpmandos
CMD ["node", "src/server.js"]
