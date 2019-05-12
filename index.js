const express = require('express');
const app = express();
const TelegramBot = require( `node-telegram-bot-api` );
const emoji = require('node-emoji').emoji;

const TOKEN = ``;

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('new_chat_members', (msg) => {
    bot.sendMessage(msg.chat.id, `Hey ${msg.from.first_name}, welcome to williamrobot!! SHOW ME WHAT YOU GOT!!!!`)
});

bot.onText(/\/previsao (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

bot.on('message', function(message)
{
    const chat_id = message.chat.id;
    console.log("sending message to "+chat_id);
    switch (message.text) {
        case "/comandos":
            bot.sendMessage(chat_id,"/marco\n/help");
            break;
        case "/comandos@williamro_bot":
            bot.sendMessage(chat_id,"/marco\n/help");
            break;
        case "/marco":
            bot.sendMessage(chat_id,"Polo "+emoji.smirk);
            break;
        case "/help":
            bot.sendMessage(chat_id,"Error 404 help.exe not found "+emoji.see_no_evil);
            break;
        case "/teucu":
            bot.sendPhoto(chat_id,"https://data.whicdn.com/images/37667397/large.jpg");
            break;
    }
});

bot.on('inline.query', function(message)
{
    // Received inline query
    console.log(2);
});

bot.on('inline.result', function(message)
{
    // Received chosen inline result
    console.log(3);
});

bot.on('inline.callback.query', function(message)
{
    // New incoming callback query
    console.log(4);
});

bot.on('edited.message', function(message)
{
    // Message that was edited
    console.log(5);
});

bot.on('update', function(message)
{
    // Generic update object
    // Subscribe on it in case if you want to handle all possible
    // event types in one callback
    console.log(6);
});

app.listen(process.env.PORT || 8181, function () {
    console.log("Servidor Iniciado");
});