FROM node:20-alpine

# Update OS packages to fix OpenSSL CVEs
RUN apk update && apk upgrade

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 5000

CMD ["node", "server.js"]