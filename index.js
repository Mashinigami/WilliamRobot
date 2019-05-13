const express = require('express'),
        app = express(),
        TelegramBot = require( `node-telegram-bot-api` ),
        emoji = require('node-emoji').emoji,
        bodyParser = require("body-parser"),
        rp = require("request-promise");


require("dotenv").config();

const TOKEN = process.env.TELEGRAM_API_TOKEN;
const telegram_url = "https://api.telegram.org/bot" + process.env.TELEGRAM_API_TOKEN +"/sendMessage";
const openWeatherUrl = "http://api.openweathermap.org/data/2.5/forecast?q=";

const bot = new TelegramBot(TOKEN, { polling: true });

app.get('/test', (req, res) => {
    res.send("Worked");
});

bot.on('new_chat_members', (msg) => {
    bot.sendMessage(msg.chat.id, `Hey ${msg.from.first_name}, welcome to williamrobot!! SHOW ME WHAT YOU GOT!!!!`)
});

function get_forecast(city){
    let new_url = openWeatherUrl + city+"&lang=pt&appid="+process.env.OPENWEATHER_API_KEY;
    return rp(new_url)
        .then((body) => {
            return JSON.parse(body);
        }).catch((err) => {
            console.log(err);
        })
}

bot.onText(/\/previsao (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    get_forecast(resp).then(previsoes => {
        let previsoesFmt = 'Previsao para ';
        previsoesFmt = previsoesFmt.concat(previsoes.city.name, "/", previsoes.city.country, "\n");
        previsoes.list.slice(0,19).forEach(function (previsao) {
            previsoesFmt = previsoesFmt.concat(previsao.dt_txt, " : ", previsao.weather[0].description, "\n");
        });
        console.log(previsoesFmt);
        bot.sendMessage(chatId, previsoesFmt);
    });
});

bot.on('message', function(message) {
    const chat_id = message.chat.id;

    switch (message.text) {
        case "/comandos":
            console.log("sending message to "+chat_id);
            bot.sendMessage(chat_id,"/marco\n/help\n/previsao london");
            break;
        case "/comandos@williamro_bot":
            console.log("sending message to "+chat_id);
            bot.sendMessage(chat_id,"/marco\n/help\n/previsao london");
            break;
        case "/marco":
            console.log("sending message to "+chat_id);
            bot.sendMessage(chat_id,"Polo "+emoji.smirk);
            break;
        case "/help":
            console.log("sending message to "+chat_id);
            bot.sendMessage(chat_id,"Error 404 help.exe not found "+emoji.see_no_evil);
            break;
        case "/teucu":
            console.log("sending message to "+chat_id);
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

app.listen(3000, function () {
    console.log("Servidor Iniciado");
});