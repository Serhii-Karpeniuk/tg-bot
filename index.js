const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '6382129432:AAGTyb6HIPvfwmCsW6v9r3JiNiSDQQtS5ps'

const bot = new TelegramApi(token, {polling:true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Відгадай цифру від 1-9')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Відгадай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Вітання' },
        { command: '/info', description: 'Отримати інформацію' },
        { command: '/game', description: 'Гра вгадай число' }
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/869/281/86928106-6812-340c-9d51-70ef0f8a4771/11.webp')
            return bot.sendMessage(chatId, `Привіт`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Як справи ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Виникла проблема, напиши ще раз)')

    })
}

bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
        return startGame(chatId);
    }

    if (data === chats[chatId].toString()) {
        await bot.sendMessage(chatId, `Вітаю ви вгадали цифру! ${chats[chatId]}`, againOptions)
    } else {
        await bot.sendMessage(chatId, `Нажаль ви не вгадали, спробуйте ще раз ${chats[chatId]}`, againOptions)
    }
    await bot.sendMessage(chatId, `Ти вибрав цифру ${data}`)
})

start()