const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const city = {
  reply_markup: JSON.stringify({
    inline_keyboard: [[{ text: "Forecast in Lviv", callback_data: "true" }]],
  }),
};

const choseInterval = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "Every 3 hours", callback_data: "3h" },
        { text: "Every 6 hours", callback_data: "6h" },
      ],
    ],
  }),
};

bot.setMyCommands([{ command: "/start", description: "start" }]);

bot.on("message", (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (text === "/start") {
    bot.sendMessage(chatId, "Your city Lviv", city);
  }
});

bot.on("callback_query", async (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  if (data === "true") {
    bot.sendMessage(chatId, "Chose an interval", choseInterval);
  }
  if (data === "3h") {
    const weatherOneDayData = await getInterval("3h");
    const arrayOfText = await getText(weatherOneDayData);
    const connectedStr = arrayOfText.join("\n");

    bot.sendMessage(chatId, connectedStr);
  }
  if (data === "6h") {
    const weatherOneDayData = await getInterval("6h");
    const arrayOfText = await getText(weatherOneDayData);
    const connectedStr = arrayOfText.join("\n");

    bot.sendMessage(chatId, connectedStr);
  }
});

function getText(arr) {
  const arrayOfText = [];

  arr.map((el) => {
    const text = `Date and time - ${el.dateTime}\nTemperature - ${el.tempareture}\nWeather - ${el.weather}\n`;
    arrayOfText.push(text);
  });

  return arrayOfText;
}

async function getInterval(data) {
  const weatherList = await getWeather();
  const weatherFullData = [];
  const weatherOneDayData = [];

  if (data === "3h") {
    await weatherList.map((el, i) => {
      if (i <= 7) {
        weatherFullData.push(el);
      }
    });

    await weatherFullData.map((el) => {
      const necessaryData = {
        tempareture: el.main.temp,
        weather: el.weather[0].main,
        dateTime: el.dt_txt,
      };
      weatherOneDayData.push(necessaryData);
    });

    return weatherOneDayData;
  } else if (data === "6h") {
    await weatherList.map((el, i) => {
      if (i <= 7 && i % 2 === 0) {
        weatherFullData.push(el);
      }
    });

    await weatherFullData.map((el) => {
      const necessaryData = {
        tempareture: el.main.temp,
        weather: el.weather[0].main,
        dateTime: el.dt_txt,
      };
      weatherOneDayData.push(necessaryData);
    });
    console.log(weatherFullData);
    return weatherOneDayData;
  }
}

async function getWeather() {
  const lat = "49.84";
  const lon = "24.02";
  const units = "metric";
  const key = process.env.API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/forecast?appid=${key}&units=${units}&lat=${lat}&lon=${lon}`;

  const response = await axios.get(url);

  return response.data.list;
}
