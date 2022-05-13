FROM node:16-alpine AS builder

WORKDIR /build
COPY package*.json ./
RUN npm install


# stage 2
FROM node:16-alpine

WORKDIR /app
COPY --from=builder /build/node_modules ./node_modules
COPY . .

#RUN chown -R node:node .nuxt
USER node

EXPOSE 5772

CMD npm run dev-clean
