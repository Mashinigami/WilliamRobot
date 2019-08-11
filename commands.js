const   rp      = require('request-promise'),
        moment  = require('moment'),
        emoji   = require('node-emoji').emoji;

let commandFunctions = {};

commandFunctions.hello = (ctx) => ctx.reply('Hello');
commandFunctions.previsao = comandoPrevisao;
commandFunctions.comandos = comandos;
commandFunctions.help = help;
commandFunctions.clima = clima;

const openWeatherUrl = "http://api.openweathermap.org/data/2.5/forecast?q=";

function get_forecast(city){
    let new_url = openWeatherUrl + city+"&lang=pt&units=metric&appid="+process.env.OPENWEATHER_API_KEY;
    return rp(new_url)
        .then((body) => {
            return JSON.parse(body);
        }).catch((err) => {
            console.log(err.error);
            throw new Error(err.error);
        })
}

function comandoPrevisao(ctx){
    console.log(ctx.message.text.split(/ +/));
    const city = ctx.message.text.replace("/previsao ", "").replace("/previsao", "");

    if(city.length < 3){
        ctx.reply('Digite uma cidade valida. ex.: /previsao Azgard');
        return null;
    }

    get_forecast(city).then(previsoes => {
        let previsoesFmt = 'Previsao para ';
        previsoesFmt = previsoesFmt.concat(previsoes.city.name, "/", previsoes.city.country, "\n");

        previsoes.list.forEach(function (previsao) {
            previsoesFmt = previsoesFmt.concat(moment(previsao.dt_txt).format('DD/MM HH:mm'), " : ", previsao.weather[0].description, "\n");
        });
        ctx.reply(previsoesFmt);
    }).catch((err) => ctx.reply(err.message));
}

function clima(ctx) {
    console.log(ctx.message.text.split(/ +/));
    const city = ctx.message.text.replace("/clima ", "").replace("/clima", "");

    if(city.length < 3){
        ctx.reply('Digite uma cidade valida. ex.: /previsao Azgard');
        return null;
    }

    get_forecast(city).then(previsoes => {
        let climaFmt = 'Clima para ', days = {};
        climaFmt = climaFmt.concat(previsoes.city.name, "/", previsoes.city.country, "\n");

        previsoes.list.forEach(function (previsao) {
            let currentDate = moment(previsao.dt_txt).format('DD/MM');
            if(typeof days[currentDate] === 'undefined'){
                days[currentDate] = {temp_min:255, temp_max:-255, humi_min:101, humi_max:-1};
            }

            if(days[currentDate].temp_min > previsao.main.temp_min){
                days[currentDate].temp_min = previsao.main.temp_min;
            }

            if(days[currentDate].temp_max < previsao.main.temp_max){
                days[currentDate].temp_max = previsao.main.temp_max;
            }

            if(days[currentDate].humi_min > previsao.main.humidity){
                days[currentDate].humi_min = previsao.main.humidity;
            }

            if(days[currentDate].humi_max < previsao.main.humidity){
                days[currentDate].humi_max = previsao.main.humidity;
            }

            days[currentDate].date = currentDate;
        });

        Object.values(days).forEach(function (day) {
            climaFmt = climaFmt.concat(day.date, " - ", emoji.arrow_down_small,removeDecimals(day.temp_min), emoji.arrow_up_small, removeDecimals(day.temp_max), " : ", emoji.rain_cloud, removeDecimals(day.humi_min), "%:", removeDecimals(day.humi_max),  "%\n");
        });
        console.log(climaFmt);
        ctx.reply(climaFmt);
    }).catch((err) => ctx.reply(err.message));
}

function help(ctx) {
    return ctx.reply("Error 404 help.exe not found "+emoji.see_no_evil)
}

function comandos(ctx){
    return ctx.reply('/marco\n/help\n/previsao lucerna');
}

function removeDecimals(string){
    return parseFloat(string).toFixed(0);
}

module.exports = commandFunctions;