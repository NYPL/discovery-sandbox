# Build the environment.
FROM node:20-alpine as production

WORKDIR /app

ARG HOLD_REQUEST_NOTIFICATION
ARG SEARCH_RESULTS_NOTIFICATION

ENV NODE_ENV=production
ENV TZ=America/New_York

ENV HOLD_REQUEST_NOTIFICATION=${HOLD_REQUEST_NOTIFICATION}
ENV SEARCH_RESULTS_NOTIFICATION=${SEARCH_RESULTS_NOTIFICATION}

# Install dependencies.
COPY package.json ./
COPY package-lock.json ./
RUN npm install --force

# Copy the app files.
COPY . .
# COPY .env .env


# Build the app!
RUN npm run build

EXPOSE 3001

# CMD is the default command when running the docker container.
CMD npm start
