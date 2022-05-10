import { APIGatewayEvent, APIGatewayEventRequestContext } from 'aws-lambda';
import { LambdaLog } from 'lambda-log';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import VkBot from 'node-vk-bot-api';
import * as serverless from 'serverless-http';
import * as Context from 'node-vk-bot-api/lib/context';
import { processMessage } from '../app';
import { Actions, IMessage, Languages } from '../types';

const logger = new LambdaLog({ tags: ['vk'] });

const token = process.env.VK_TOKEN;
const confirmation = process.env.VK_CONFIRMATION;

const bot = new VkBot({
  token,
  confirmation,
});

logger.info('vk bot has been initialized');

bot.command('/help', async (ctx: VkBotContext) => {
  ctx.reply('help');
});

const app = express().use(bodyParser.json()).use(bot.webhookCallback);
const _handler = serverless(app);

export const handler = async (event: APIGatewayEvent, context: APIGatewayEventRequestContext) => {
  const result = await _handler(event, context);
  return result;
};

/*
export const handler = async (event: APIGatewayEvent) => {
  const bot = new VkBot({
    token,
    confirmation,
  });

  logger.info('vk bot has been initialized');

  const data = JSON.parse(event.body);
  if (data.type === 'confirmation') {
    return {
      statusCode: 200,
      body: confirmation,
    };
  }

  const ctx: VkBotContext = new Context(data, bot);
  try {
    logger.info('Receive context', ctx);
    const command = resolveCommand(ctx.message.text);
    if (!command) {
      return makeResponse();
    }

    const [from] = await bot.execute('users.get', {
      user_ids: ctx.message.from_id,
    });
    const message = composeMessage(command, ctx, from);
    const response = await processMessage(message);
    ctx.reply(response.replace(/<\/?(strong|i)>/gm, ''));
  } catch (error) {
    logger.error(error.message);
    ctx.reply(error.message);
  } finally {
    return makeResponse();
  }
};
*/

// private

function resolveCommand(text: string): Actions | null {
  const command = [
    Actions.help,
    Actions.eventAdd,
    Actions.eventInfo,
    Actions.eventRemove,
    Actions.memberAdd,
    Actions.memberRemove,
  ].find((action) => text.trim().startsWith(`/${action}`));

  return command ?? null;
}

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

function makeResponse() {
  return {
    statusCode: 200,
    isBase64Encoded: false,
    body: 'ok',
  };
}
