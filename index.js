const TelegramBot = require('node-telegram-bot-api')
const TOKEN = '854738435:AAEwuK56lcRKBz28g7t7lsRH3yyJJcMsRPY';
const bot = new TelegramBot(TOKEN)

// var bodyParser = require('body-parser');
// app.use(bodyParser.json())

// app.post('/' + token, function (req, res) {
//   bot.processUpdate(req.body);
//   res.sendStatus(200);
// })

bot.setWebHook(`https://echo-webhook.herokuapp.com/`+TOKEN)

bot.on('message', msg => {
    bot.sendMessage(msg.chat.id, `Hello from HEROKU. ${msg.from.first_name}`)
})

// hello command
bot.onText(/^\/say_hello (.+)$/, function (msg, match) {
    var name = match[1];
    bot.sendMessage(msg.chat.id, 'Hello ' + name + '!').then(function () {
      // reply sent!
    });
  });
  
  // sum command
  bot.onText(/^\/sum((\s+\d+)+)$/, function (msg, match) {
    var result = 0;
    match[1].trim().split(/\s+/).forEach(function (i) {
      result += (+i || 0);
    })
    bot.sendMessage(msg.chat.id, result).then(function () {
      // reply sent!
    });
  });