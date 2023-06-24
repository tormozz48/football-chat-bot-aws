import { LambdaLog } from 'lambda-log';
import { getChatEvent, updateEventMembers } from '../database/repository';
import { ActionResults, Actions, ActionStatuses, IMessage } from '../types';
import { ActionError, resolveEvent, wrapper } from './utils';

const logger = new LambdaLog({ tags: ['memberRemove'] });

export const memberRemove = wrapper<Actions.memberRemove>(memberRemoveFn);

/**
 * Remove member from active event
 * @export
 * @param  {IMessage} message
 * @return Promise<ActionResults[Actions.memberRemove]>
 */
async function memberRemoveFn(message: IMessage): Promise<ActionResults[Actions.memberRemove]> {
  const { chatId, text: anotherPerson, memberName: selfPerson } = message;

  const currentEvent = await resolveEvent(chatId);

  const targetPerson = anotherPerson || selfPerson;

  const memberIndex = currentEvent.members.findIndex(({ name }) => name === targetPerson);
  if (memberIndex === -1) {
    logger.warn('member was not found', { chatId, targetPerson });
    throw new ActionError(ActionStatuses.memberNotFound, { ...currentEvent, name: targetPerson });
  }

  currentEvent.members.splice(memberIndex, 1);
  await updateEventMembers(currentEvent);

  logger.info('member has been removed', { chatId, targetPerson });

  const updatedEvent = await getChatEvent({ chatId });
  return { status: ActionStatuses.success, body: { ...updatedEvent, name: targetPerson } };
}
