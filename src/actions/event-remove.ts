import { LambdaLog } from 'lambda-log';
import { removeEvent } from '../database/repository';
import { ActionResults, Actions, ActionStatuses, IMessage } from '../types';
import { resolveEvent, wrapper } from './utils';

const logger = new LambdaLog({ tags: ['eventRemove'] });

export const eventRemove = wrapper<Actions.eventRemove>(eventRemoveFn);

/**
 * Removes current active event
 * @export
 * @param  {IMessage} message
 * @return Promise<ActionResults[Actions.eventRemove]>
 */
async function eventRemoveFn(message: IMessage): Promise<ActionResults[Actions.eventRemove]> {
  const { chatId } = message;

  const currentEvent = await resolveEvent(chatId);

  await removeEvent({ chatId: currentEvent.chatId, eventDate: currentEvent.eventDate });
  logger.debug('event has been removed', currentEvent);

  return { status: ActionStatuses.success, body: currentEvent };
}
