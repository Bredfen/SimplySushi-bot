const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = '8497662622:AAFwqNWQBPordSEDWMBGYRLqoOB1ZbfXYjU';
const bot = new TelegramBot(token, { polling: true });

let userLang = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Предлагаем выбрать язык
  bot.sendMessage(chatId, "🌐 Пожалуйста, выберите язык:\n\n🇷🇺 Русский | 🇬🇧 English | 🇲🇪 Crnogorski", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🇷🇺 Русский", callback_data: "lang_ru" },
          { text: "🇬🇧 English", callback_data: "lang_en" },
        ],
        [
          { text: "🇲🇪 Crnogorski / 🇷🇸 Српски / 🇭🇷 Hrvatski / 🇧🇦 Bosanski", callback_data: "lang_exyu" }
        ]
      ]
    }
  });
});

// Обработка выбора языка
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const lang = query.data;

  // Вывод в консоль
  console.log(`[${new Date().toISOString()}] Пользователь ${chatId} выбрал язык: ${lang}`);

  // Запись в файл (добавляем новую строку)
  const logLine = `[${new Date().toISOString()}] Пользователь ${chatId} выбрал язык: ${lang}\n`;
  fs.appendFile("language_log.txt", logLine, (err) => {
    if (err) console.error("Ошибка записи в файл:", err);
  });


  if (lang === "lang_ru") {
    userLang[chatId] = "ru";
    bot.sendMessage(chatId, "👋Приветствую!\n🤖Я – бот <b>Simply</b>, помогу сделать заказ в <b>Simply Sushi</b>🍣.\n🥢Чтобы сделать новый заказ или посмотреть меню — нажмите на кнопку ниже ⬇️⬇️⬇️", {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Открыть", web_app: { url: "https://simplysushi.me" } }]]
      }
    });
  } else if (lang === "lang_en") {
    userLang[chatId] = "en";
    bot.sendMessage(chatId, "👋Welcome!\n🤖I am the <b>Simply</b> bot, here to help you place an order at <b>Simply Sushi</b>🍣.\n🥢To place a new order or view the menu, press the button below ⬇️⬇️⬇️", {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Open", web_app: { url: "https://simplysushi.me/eng" } }]]
      }
    });
  } else if (lang === "lang_exyu") {
    userLang[chatId] = "exyu"; // один язык для всех балканских
    bot.sendMessage(chatId, "👋Dobrodošli!\n🤖Ja sam <b>Simply</b> bot i pomažem vam da napravite porudžbinu u <b>Simply Sushi</b>🍣.\n🥢Da napravite novu porudžbinu ili pogledate meni — pritisnite dugme ispod ⬇️⬇️⬇️", {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Otvori", web_app: { url: "https://simplysushi.me/mne" } }]]
      }
    });
  }

  // Убираем inline-кнопки после выбора
  bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: query.message.message_id });
});