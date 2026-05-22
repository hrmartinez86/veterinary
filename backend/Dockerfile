FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --prefer-offline

COPY src ./src

RUN mkdir -p uploads

EXPOSE 4001

CMD ["node", "src/app.js"]
