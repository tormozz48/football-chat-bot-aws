import { Handler } from 'aws-lambda';
import * as logger from 'lambda-log';
import { getActiveEvent, updateEventMembers } from '../database/repository';
import { ActionResults, Actions, ActionStatuses, IMessage } from '../types';

logger.options.tags.push('memberRemove');

export const memberAdd: Handler<IMessage, ActionResults[Actions.memberAdd]> = async (
  event,
): Promise<ActionResults[Actions.memberAdd]> => {
  const { chatId, memberName } = event;

  logger.debug('command received', event);

  const activeEvent = await getActiveEvent({ chatId });
  if (!activeEvent) {
    logger.warn('active event does not exist', { chatId });
    return { status: ActionStatuses.eventNotFound, body: {} };
  }

  const memberAlreadyExists = activeEvent.members.some(({ name }) => name === memberName);
  if (memberAlreadyExists) {
    logger.warn('member has already been added', { chatId, memberName });
    return {
      status: ActionStatuses.memberAlreadyAdded,
      body: { ...activeEvent, name: memberName },
    };
  }

  activeEvent.members.push({ name: memberName });
  await updateEventMembers(activeEvent);

  logger.debug('member has been added', { chatId, memberName });

  const updatedEvent = await getActiveEvent({ chatId });
  return { status: ActionStatuses.success, body: { ...updatedEvent, name: memberName } };
};
