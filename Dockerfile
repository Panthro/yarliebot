FROM rakam/node-ffmpeg

WORKDIR /app

ADD . /app

RUN npm install

CMD npm start