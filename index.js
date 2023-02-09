const { Telegraf, Markup } = require('telegraf');
const { connectToDB, disconnectDB } = require('./mongoDB');
const { connectToStorage, disconnectStorage } = require('./storage')
const { telegramToken } = require('./config')
const { getWeatherInBelgrade } = require('./forecast')
const { dates } = require('./constants')
const storage = require('./storage');


//создаем бота
const bot = new Telegraf(telegramToken);

const weatherButton = 'Узнать погоду';
const helpButton = 'Нужна помощь?'
const IMAGE_PATH = 'greeting.png';

const mainKeyboard = {
    reply_markup: Markup.keyboard([
        [weatherButton], [helpButton]
    ])
}

bot.command('start', async (context) => {
    const user = context.message.from
    console.log(`Пользователь ${user.id} c ником ${user.username} запустил бота`)
    await storage.saveUser(user)
    await context.replyWithPhoto({ source: IMAGE_PATH }, { caption: `Hello, ${user.first_name}!❤️` })
    context.reply('Выберите действие', mainKeyboard)
})

// получаем текст, который написал пользователь
bot.on('text', async (context) => {
    console.log(`Получено сообщение: '${context.message.text}' от пользователя ${context.message.from.username}`)
    switch (context.message.text) {
        case weatherButton:
            context.reply('На какое время?', {
                reply_markup: Markup.keyboard([
                    [dates.today.text], [dates.tomorrow.text],
                    [dates.week.text]
                ])
            })
            break;
        case helpButton:
            context.reply('Этот бот помогает узнать погоду в Белграде. Нажмите узнать погоду')
            break;
        case dates.today.text:
            const todayResult = await getWeatherInBelgrade(dates.today.days)
            context.replyWithPhoto({ url: todayResult.icon }, { caption: todayResult.text, ...mainKeyboard })
            break;
        case dates.tomorrow.text:
            const tomorrowResult = await getWeatherInBelgrade(dates.tomorrow.days)
            context.replyWithPhoto({ url: tomorrowResult.icon }, { caption: tomorrowResult.text, ...mainKeyboard })
            break;
        case dates.week.text:
            const weekResult = await getWeatherInBelgrade(dates.week.days)
            context.reply(weekResult.text, mainKeyboard)
            break;
        default:
            context.reply('Не понимаю')
    }
})

async function main() {
    try {
        await connectToStorage()
        bot.launch()
    }
    catch (error) {
        console.log(error);
        await disconnectStorage()
    }
}

main()