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
bot.onText(/\/echo (.+)/, function (msg, match) {
    var fromId = msg.from.id;
    var resp = match[1];
    bot.sendMessage(fromId, resp);
});


bot.onText(/Hola\sYarlie/gi, function (msg) {
    var fromId = msg.from.id;
    bot.sendMessage(fromId, "Hola, quiero un Kebab!!");
});

// Any kind of message
var downloadSong = function (msg) {
    var chatId = msg.chat.id;
    var text = msg.text;
    bot.sendMessage(chatId, `I'm searching for *${text}*, let's see what I can find`, {parse_mode: "Markdown"});
    downloader(text, (data) => {
        bot.sendMessage(chatId, `Looks like I have found one you would like *${data.song}*. Let me send it over...`, {parse_mode: "Markdown"});
        bot.sendAudio(chatId, path.join(MP3_FOLDER, data.song + '.mp3'));

    });
};
bot.on('message', function (msg) {
    var chatId = msg.chat.id;
    // photo can be: a file path, a stream or a Telegram file_id
    console.log(msg);
    if (chatId === -165153923 || -173806844) {
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
    } else if (msg.text && msg.chat.type !== 'group') {
        downloadSong(msg);
    }
});

bot.onText(/\/(download|descarga|@yarliebot) (.+)/gi, function (msg, match) {

    msg.text = match[2];
    downloadSong(msg);
});
