FROM node:18-bookworm-slim

WORKDIR /app

COPY webapp-build/ .

EXPOSE 3000

CMD [ "node", "prod-server.js" ]