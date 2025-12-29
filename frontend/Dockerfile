# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app


# instala dependências primeiro (melhor cache)
COPY package*.json ./
RUN npm ci

# copia o restante e builda
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build


# ---- runtime stage ----
FROM nginx:1.27-alpine

# SPA fallback (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# arquivos buildados do Vite (dist/)
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
