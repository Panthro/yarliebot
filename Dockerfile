FROM rakam/node-ffmpeg

ENV FFMPEG_PATH=/usr/bin/ffmpeg

WORKDIR /app

ADD . /app

RUN ./run.sh

CMD npm start