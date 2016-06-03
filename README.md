# yarliebot

## running

__Environment variables needed__

YOUTUBE_KEY=<youtube_api_key>

FFMPEG_PATH=/path/to/ffmpeg

__start__

`./run.sh`

## Docker
```
docker run -d \
-e DEBUG=yarliebot:* \
-e environment=dev \
-e YOUTUBE_KEY=youtube_key \
-e FFMPEG_PATH=/usr/local/bin/ffmpeg \
-v `pwd`:/app \
-w /app \
-p 3000:3000 \
raman148/ffmpeg-node ./run.sh

```
