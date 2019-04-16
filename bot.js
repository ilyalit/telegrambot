const token = process.env.TOKEN;
const Bot = require('node-telegram-bot-api');
let bot;
if (process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
  console.log('process.env.NODE_ENV ' + process.env.NODE_ENV);
}
else {
  bot = new Bot(token, { polling: true });
  console.log('process.env.NODE_ENV ' + process.env.NODE_ENV);
}
console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

var jsforce = require('jsforce');
var conn = new jsforce.Connection();
conn.login(process.env.LOGIN_SF, process.env.PASSWORD_SF, function (err, res) {
  if (err) {
    return console.error(err);
  }
});

var login;
var password;
var contactId;
var newExpCardAmount;
var newExpCardDescription;

bot.onText(/^\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Введите логин:');
  bot.once('message', (msg, match) => {
    const chatId = msg.chat.id;
    login = msg.text;
    console.log('Login ' + login);
    bot.sendMessage(chatId, 'Введите пароль:');
    bot.emit('message');
    bot.once('message', (msg, match) => {
      const chatId = msg.chat.id;
      password = msg.text;
      console.log('password ' + password);
      passwordFlag = true;
      conn.query("SELECT Id FROM Contact WHERE Email = '" + login + "' AND Password__c = '" + password + "'", function (err, res) {
        if (err) {
          return console.error(err);
        }
        if (res.records.length == 0) {
          bot.sendMessage(chatId, 'Неверный логин или пароль, введите /start, что бы повторить авторизацию:');
        } else {
          contactId = res.records[0].Id;
          choosheAction(chatId, 'Авторизация прошла успешно!');
        }
      });
    });
  });
});
bot.on('callback_query', query => {
  const chatId = query.message.chat.id;
  console.log(query.data);
  if (query.data == 'Current Balance') {
    conn.query("SELECT Reminder__c FROM Monthly_Expense__c WHERE Keeper__c = '" + contactId + "'", function (err, res) {
      if (err) {
        return console.error(err);
      }
      var balance = 0;
      for (let i = 0; i < res.records.length; i++) {
        balance += res.records[i].Reminder__c;
      }
      bot.sendMessage(chatId, 'Текущий баланс: $' + balance.toFixed(2));
      choosheAction(chatId, 'Выберите действие:');
    });
  } else if (query.data == 'Create card') {
    bot.sendMessage(chatId, 'На какой день желаете создать карточку?', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Сегодня',
              callback_data: 'Today'
            },
            {
              text: 'Календарь',
              callback_data: 'Calendar'
            },
            {
              text: 'Отмена',
              callback_data: 'Cancel'
            }
          ]
        ]
      }
    });
  } else if (query.data == 'Cancel') {
    choosheAction(chatId, 'Выберите действие:');
  } else if (query.data == 'Today') {
    newExpCard(chatId, new Date());
  } else if (query.data == 'Calendar') {
    bot.sendMessage(chatId, 'Введите дату в формате ГГГГ-ММ-ДД:');
    bot.once('message', (msg) => {
      var date = msg.text;
      newExpCard(chatId, new Date(date));
    });
  }
});

function choosheAction(chatId, str) {
  bot.sendMessage(chatId, str, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Текущий баланс',
            callback_data: 'Current Balance'
          },
          {
            text: 'Создать карточку',
            callback_data: 'Create card'
          }
        ]
      ]
    }
  });
}
function newExpCard(chatId, date) {
  bot.sendMessage(chatId, 'Введите сумму:');
  bot.once('message', (msg) => {
    const chatId = msg.chat.id;
    newExpCardAmount = msg.text;
    console.log('newExpCardAmount: ' + newExpCardAmount);
    bot.sendMessage(chatId, 'Введите описание:');
    bot.once('message', (msg) => {
      const chatId = msg.chat.id;
      newExpCardDescription = msg.text;
      console.log('newExpCardDescription: ' + newExpCardDescription);

      conn.sobject("Expense_Card__c").create({
        Amount__c: newExpCardAmount,
        Description__c: newExpCardDescription,
        Card_Date__c: date,
        Card_Keeper__c: contactId
      }, function (err, ret) {
        if (err || !ret.success) {
          choosheAction(chatId, 'Ошибка! Попробуйте еще раз:');
          return console.error(err, ret);
        }
        if (ret.success) {
          bot.sendMessage(chatId, 'Запись успешно создана с Id: ' + ret.id);
          console.log("Created record id : " + ret.id);
          choosheAction(chatId, 'Выберите действие:');
        }
      });

    });
  });
}
module.exports = bot;