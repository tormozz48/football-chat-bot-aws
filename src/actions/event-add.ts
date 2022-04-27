import { Handler } from 'aws-lambda';
import { LambdaLog } from 'lambda-log';
import { isDateInPast, parseDate } from 'src/utils/date';
import { createEvent, getActiveEvent, getEvent } from '../database/repository';
import { ActionResults, ActionStatuses, IMessage, Actions } from '../types';

const logger = new LambdaLog({ tags: ['eventAdd'] });

export const eventAdd: Handler<IMessage, ActionResults[Actions.eventAdd]> = async (
  event,
): Promise<ActionResults[Actions.eventAdd]> => {
  const { chatId } = event;

  logger.info('command received', event);

  let parsedDate = parseDate(event.text);
  if (!parsedDate.isValid()) {
    logger.warn('event date invalid', { chatId, date: event.text });
    return { status: ActionStatuses.eventInvalidDate, body: {} };
  }
  if (isDateInPast(parsedDate)) {
    logger.warn('event date in past', { chatId, date: event.text });
    return { status: ActionStatuses.eventInvalidDatePast, body: {} };
  }

  const eventDate = parsedDate.valueOf();

  const existedEvent = await getEvent({ chatId, eventDate });
  if (existedEvent) {
    logger.warn('event already exists', { chatId, date: event.text });
    return {
      status: ActionStatuses.eventAlreadyExists,
      body: existedEvent,
    };
  }

  await createEvent({ chatId, eventDate });
  const activeEvent = await getActiveEvent({ chatId });

  logger.info('event has been successfully created', activeEvent);

  return { status: ActionStatuses.success, body: activeEvent };
};
