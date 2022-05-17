FROM node:16-alpine AS builder

WORKDIR /build
COPY package*.json ./
RUN chown -R node:node .
USER node
RUN npm install


# stage 2
FROM node:16-alpine

#RUN chown -R node:node .nuxt
USER node
WORKDIR /app
COPY --from=builder --chown=node:node /build/node_modules ./node_modules
COPY . .

EXPOSE 5772

CMD npm run dev-clean
