import { Handler } from 'aws-lambda';
import { LambdaLog } from 'lambda-log';
import { getActiveEvent } from '../database/repository';
import { ActionResults, Actions, ActionStatuses, IMessage } from '../types';

const logger = new LambdaLog({ tags: ['eventInfo'] });

export const eventInfo: Handler<IMessage, ActionResults[Actions.eventInfo]> = async (
  event,
): Promise<ActionResults[Actions.eventInfo]> => {
  const { chatId } = event;

  logger.debug('command received', event);

  const activeEvent = await getActiveEvent({ chatId });
  if (!activeEvent) {
    logger.warn('active event does not exist', { chatId });
    return { status: ActionStatuses.eventNotFound, body: {} };
  }

  return {
    status: ActionStatuses.success,
    body: activeEvent,
  };
};
