import { LambdaLog } from 'lambda-log';
import { getActiveEvent, updateEventMembers } from '../database/repository';
import { ActionResults, Actions, ActionStatuses, IMessage } from '../types';
import { ActionError, resolveActiveEvent, wrapper } from './utils';

const logger = new LambdaLog({ tags: ['memberAdd'] });

export const memberAdd = wrapper<Actions.memberAdd>(memberAddFn);

/**
 * Append new member to current active event
 * @export
 * @param  {IMessage} message
 * @return Promise<ActionResults[Actions.memberAdd]>
 */
async function memberAddFn(message: IMessage): Promise<ActionResults[Actions.memberAdd]> {
  const { chatId, text: anotherPerson, memberName: selfPerson } = message;

  const activeEvent = await resolveActiveEvent(chatId);

  const targetPerson = anotherPerson || selfPerson;

  const memberAlreadyExists = activeEvent.members.some(({ name }) => name === targetPerson);
  if (memberAlreadyExists) {
    logger.warn('member has already been added', { chatId, targetPerson });
    throw new ActionError(ActionStatuses.memberAlreadyAdded, {
      ...activeEvent,
      name: targetPerson,
    });
  }

  activeEvent.members.push({ name: targetPerson });
  await updateEventMembers(activeEvent);

  logger.info('member has been added', { chatId, targetPerson });

  const updatedEvent = await getActiveEvent({ chatId });
  return { status: ActionStatuses.success, body: { ...updatedEvent, name: targetPerson } };
}
