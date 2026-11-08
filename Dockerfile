# MY SZN production build for Railway.
# Why this exists (8 Nov 2026): Railway's default builder (Railpack) downloads its own tools
# from GitHub releases on every build. When those downloads time out (504), every deploy fails
# before our code is even touched. This Dockerfile only needs Docker Hub and npm, so builds no
# longer depend on GitHub release downloads. Same steps Railpack ran: Node 22, npm install,
# npm run build, npm run start.

FROM node:22-bookworm AS build
WORKDIR /app

# Railway passes service variables into the build only when they are declared here.
# NEXT_PUBLIC_* values are baked into the browser bundle, so they must exist at build time.
# Server values are declared too because some pages are pre-rendered during the build.
# These ARGs live only in this build stage; they are not copied into the final image.
ARG RAILWAY_GIT_COMMIT_SHA
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_ENROLMENT_OPEN
ARG NEXT_PUBLIC_GEONAMES_USERNAME
ARG NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
ARG NEXT_PUBLIC_AFFILIATE_TAG
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_AUTH_TOKEN
ARG SUPABASE_SERVICE_ROLE_KEY
ARG STRIPE_SECRET_KEY
ARG STRIPE_PRICE_MONTHLY
ARG STRIPE_PRICE_MONTHLY_3MO_UPFRONT
ARG STRIPE_PRICE_VIP
ARG GEONAMES_USERNAME
ARG BREVO_API_KEY
ARG RESEND_API_KEY
ARG SOLSTRAL_API_KEY

ENV NEXT_TELEMETRY_DISABLED=1

# The full node image already has python3, make and g++ for building swisseph.
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Railpack added this runtime library; kept for parity.
RUN apt-get update && apt-get install -y --no-install-recommends libatomic1 && rm -rf /var/lib/apt/lists/*
COPY --from=build /app /app
EXPOSE 3000
CMD ["npm", "run", "start"]
