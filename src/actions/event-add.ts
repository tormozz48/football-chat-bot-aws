import { Handler } from 'aws-lambda';
import { LambdaLog } from 'lambda-log';
import { isDateInPast, parseDate } from '../utils/date';
import { createEvent, getActiveEvent, getEvent } from '../database/repository';
import { ActionResults, ActionStatuses, IMessage, Actions } from '../types';

const logger = new LambdaLog({ tags: ['eventAdd'] });

/**
 * Creates new event
 * @export
 * @param  {IMessage} message
 * @return Promise<ActionResults[Actions.eventAdd]>
 */
export async function eventAdd(message: IMessage): Promise<ActionResults[Actions.eventAdd]> {
  const { chatId } = message;

  logger.info('command received', message);

  let parsedDate = parseDate(message.text);
  if (!parsedDate.isValid) {
    logger.warn('event date invalid', { chatId, date: message.text });
    return { status: ActionStatuses.eventInvalidDate, body: {} };
  }
  if (isDateInPast(parsedDate)) {
    logger.warn('event date in past', { chatId, date: message.text });
    return { status: ActionStatuses.eventInvalidDatePast, body: {} };
  }

  const eventDate = parsedDate.valueOf();

  const existedEvent = await getEvent({ chatId, eventDate });
  if (existedEvent) {
    logger.warn('event already exists', { chatId, date: message.text });
    return {
      status: ActionStatuses.eventAlreadyExists,
      body: existedEvent,
    };
  }

  await createEvent({ chatId, eventDate });
  const activeEvent = await getActiveEvent({ chatId });

  logger.info('event has been successfully created', activeEvent);

  return { status: ActionStatuses.success, body: activeEvent };
}
