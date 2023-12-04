FROM node:18

WORKDIR /src

ENV PORT=8000

COPY ./package.json .
RUN npm install

COPY . .

EXPOSE $PORT

CMD [ "npm", "start" ]
