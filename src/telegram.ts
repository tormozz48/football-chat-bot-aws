import { LambdaLog } from 'lambda-log';
import { Telegraf, Context } from 'telegraf';
import * as telegrafAws from 'telegraf-aws';
import { processMessage } from './app';
import { Actions, IMessage, Languages } from './types';
import { Update } from 'telegraf/typings/core/types/typegram';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN, { telegram: { webhookReply: true } });
bot.telegram.setWebhook(process.env.TELEGRAM_BOT_WEBHOOK_URL);

const logger = new LambdaLog({ tags: ['telegram'] });

logger.info('telegraf bot has been initialized', {
  webhook: process.env.TELEGRAM_BOT_WEBHOOK_URL,
});

[
  Actions.eventAdd,
  Actions.eventInfo,
  Actions.eventRemove,
  Actions.memberAdd,
  Actions.memberRemove,
].forEach((command) => {
  bot.command(command, async (ctx: Context & Context<Update.MessageUpdate>) => {
    try {
      const message = composeMessage(command, ctx);
      const response = await processMessage(message);
      return ctx.reply(response);
    } catch (error) {
      logger.error(error);
      return ctx.reply(error);
    }
  });
});

bot.command('help', (ctx: Context) => {
  logger.options.tags.push('help');
  logger.info('help command received', ctx);

  return ctx.reply('Try send a sticker!');
});

export const handler = telegrafAws(bot, { timeout: 1000 });

// private

function composeMessage(action: Actions, ctx: Context & Context<Update.MessageUpdate>): IMessage {
  const { message } = ctx.update;
  const firstName: string = message.from.first_name || '';
  const lastName: string = message.from.last_name || '';
  const memberName = `${firstName} ${lastName}`.trim();

  return {
    chatId: adjustChatId(message.chat.id),
    lang: detectLanguage(ctx),
    text: extractText(action, ctx),
    fullText: message['text'],
    action,
    memberName,
  };
}

function detectLanguage(ctx: Context & Context<Update.MessageUpdate>): Languages {
  switch (ctx.update.message.from.language_code) {
    case Languages.en:
      return Languages.en;
    default:
      return Languages.ru;
  }
}

/**
 * Telegram chat identifier may be greater or less then max 4 byte integer value
 * @param  {number} chatId
 * @return number
 */
function adjustChatId(chatId: number): number {
  if (Math.abs(chatId) < 2147483648) {
    return chatId;
  }
  return adjustChatId(chatId >>> 1);
}

/**
 * Trim command name and bot name e.g @MyBot which can be appear on some devices
 * @param  {Actions} command
 * @param  {(Context & Context<Update.MessageUpdate>)} ctx
 * @return string
 */
function extractText(command: Actions, ctx: Context & Context<Update.MessageUpdate>): string {
  let text: string = ctx.update.message['text'].replace(`/${command}`, '');
  if (ctx.botInfo?.username) {
    text = text.replace(new RegExp(`@?${ctx.botInfo.username}`), '');
  }
  return text;
}
