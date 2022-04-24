import { Handler } from 'aws-lambda';
import * as logger from 'lambda-log';
import { getActiveEvent, updateEventMembers } from '../../database/repository';
import { ActionResultMemberAdd, ACTION_STATUSES, IMessage } from '../../types';

logger.options.tags.push('memberRemove');

export const memberAdd: Handler<IMessage, ActionResultMemberAdd> = async (
  event,
): Promise<ActionResultMemberAdd> => {
  const { chatId, memberName } = event;

  logger.debug('command received', event);

  const activeEvent = await getActiveEvent({ chatId });
  if (!activeEvent) {
    logger.warn('active event does not exist', { chatId });
    return { status: ACTION_STATUSES.EVENT_NOT_FOUND, body: {} };
  }

  const memberAlreadyExists = activeEvent.members.some(({ name }) => name === memberName);
  if (memberAlreadyExists) {
    logger.warn('member has already been added', { chatId, memberName });
    return {
      status: ACTION_STATUSES.MEMBER_ALREADY_ADDED,
      body: { ...activeEvent, name: memberName },
    };
  }

  activeEvent.members.push({ name: memberName });
  await updateEventMembers(activeEvent);

  logger.debug('member has been added', { chatId, memberName });

  const updatedEvent = await getActiveEvent({ chatId });
  return { status: ACTION_STATUSES.SUCCESS, body: { ...updatedEvent, name: memberName } };
};
