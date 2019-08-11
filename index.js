require("dotenv").config();

const   Telegraf            = require('telegraf'),
        commandFunctions    = require('./commands');

// const telegram_url = "https://api.telegram.org/bot" + process.env.TELEGRAM_API_TOKEN +"/sendMessage";

const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN);

//Timestamp response
bot.use((ctx, next) => {
    const start = new Date();
    return next(ctx).then(() => {
        const ms = new Date() - start;
        console.log(ctx.message.text.split(/ +/));
        console.log('Response time %sms', ms)
    })
});

bot.command('comandos', commandFunctions.comandos);
bot.command('comandos@williamro_bot', commandFunctions.comandos);
bot.command('clima', commandFunctions.clima);
bot.command('hello', commandFunctions.hello);
bot.command('help', commandFunctions.help);
bot.command('previsao', commandFunctions.previsao);
bot.command('previsão', commandFunctions.previsao);

bot.launch();

// Export bot handler
module.exports = bot;