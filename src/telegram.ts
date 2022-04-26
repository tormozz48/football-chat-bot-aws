import * as logger from 'lambda-log';
import { Telegraf, Context } from 'telegraf';
import * as telegrafAws from 'telegraf-aws';
import { processMessage } from './app';
import { Actions, IMessage, Languages } from './types';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN, { telegram: { webhookReply: true } });
bot.telegram.setWebhook(process.env.TELEGRAM_BOT_WEBHOOK_URL);

logger.options.tags.push('telegram');

logger.info('telegraf bot has been initialized', {
  webhook: process.env.TELEGRAM_BOT_WEBHOOK_URL,
});

[
  Actions.eventAdd,
  Actions.eventInfo,
  Actions.eventRemove,
  Actions.memberAdd,
  Actions.memberRemove,
].forEach(async (command) => {
  bot.command(command, async (ctx: Context) => {
    const response = await processMessage(composeMessage(command, ctx));
    return ctx.reply(response);
  });
});

bot.command('help', (ctx: Context) => {
  logger.options.tags.push('help');
  logger.info('help command received', ctx);

  return ctx.reply('Try send a sticker!');
});

export const handler = telegrafAws(bot, {
  timeout: 1000,
});

function composeMessage(command: Actions, ctx: Context): IMessage {
  const firstName: string = ctx.from.first_name || '';
  const lastName: string = ctx.from.last_name || '';
  const memberName = `${firstName} ${lastName}`.trim();

  return {
    chatId: adjustChatId(ctx.chat.id),
    lang: detectLanguage(ctx),
    text: extractText(command, ctx),
    fullText: ctx.update['message'],
    command,
    memberName,
  };
}

function detectLanguage(ctx: Context): Languages {
  switch (ctx.from.language_code) {
    case Languages.en:
      return Languages.en;
    default:
      return Languages.ru;
  }
}

/**
 * Telegram chat identifier may be greater or less then max 4 byte integer value
 */
function adjustChatId(chatId: number): number {
  if (Math.abs(chatId) < 2147483648) {
    return chatId;
  }
  return adjustChatId(chatId >>> 1);
}

/**
 * Trim command name and bot name e.g @MyBot which can be appear on some devices
 * @param fullText
 */
function extractText(command: Actions, ctx: Context): string {
  let text: string = ctx.update['message'].replace(`/${command}`, '');
  if (ctx.botInfo?.username) {
    text = text.replace(new RegExp(`@?${ctx.botInfo.username}`), '');
  }
  return text;
}
