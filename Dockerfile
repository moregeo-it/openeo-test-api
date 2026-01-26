from node:20-alpine

WORKDIR /usr/src/app

COPY . .

EXPOSE 8080
EXPOSE 443

RUN npm install
CMD ["sh", "./start.sh"]