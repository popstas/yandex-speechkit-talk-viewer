FROM node:12
WORKDIR /app
COPY package*.json ./
RUN npm install
# RUN npm run build

# Only copy over the node pieces we need from the above image
# FROM node:12
# WORKDIR /app
# COPY --from=0 /app .
# COPY . .

EXPOSE 5772

# CMD ["npm", "start"]
CMD npm run dev
