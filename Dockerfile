FROM node:16-alpine AS builder

WORKDIR /build
COPY package*.json ./
RUN npm install

# RUN chown -R node:node /app
# USER node

FROM node:16-alpine

WORKDIR /app
#
COPY --from=builder /build/node_modules ./node_modules
COPY . .

EXPOSE 5772

CMD npm run dev-clean
