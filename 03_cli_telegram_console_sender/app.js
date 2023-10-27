const TelegramBot = require("node-telegram-bot-api");
const { program } = require("commander");

const telegramBotToken = process.env.telegramBotToken;

const bot = new TelegramBot(telegramBotToken, { polling: true });

program
  .command("message <message>")
  .description("Send message")
  .alias("m")
  .action(async (msg) => {
    const chatId = await getChatId();
    await bot.sendMessage(chatId, msg);
    process.exit();
  });

program
  .command("photo <path>")
  .description("Send photo")
  .alias("p")
  .action(async (path) => {
    const chatId = await getChatId();
    await bot.sendPhoto(chatId, path);
    process.exit();
  });

program.parse(process.argv);

function getChatId() {
  return bot.getUpdates().then((updates) => {
    return updates[0].message.chat.id;
  });
}
