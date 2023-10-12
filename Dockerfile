FROM node:18

WORKDIR /app

ENV PORT=3000

COPY ./package.json .
RUN npm cache clean --force
RUN npm install
COPY . .

EXPOSE $PORT

# CMD npm start
CMD [ "npm", "start" ]