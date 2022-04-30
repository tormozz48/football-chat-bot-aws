import { LambdaLog } from 'lambda-log';
import { createEvent, getActiveEvent, getEvent } from '../database/repository';
import { ActionResults, Actions, ActionStatuses, IMessage } from '../types';
import { isDateInPast, parseDate } from '../utils/date';
import { ActionError, wrapper } from './utils';

const logger = new LambdaLog({ tags: ['eventAdd'] });

export const eventAdd = wrapper<Actions.eventAdd>(eventAddFn);

/**
 * Creates new event
 * @export
 * @param  {IMessage} message
 * @return Promise<ActionResults[Actions.eventAdd]>
 */
async function eventAddFn(message: IMessage): Promise<ActionResults[Actions.eventAdd]> {
  const { chatId } = message;

  let parsedDate = parseDate(message.text);
  if (!parsedDate.isValid) {
    logger.warn('event date invalid', { chatId, date: message.text });
    throw new ActionError(ActionStatuses.eventInvalidDate);
  }
  if (isDateInPast(parsedDate)) {
    logger.warn('event date in past', { chatId, date: message.text });
    throw new ActionError(ActionStatuses.eventInvalidDatePast);
  }

  const eventDate = parsedDate.valueOf();

  const existedEvent = await getEvent({ chatId, eventDate });
  if (existedEvent) {
    logger.warn('event already exists', { chatId, date: message.text });
    throw new ActionError(ActionStatuses.eventAlreadyExists, existedEvent);
  }

  await createEvent({ chatId, eventDate });
  const activeEvent = await getActiveEvent({ chatId });

  logger.info('event has been successfully created', activeEvent);

  return { status: ActionStatuses.success, body: activeEvent };
}
