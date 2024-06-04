FROM node:18.17.0
WORKDIR /app
COPY . /app
RUN npm i
EXPOSE 3000
CMD [ "node", "app" ]