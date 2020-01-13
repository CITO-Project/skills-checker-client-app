FROM node:10.16-alpine AS build

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .

RUN $(npm bin)/ng build

FROM nginx:1.17.1-alpine

COPY --from=build /usr/src/app/dist/skills-checker /usr/share/nginx/html
