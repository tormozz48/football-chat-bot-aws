import * as express from 'express';
import * as bodyParser from 'body-parser';
import { LambdaLog } from 'lambda-log';
import VkBot from 'node-vk-bot-api';
import * as serverless from 'serverless-http';
import { processMessage } from '../app';
import { Actions, IMessage, Languages } from '../types';

const logger = new LambdaLog({ tags: ['vk'] });

const token = process.env.VK_TOKEN;
const confirmation = process.env.VK_CONFIRMATION;

const bot = new VkBot({
  token,
  confirmation,
  execute_timeout: 5000,
  polling_timeout: 25,
});

logger.info('vk bot has been initialized');

bot.command('/help', (ctx: VkBotContext) => {
  ctx.reply('Hello');
});

[
  Actions.help,
  Actions.eventAdd,
  Actions.eventInfo,
  Actions.eventRemove,
  Actions.memberAdd,
  Actions.memberRemove,
].forEach((command) => {
  bot.command(`/${command}`, async (ctx: VkBotContext) => {
    try {
      logger.info('Receive context', ctx);
      const [from] = await bot.execute('users.get', {
        user_ids: ctx.message.from_id,
      });
      const message = composeMessage(command, ctx, from);
      const response = await processMessage(message);
      ctx.reply(response.replace(/<\/?(strong|i)>/gm, ''));
    } catch (error) {
      logger.error(error);
      ctx.reply(error.message);
    }
  });
});

const app = express();
app.use(bodyParser.json());
app.use(bot.webhookCallback);

export const handler = serverless(app);

// private

function composeMessage(
  action: Actions,
  ctx: VkBotContext,
  from: { first_name: string; last_name: string },
): IMessage {
  const { message } = ctx;
  const firstName: string = from.first_name || '';
  const lastName: string = from.last_name || '';
  const memberName = `${firstName} ${lastName}`.trim();

  return {
    chatId: getChatId(ctx),
    lang: Languages.ru, //TODO check for lang detection
    text: (message.text ?? '').replace(`/${action}`, '').trim(),
    fullText: message.text,
    action,
    memberName,
  };
}

function getChatId(ctx: VkBotContext): number {
  const { message, groupId } = ctx;
  const peerId: number = +`${message.peer_id}`.replace(/[0-9]0+/, '');
  return peerId + groupId;
}
