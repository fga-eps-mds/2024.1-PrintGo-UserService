FROM node:18

WORKDIR /src

ENV PORT=8000

COPY ./package.json .
RUN yarn install

COPY . .

EXPOSE $PORT

CMD [ "yarn", "start" ]