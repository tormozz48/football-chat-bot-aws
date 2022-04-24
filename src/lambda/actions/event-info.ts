import { Handler } from 'aws-lambda';
import * as logger from 'lambda-log';
import { getActiveEvent } from '../../database/repository';
import { ActionResultEventInfo, ACTION_STATUSES, IMessage } from '../../types';

logger.options.tags.push('eventInfo');

export const eventInfo: Handler<IMessage, ActionResultEventInfo> = async (
  event,
): Promise<ActionResultEventInfo> => {
  const { chatId } = event;

  logger.debug('command received', event);

  const activeEvent = await getActiveEvent({ chatId });
  if (!activeEvent) {
    logger.warn('active event does not exist', { chatId });
    return { status: ACTION_STATUSES.EVENT_NOT_FOUND, body: {} };
  }

  return {
    status: ACTION_STATUSES.SUCCESS,
    body: activeEvent,
  };
};
