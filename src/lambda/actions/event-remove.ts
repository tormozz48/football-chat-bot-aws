import { Handler } from 'aws-lambda';
import * as logger from 'lambda-log';
import { getActiveEvent, removeEvent } from '../../database/repository';
import { ActionResultEventRemove, ACTION_STATUSES, IMessage } from '../../types';

logger.options.tags.push('eventRemove');

export const eventRemove: Handler<IMessage, ActionResultEventRemove> = async (
  event,
): Promise<ActionResultEventRemove> => {
  const { chatId } = event;

  logger.debug('command received', event);

  const activeEvent = await getActiveEvent({ chatId });
  if (!activeEvent) {
    logger.warn('active event does not exist', { chatId });
    return { status: ACTION_STATUSES.EVENT_NOT_FOUND, body: {} };
  }

  await removeEvent({ chatId: activeEvent.chatId, eventDate: activeEvent.eventDate });
  logger.debug('event has been removed', activeEvent);

  return { status: ACTION_STATUSES.SUCCESS, body: activeEvent };
};
