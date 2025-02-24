FROM node:20-alpine

RUN corepack enable && corepack prepare yarn@4.2.2 --activate

RUN mkdir -p /app
WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn

COPY . /app/
RUN yarn && yarn build

EXPOSE 3000

CMD ["yarn", "start"]
