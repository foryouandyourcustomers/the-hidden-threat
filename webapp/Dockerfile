# This Dockerfile will be moved to the root of the project during CI, and will
# not work out of the box in the webapp directory.
#
# If you want to test building this project locally:
#
#   1. Build the project with `pnpm build`
#   2. Replace webapp-build/ with build/ in the COPY command below
#   3. Run `docker build -t the-hidden-threat .`

FROM node:18-bookworm-slim

WORKDIR /app

# Install pm2 to make sure our node process restarts if it crashes
RUN npm install pm2 -g

COPY webapp-build/ .

EXPOSE 3000

# Use pm2-runtime instead of node
# https://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/
CMD [ "pm2-runtime", "prod-server.js" ]