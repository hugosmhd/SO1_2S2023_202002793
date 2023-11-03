FROM node:16-alpine AS node
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

### STAGE 2: Run ###
FROM nginx:1.21.6-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist /usr/share/nginx/html
EXPOSE 80