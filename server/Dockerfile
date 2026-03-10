#build adminPanel fronted
FROM node:20-alpine AS builder

WORKDIR /app/admin

COPY ./adminPanel/package*.json ./

RUN npm install

COPY ./adminPanel ./

RUN npm run build

#server 
FROM node:20-alpine

WORKDIR /app/server

COPY ./server/package*.json ./

RUN npm install

COPY ./server .

COPY --from=builder /app/admin/build ./build

EXPOSE 8000

CMD ["node", "server.js"]