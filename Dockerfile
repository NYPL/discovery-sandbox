# Build the environment.
FROM node:20-alpine as production

WORKDIR /app

ARG HOLD_REQUEST_NOTIFICATION
ARG SEARCH_RESULTS_NOTIFICATION
ARG PLATFORM_API_BASE_URL
ARG DISCOVERY_API_BASE_URL
ARG DRB_API_BASE_URL
ARG SHEP_API
ARG LOGIN_URL
ARG LOGIN_BASE_URL
ARG FEATURES
ARG GENERAL_RESEARCH_EMAIL
ARG SOURCE_EMAIL
ARG LIB_ANSWERS_EMAIL
ARG NYPL_HEADER_URL
ARG LAUNCH_EMBED_URL
ARG SIERRA_UPGRADE_AUG_2023
ARG REVERSE_PROXY_ENABLED
ARG OPEN_LOCATIONS

ENV NODE_ENV=production
ENV TZ=America/New_York

ENV HOLD_REQUEST_NOTIFICATION=${HOLD_REQUEST_NOTIFICATION}
ENV SEARCH_RESULTS_NOTIFICATION=${SEARCH_RESULTS_NOTIFICATION}
ENV PLATFORM_API_BASE_URL=${PLATFORM_API_BASE_URL}
ENV DISCOVERY_API_BASE_URL=${DISCOVERY_API_BASE_URL}
ENV DRB_API_BASE_URL=${DRB_API_BASE_URL}
ENV SHEP_API=${SHEP_API}
ENV LOGIN_URL=${LOGIN_URL}
ENV LOGIN_BASE_URL=${LOGIN_BASE_URL}
ENV FEATURES=${FEATURES}
ENV GENERAL_RESEARCH_EMAIL=${GENERAL_RESEARCH_EMAIL}
ENV SOURCE_EMAIL=${SOURCE_EMAIL}
ENV LIB_ANSWERS_EMAIL=${LIB_ANSWERS_EMAIL}
ENV NYPL_HEADER_URL=${NYPL_HEADER_URL}
ENV LAUNCH_EMBED_URL=${LAUNCH_EMBED_URL}
ENV SIERRA_UPGRADE_AUG_2023=${SIERRA_UPGRADE_AUG_2023}
ENV REVERSE_PROXY_ENABLED=${REVERSE_PROXY_ENABLED}
ENV OPEN_LOCATIONS=${OPEN_LOCATIONS}
ENV CLOSED_LOCATIONS=${CLOSED_LOCATIONS}
ENV RECAP_CLOSED_LOCATIONS=${RECAP_CLOSED_LOCATIONS}
ENV NON_RECAP_CLOSED_LOCATIONS=${NON_RECAP_CLOSED_LOCATIONS}

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
