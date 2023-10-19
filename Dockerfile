FROM node:18

WORKDIR /app

ENV PORT=3000

COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install

COPY . .

EXPOSE $PORT

CMD [ "yarn", "start" ]
