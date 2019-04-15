const TelegramBot = require('node-telegram-bot-api')
const TOKEN = '854738435:AAEwuK56lcRKBz28g7t7lsRH3yyJJcMsRPY';
const bot = new TelegramBot(TOKEN, {
    webHook:{
        port: process.env.PORT
    }})

bot.setWebHook(`https://echo-webhook.herokuapp.com/`+TOKEN)

bot.on('message', msg => {
    bot.sendMessage(msg.chat.id, `Hello from HEROKU. ${msg.from.first_name}`)
})