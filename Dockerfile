FROM node:15.9.0 
WORKDIR /app
COPY . .
RUN pwd
RUN ls
RUN npm install --force


RUN npm install grunt-cli -g

EXPOSE 8000

CMD ["grunt", "webserver"]