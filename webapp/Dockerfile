# This Dockerfile will be moved to the root of the project during CI, and will
# not work out of the box in the webapp directory.
#
# If you want to test building this project locally:
#
#   1. Build the project with `pnpm build`
#   2. Replace webapp-build/ with build/ in the COPY command below
#   3. Run `docker build -t the-hidden-threat .`
#   4. Run the docker image with `docker run -p 3030:3000 the-hidden-threat`

FROM node:18-bookworm-slim

# Set the UID for the user
ARG UID=1025

# Create a new user with the specified UID, and install pm2 to make sure our
# node process restarts if it crashes
RUN adduser --uid $UID --disabled-password --gecos "" nonroot && \
    npm install pm2 -g

# Set the working directory to the app directory in the home of the user
WORKDIR /home/nonroot/webapp

# Copy the project, and make sure that the `nonroot` user only has read access
# to the files.
COPY --chown=root:root webapp-build/ .
RUN chmod -R go-w . && chmod -R go+r .

# Switch to the nonroot user
USER nonroot

EXPOSE 3000

ENV PM2_HOME=/home/nonroot/.pm2

# Use pm2-runtime instead of node
# https://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/
CMD [ "pm2-runtime", "-l", "/dev/null", "prod-server.js" ]