# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

RUN apk --update add redis 

WORKDIR /app
COPY package.json ./
#RUN yarn install --frozen-lockfile
RUN npm i  --frozen-lockfile --legacy-peer-deps
# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm install next  --frozen-lockfile --legacy-peer-deps
RUN npx prisma generate
RUN npx update
ENV DATABASE_URL "mysql://root:root@localhost:3306/agro_force" 
ENV COPYMOD "tmgdns-qa" 
RUN npm run build
RUN yarn build
RUN yarn cache clean

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production


RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma/BaltimoreCyberTrustRoot.crt.pem /tmp/BaltimoreCyberTrustRoot.crt.pem

# Essentials
RUN apk add -U tzdata
ENV TZ=America/Fortaleza
RUN cp /usr/share/zoneinfo/America/Fortaleza /etc/localtime


RUN apk --update add redis 

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["start.sh"]
