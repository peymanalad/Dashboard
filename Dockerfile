ARG NODE_IMAGE="docker.arvancloud.ir/node:20-alpine"
ARG NGINX_IMAGE="docker.arvancloud.ir/nginx:1.27.2"
FROM ${NODE_IMAGE} AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --force

COPY . .
RUN npm run build

FROM ${NGINX_IMAGE}
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf  

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]