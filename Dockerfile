FROM node:24-alpine AS builder

WORKDIR /build
COPY package*.json ./
RUN chown -R node:node .
USER node
RUN npm install


# stage 2
FROM node:24-alpine

#RUN chown -R node:node .nuxt
USER node
WORKDIR /app
COPY --from=builder --chown=node:node /build/node_modules ./node_modules
COPY . .

# webpack 4 (Nuxt 2) использует md4, на node 17+ нужен legacy provider
ENV NODE_OPTIONS=--openssl-legacy-provider
EXPOSE 5772

CMD npm run dev-clean
