FROM node:16-alpine

RUN mkdir -p /usr/app
RUN mkdir -p /usr/napbiotec
#RUN cd .. && echo ls -l

WORKDIR /usr/app

COPY package.json /usr/app/
RUN npm install

COPY . /usr/app

EXPOSE 3030

CMD ["npm", "run", "start-app"]