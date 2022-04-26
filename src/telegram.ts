import * as logger from 'lambda-log';
import { Telegraf, Context } from 'telegraf';
import * as telegrafAws from 'telegraf-aws';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN, { telegram: { webhookReply: true } });
bot.telegram.setWebhook(process.env.TELEGRAM_BOT_WEBHOOK_URL);

logger.options.tags.push('telegram');

logger.info('telegraf bot has been initialized', {
  webhook: process.env.TELEGRAM_BOT_WEBHOOK_URL,
});

bot.command('help', (ctx: Context) => {
  logger.options.tags.push('help');
  logger.info('help command received');

  return ctx.reply('Try send a sticker!');
});

export const handler = telegrafAws(bot, {
  timeout: 1000,
});
