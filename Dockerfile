FROM rakam/node-ffmpeg

ENV FFMPEG_PATH=/usr/bin/ffmpeg

WORKDIR /app

ADD . /app

RUN mkdir /app/public/mp3

RUN npm install

CMD npm start