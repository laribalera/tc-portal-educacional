FROM node:20

# diretorio dentro do container
WORKDIR /app

COPY package*.json ./

ARG  MONGO_URI


ENV MONGO_URI=$MONGO_URI

RUN echo "MONGO_URI=${MONGO_URI}" > .env
RUN echo "port=3000" > .env

# dependencias
RUN npm install

COPY . .

# porta
EXPOSE 3000

# cpmandos
CMD ["node", "src/server.js"]
