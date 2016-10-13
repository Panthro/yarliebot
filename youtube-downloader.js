'use strict';
const YouTube = require('youtube-node');
const YoutubeMp3Downloader = require('youtube-mp3-downloader');
const fs = require('fs');
const path = require('path');
const youTube = new YouTube();

const MP3_FOLDER = __dirname + '/public/mp3';
const EXTENSION = '.mp3';

youTube.setKey(process.env.YOUTUBE_KEY);

var searchAndDownload = function (song, res, foundCb, notFoundCb) {
    youTube.search(song, 2, function (error, result) {
        if (error) {
            console.log(error);
        }
        else {
            if (result.items.length == 0 && notFoundCb) {
                notFoundCb();
            } else {
                let video = result.items[0];

                fs.stat(path.join(MP3_FOLDER, video.snippet.title + EXTENSION), (error) => {
                    if (!error) {
                        console.log('Already exists, not downloading');
                        renderResponse(res, {song: video.snippet.title});
                    } else {
                        console.log("Found ", result.items.length);
                        if (result.items.length > 0) {
                            try {
                                console.log("downloading ", video.snippet.title);
                                var YD = new YoutubeMp3Downloader({
                                    "ffmpegPath": process.env.FFMPEG_PATH,  // Where is the FFmpeg binary located?
                                    "outputPath": MP3_FOLDER,               // Where should the downloaded and encoded files be stored?
                                    "youtubeVideoQuality": "lowest",       // What video quality should be used?
                                    "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
                                    "progressTimeout": 10000                 // How long should be the interval of the progress reports
                                });

                                if (foundCb && typeof foundCb === 'function') {
                                    foundCb(video);
                                }
                                YD.download(video.id.videoId);

                                YD.on("finished", function (data) {
                                    console.log(data);
                                    renderResponse(res, {song: data ? data.videoTitle : video.snippet.title});
                                });

                                YD.on("error", function (error) {
                                    renderResponse(res, null, error);
                                    console.log(error);
                                });
                            } catch (err) {
                                renderResponse(res, null, err);
                            }

                        }
                    }
                });
            }
        }
    });
};

var renderResponse = function (res, data, error) {
    if (typeof res === 'function') {
        res(data, error);
    } else {
        res.render("download", data)
    }
};
module.exports = searchAndDownload;