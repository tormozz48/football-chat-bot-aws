import { Context, Handler } from 'aws-lambda';
import { IMessage } from 'src/types/i-message';
import { ActionResultMemberRemove, ACTION_STATUSES } from '../../types/i-action-result';

export { dynamoDB } from '../../database/dynamodb';

export const memberRemove: Handler<IMessage, ActionResultMemberRemove> = async (
  event,
  context: Context,
): Promise<ActionResultMemberRemove> => {
  return Promise.resolve({ status: ACTION_STATUSES.STATUS_NO_EVENT, body: {} });
};
