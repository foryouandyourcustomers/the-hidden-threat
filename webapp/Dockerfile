FROM node:18-bookworm-slim

WORKDIR /app

# Install pm2 to make sure our node process restarts if it crashes
RUN npm install pm2 -g

COPY webapp-build/ .

EXPOSE 3000

# Use pm2-runtime instead of node
# https://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/
CMD [ "pm2-runtime", "prod-server.js" ]