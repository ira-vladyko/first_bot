const { Telegraf, Markup } = require('telegraf');
const { token } = require('./config')
const { getWeatherInBelgrade } = require('./forecast')
const { dates } = require('./constants')

//создаем бота
const bot = new Telegraf(token);

const mainKeyboard = {
    reply_markup: Markup.keyboard([
        ['узнать погоду'], ['нужна помощь?']
    ])
}



bot.command('start', async (context) => {
    console.log('пользователь запустил бота')
    //console.log(context.message)
    const userName = context.message.from.first_name
    await context.replyWithPhoto({ source: 'greeting.png' }, { caption: `Hello, ${userName}!❤️` })
    context.reply('выберите действие', mainKeyboard)
})


// получаем текст, который написал пользователь
bot.on('text', async (context) => {
    console.log(context.message.text)
    switch (context.message.text) {
        case 'узнать погоду':
            console.log("user wanted know weather")
            context.reply('На какое время?', {
                reply_markup: Markup.keyboard([
                    [dates.today.text], [dates.tomorrow.text],
                    //[dates.week.text]
                ])
            })
            break;
        case 'нужна помощь?':
            context.reply('этот бот помогает узнать погоду в Белграде. Нажмите узнать погоду')
            console.log('wanted help');
            break;
        case dates.today.text:
            console.log('погода на ', dates.today.text, ' супер')
            context.reply(await getWeatherInBelgrade(dates.today.days), mainKeyboard)
            break;
        case dates.tomorrow.text:
            console.log('погода на ', dates.tomorrow.text)
            context.reply(await getWeatherInBelgrade(dates.tomorrow.days), mainKeyboard)
            break;
        case dates.week.text:
            console.log('погода на ', dates.week.text)
            context.reply(await getWeatherInBelgrade(dates.week.days), mainKeyboard)
            break;
        default:
            console.log('user wrote another')
            context.reply('Не понимаю')
    }

})

//любое сообщение(фото, текст)
// bot.on('message' ,()=> {
//     console.log('пользователь отправил сообщение')
// })

//только текст
// bot.on('text' ,()=> {
//     console.log('пользователь отправил текст')
// })



bot.launch()

