import { Handler } from 'aws-lambda';
import { LambdaLog } from 'lambda-log';
import { getActiveEvent, updateEventMembers } from '../database/repository';
import { ActionResults, Actions, ActionStatuses, IMessage } from '../types';

const logger = new LambdaLog({ tags: ['memberAdd'] });

export const memberAdd: Handler<IMessage, ActionResults[Actions.memberAdd]> = async (
  event,
): Promise<ActionResults[Actions.memberAdd]> => {
  const { chatId, text: anotherPerson, memberName: selfPerson } = event;

  logger.info('command received', event);

  const activeEvent = await getActiveEvent({ chatId });
  if (!activeEvent) {
    logger.warn('active event does not exist', { chatId });
    return { status: ActionStatuses.eventNotFound, body: {} };
  }

  const targetPerson = anotherPerson || selfPerson;

  const memberAlreadyExists = activeEvent.members.some(({ name }) => name === targetPerson);
  if (memberAlreadyExists) {
    logger.warn('member has already been added', { chatId, targetPerson });
    return {
      status: ActionStatuses.memberAlreadyAdded,
      body: { ...activeEvent, name: targetPerson },
    };
  }

  activeEvent.members.push({ name: targetPerson });
  await updateEventMembers(activeEvent);

  logger.info('member has been added', { chatId, targetPerson });

  const updatedEvent = await getActiveEvent({ chatId });
  return { status: ActionStatuses.success, body: { ...updatedEvent, name: targetPerson } };
};
