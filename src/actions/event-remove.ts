import { LambdaLog } from 'lambda-log';
import { removeEvent } from '../database/repository';
import { ActionResults, Actions, ActionStatuses, IMessage } from '../types';
import { resolveActiveEvent, wrapper } from './utils';

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

  const activeEvent = await resolveActiveEvent(chatId);

  await removeEvent({ chatId: activeEvent.chatId, eventDate: activeEvent.eventDate });
  logger.debug('event has been removed', activeEvent);

  return { status: ActionStatuses.success, body: activeEvent };
}
