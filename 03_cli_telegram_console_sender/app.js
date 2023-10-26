const TelegramBot = require("node-telegram-bot-api");
const { program } = require("commander");

const telegramBotToken = process.env.telegramBotToken;

const bot = new TelegramBot(telegramBotToken, { polling: true });

program
  .command("message <message>")
  .description("Send message")
  .alias("m")
  .action((msg) => {
    getChatId().then(async (chatId) => {
      await bot.sendMessage(chatId, msg);
      process.exit();
    });
  });

program
  .command("photo <path>")
  .description("Send photo")
  .alias("p")
  .action((path) => {
    getChatId().then(async (chatId) => {
      await bot.sendPhoto(chatId, path);
      process.exit();
    });
  });

program.parse(process.argv);

function getChatId() {
  return bot.getUpdates().then((updates) => {
    return updates[0].message.chat.id;
  });
}
