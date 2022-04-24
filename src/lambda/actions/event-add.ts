import { Handler } from 'aws-lambda';
import * as logger from 'lambda-log';
import { isDateInPast, parseDate } from 'src/utils/date';
import { createEvent, getActiveEvent, getEvent } from '../../database/repository';
import { ActionResultEventAdd, ACTION_STATUSES, IMessage } from '../../types';

logger.options.tags.push('eventAdd');

export const eventAdd: Handler<IMessage, ActionResultEventAdd> = async (
  event,
): Promise<ActionResultEventAdd> => {
  const { chatId } = event;

  logger.debug('command received', event);

  let parsedDate = parseDate(event.text);
  if (!parsedDate.isValid()) {
    logger.warn('event date invalid', { chatId, date: event.text });
    return { status: ACTION_STATUSES.EVENT_INVALID_DATE, body: {} };
  }
  if (isDateInPast(parsedDate)) {
    logger.warn('event date in past', { chatId, date: event.text });
    return { status: ACTION_STATUSES.EVENT_INVALID_DATE_PAST, body: {} };
  }

  const eventDate = parsedDate.valueOf();

  const existedEvent = await getEvent({ chatId, eventDate });
  if (existedEvent) {
    logger.warn('event already exists', { chatId, date: event.text });
    return {
      status: ACTION_STATUSES.EVENT_ALREADY_EXISTS,
      body: existedEvent,
    };
  }

  await createEvent({ chatId, eventDate });
  const activeEvent = await getActiveEvent({ chatId });

  logger.debug('event has been successfully created', activeEvent);

  return { status: ACTION_STATUSES.SUCCESS, body: activeEvent };
};
