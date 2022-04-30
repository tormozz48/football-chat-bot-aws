import { ActionResults, Actions, ActionStatuses, IMessage } from '../types';
import { resolveActiveEvent, wrapper } from './utils';

export const eventInfo = wrapper<Actions.eventInfo>(eventInfoFn);

/**
 * Show information about current active event
 * @export
 * @param  {IMessage} message
 * @return Promise<ActionResults[Actions.eventInfo]>
 */
async function eventInfoFn(message: IMessage): Promise<ActionResults[Actions.eventInfo]> {
  const { chatId } = message;

  const activeEvent = await resolveActiveEvent(chatId);
  return {
    status: ActionStatuses.success,
    body: activeEvent,
  };
}
