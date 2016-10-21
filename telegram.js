/**
 * Created by panthro on 10/12/16.
 */
var TelegramBot = require('node-telegram-bot-api');
var downloader = require('./youtube-downloader');
var path = require('path');
const MP3_FOLDER = __dirname + '/public/mp3';
const botAnswers = require('./bot-answers.json');

var token = process.env.TELEGRAM_TOKEN;
// Setup polling way
var bot = new TelegramBot(token, {polling: true});

// Matches /echo [whatever]
bot.onText(/\/start/, function (msg) {
    var fromId = msg.from.id;
    bot.sendMessage(fromId, `Hello there. You can *send me the name of a song* and I'll try to find it for you.\n I also *work inside groups*, try adding me to a *group* and type\n\n/download Bohemian Rhapsody\n\nYeap, I'm that smart 🤓`, {parse_mode: "Markdown"});
    // bot.sendMessage(fromId, resp);
});

bot.onText(/Hi\sYarlie/gi, function (msg) {
    var fromId = msg.from.id;
    bot.sendMessage(fromId, "Hi there, my name is Yarlie,I'm an expert with music and kebabs.");
});

// Any kind of message
var downloadSong = function (msg) {
    var chatId = msg.chat.id;
    var text = msg.text;
    // bot.sendMessage(chatId, `I'm searching for *${text}*, let's see what I can find 🔍`, {parse_mode: "Markdown"});
    downloader(text, (data, error) => {
        if (error) {
            bot.sendMessage(chatId, `There was an error downloading the song...sorry about that 😞`, {parse_mode: "Markdown"});
        } else {

            bot.sendAudio(chatId, path.join(MP3_FOLDER, data.song.replace(/('|"|\/|\\|\*|\||)/gi, '') + '.mp3'))
                .then(() => {
                    // TODO Cleanup the downloaded music after an timeout
                })
                .catch((err) => {
                    bot.sendMessage(chatId, `There was an error sending the song...sorry about that 😞\n ${err && err.message || ''}`, {parse_mode: "Markdown"});
                });

        }
    }, (video) => {
        var title = video.snippet.title;

        bot.sendMessage(chatId, `I have found *${title}*. 🔍 I'll download and send it over...`, {parse_mode: "Markdown"});
    }, () => {
        bot.sendMessage(chatId, `I did not find song with *${msg.text}* `, {parse_mode: "Markdown"});
    });
};

bot.on('message', function (msg) {
    var chatId = msg.chat.id;
    // photo can be: a file path, a stream or a Telegram file_id
    console.log(msg);
    if (chatId === -165153923 || chatId === -173806844) {
        var sent = false;
        Object.keys(botAnswers).forEach((key) => {
            if (new RegExp(key, "gi").exec(msg.text) !== null && !sent) {
                var msgArray = botAnswers[key];
                var replyMessage = msgArray[Math.floor(Math.random() * msgArray.length)];
                bot.sendMessage(chatId, replyMessage);
                sent = true;
            }
        });
        //bot.sendMessage(chatId, msg.text);
    } else if (msg.text && msg.chat.type !== 'group' && !msg.text.startsWith("/")) {
        downloadSong(msg);
    }
});

bot.onText(/\/(download|descarga|@yarliebot) (.+)/gi, function (msg, match) {
    msg.text = match[2];
    downloadSong(msg);
});
