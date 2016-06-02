'use strict';
var express = require('express');
var router = express.Router();
var downloader = require('../youtube-downloader');

/* GET download listing. */
router.get('/', function (req, res, next) {
    let song = req.query.song;
    console.log('Searching for song', song);
    downloader(song, res)
});

module.exports = router;
