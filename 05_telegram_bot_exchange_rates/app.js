const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");
const NodeCache = require("node-cache");
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const myCache = new NodeCache();

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    bot.sendMessage(chatId, `Please choose an option`);
    await showMenu(chatId, text);
  } else if (text === "Currency") {
    await showMenu(chatId, text);
  } else if (text === "EUR") {
    const arrayOfStringsEUR = await getCurrency(text);
    const connectedStr = await arrayOfStringsEUR.join("\n");
    bot.sendMessage(chatId, connectedStr);
  } else if (text === "USD") {
    const arrayOfStringsUSD = await getCurrency(text);
    const connectedStr = await arrayOfStringsUSD.join("\n");
    bot.sendMessage(chatId, connectedStr);
  }
});

function showMenu(chatId, text) {
  if (text === "/start") {
    const askCurrencyKeyboard = {
      reply_markup: {
        keyboard: [["Currency"]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };

    bot.sendMessage(chatId, `Choose the currency`, askCurrencyKeyboard);
  } else if (text === "Currency") {
    const currencyKeyboard = {
      reply_markup: {
        keyboard: [["EUR", "USD"]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };

    bot.sendMessage(chatId, "Please choose an option:", currencyKeyboard);
  }
}

async function getCurrency(currency) {
  let arrayOfStringsEUR = [];
  let arrayOfStringsUSD = [];
  const currencyObjects = [];

  try {
    const privatCurrency = await axios.get(
      "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5"
    );
    const monoCurrency = await axios.get(
      "https://api.monobank.ua/bank/currency"
    );

    await monoCurrency.data.map((el) => {
      if (el.currencyCodeA === 840) {
        const necessaryData = {
          bankName: "Monobank",
          currencyName: "USD",
          base: "UAH",
          buy: el.rateBuy,
          sell: el.rateSell,
        };
        currencyObjects.push(necessaryData);
      }

      if (el.currencyCodeA === 978 && el.currencyCodeB === 980) {
        const necessaryData = {
          bankName: "Monobank",
          currencyName: "EUR",
          base: "UAH",
          buy: el.rateBuy,
          sell: el.rateSell,
        };
        currencyObjects.push(necessaryData);
      }
    });

    await privatCurrency.data.map((el) => {
      const necessaryData = {
        bankName: "PrivatBank",
        currencyName: el.ccy,
        base: el.base_ccy,
        buy: el.buy,
        sell: el.sale,
      };

      currencyObjects.push(necessaryData);
    });

    currencyObjects.map((el) => {
      const str = `${el.bankName}\n${el.currencyName} - ${el.base}\nBuy: ${el.buy}\nSell: ${el.sell}\n`;
      if (el.currencyName === "USD") {
        arrayOfStringsUSD.push(str);
      } else {
        arrayOfStringsEUR.push(str);
      }
    });

    const cachedArrayUSD = JSON.stringify(arrayOfStringsUSD);
    const cachedArrayEUR = JSON.stringify(arrayOfStringsEUR);

    myCache.set("USD", cachedArrayUSD, 61);
    myCache.set("EUR", cachedArrayEUR, 61);
  } catch (error) {
    const cachedDataUSD = myCache.get("USD");
    arrayOfStringsUSD = JSON.parse(cachedDataUSD);

    const cachedDataEUR = myCache.get("EUR");
    arrayOfStringsEUR = JSON.parse(cachedDataEUR);

    if (currency === "USD") {
      return arrayOfStringsUSD;
    } else if (currency === "EUR") {
      return arrayOfStringsEUR;
    }
  }

  if (currency === "USD") {
    return arrayOfStringsUSD;
  } else if (currency === "EUR") {
    return arrayOfStringsEUR;
  }
}
