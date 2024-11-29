FROM docker.arvancloud.ir/nginx:latest
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./build /usr/share/nginx/html
