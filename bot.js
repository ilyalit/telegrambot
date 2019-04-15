const token = process.env.TOKEN;

const Bot = require('node-telegram-bot-api');
let bot;

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
  console.log('process.env.NODE_ENV '+process.env.NODE_ENV);
}
else {
  bot = new Bot(token, { polling: true });
  console.log('process.env.NODE_ENV '+process.env.NODE_ENV);
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

// bot.on('message', (msg) => {
//   const name = msg.from.first_name;
//   bot.sendMessage(msg.chat.id, 'Hello, ' + name + '!').then(() => {
//     // reply sent!
//   });
// });
var login;
var password;

var loginFlag = false;
var passwordFlag = false;

var jsforce = require('jsforce');
var conn = new jsforce.Connection();
conn.login('expenses_litovchik@success-craft.by', 'Bbnn6436035', function(err, res) {
  if (err) { 
      return console.error(err); 
    }
    
    
});

if(loginFlag === false){
  var i = logginign();
}else if(loginFlag === true && passwordFlag === false){
  passwording();
}
function passwording(){ 
  bot.on('message', (msg, match) => {
  const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'Введите пароль:');
        password = msg.text;
        console.log('password '+ password);
        passwordFlag=true;
        return password;
});
}
function logginign(){ 
  bot.on('message', (msg, match) => {
  const chatId = msg.chat.id;
      bot.sendMessage(chatId, 'Введите логин:');
      login = msg.text;
      console.log('Login '+ login);
      loginFlag=true;
      
    //   bot.on('message', (msg) => {
    //     conn.query("SELECT Id FROM Contact WHERE Email = '"+msg.text+"'", function(err, res) {
    //       if (err) { 
    //           return console.error(err); 
    //       }
    //       var i = res.records;

    //       if(i.length == 0){
    //         bot.sendMessage(chatId, 'Неверный логин, попробуйте еще раз:');
    //       }
   
});
}









console.log('2login '+login);
console.log('2password '+password);








module.exports = bot;