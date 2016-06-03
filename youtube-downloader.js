'use strict';
const YouTube = require('youtube-node');
const YoutubeMp3Downloader = require('youtube-mp3-downloader');
const fs = require('fs');
const youTube = new YouTube();

const MP3_FOLDER = __dirname + '/public/mp3/';
const EXTENSION = '.mp3';

youTube.setKey(process.env.YOUTUBE_KEY);

var searchAndDownload = function (song, res) {
    youTube.search(song, 2, function (error, result) {
        if (error) {
            console.log(error);
        }
        else {
            let video = result.items[0];
            fs.stat(MP3_FOLDER + video.snippet.title + EXTENSION, (error,stat) => {
                if (!error) {
                    console.log('Already exists, not downloading');
                    renderResponse(res, {song: video.snippet.title});
                } else {
                    console.log("Found ", result.items.length);
                    if (result.items.length > 0) {

                        console.log("downloading ", video.snippet.title);
                        var YD = new YoutubeMp3Downloader({
                            "ffmpegPath": process.env.FFMPEG_PATH,  // Where is the FFmpeg binary located?
                            "outputPath": MP3_FOLDER,               // Where should the downloaded and encoded files be stored?
                            "youtubeVideoQuality": "lowest",       // What video quality should be used?
                            "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
                            "progressTimeout": 2000                 // How long should be the interval of the progress reports
                        });

                        YD.download(video.id.videoId);

                        YD.on("finished", function (data) {
                            console.log(data);
                            renderResponse(res, {song: data.videoTitle});
                        });

                        YD.on("error", function (error) {
                            console.log(error);
                        });

                    }
                }
            });

        }
    });
};

var renderResponse = function (res, data) {
    res.render("download", data)
};
module.exports = searchAndDownload;