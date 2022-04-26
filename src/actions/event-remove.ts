import { Handler } from 'aws-lambda';
import * as logger from 'lambda-log';
import { getActiveEvent, removeEvent } from '../database/repository';
import { ActionResults, Actions, ActionStatuses, IMessage } from '../types';

logger.options.tags.push('eventRemove');

export const eventRemove: Handler<IMessage, ActionResults[Actions.eventRemove]> = async (
  event,
): Promise<ActionResults[Actions.eventRemove]> => {
  const { chatId } = event;

  logger.debug('command received', event);

  const activeEvent = await getActiveEvent({ chatId });
  if (!activeEvent) {
    logger.warn('active event does not exist', { chatId });
    return { status: ActionStatuses.eventNotFound, body: {} };
  }

  await removeEvent({ chatId: activeEvent.chatId, eventDate: activeEvent.eventDate });
  logger.debug('event has been removed', activeEvent);

  return { status: ActionStatuses.success, body: activeEvent };
};
