const   Telegraf    = require('telegraf'),
        emoji       = require('node-emoji').emoji,
        rp          = require("request-promise");


require("dotenv").config();

// const telegram_url = "https://api.telegram.org/bot" + process.env.TELEGRAM_API_TOKEN +"/sendMessage";
const openWeatherUrl = "http://api.openweathermap.org/data/2.5/forecast?q=";

const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN);

//Timestamp response
bot.use((ctx, next) => {
    const start = new Date();
    return next(ctx).then(() => {
        const ms = new Date() - start;
        console.log('Response time %sms', ms)
    })
});

bot.command('o', (ctx) => ctx.reply('Hello'));
bot.command('previsao', (ctx) => {
    comandoPrevisao(ctx);
});
bot.command('previsão', (ctx) => {
    comandoPrevisao(ctx);
});
bot.launch();

// Export bot handler
module.exports = bot;

function get_forecast(city){
    let new_url = openWeatherUrl + city+"&lang=pt&appid="+process.env.OPENWEATHER_API_KEY;
    return rp(new_url)
        .then((body) => {
            return JSON.parse(body);
        }).catch((err) => {
            console.log(err);
        })
}

function comandoPrevisao(ctx){
    console.log(ctx.message.text.split(/ +/));
    const city = ctx.message.text.replace("/previsao ", "");

    get_forecast(city).then(previsoes => {
        let previsoesFmt = 'Previsao para ';
        previsoesFmt = previsoesFmt.concat(previsoes.city.name, "/", previsoes.city.country, "\n");
        previsoes.list.slice(0,19).forEach(function (previsao) {
            previsoesFmt = previsoesFmt.concat(previsao.dt_txt, " : ", previsao.weather[0].description, "\n");
        });
        console.log(previsoesFmt);
        ctx.reply(previsoesFmt);
    });
}

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
        // case "/teucu":
        //     console.log("sending message to "+chat_id);
        //     bot.sendPhoto(chat_id,"https://data.whicdn.com/images/37667397/large.jpg");
        //     break;
    }
});