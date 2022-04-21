import { Context, Handler } from 'aws-lambda';
import { IMessage } from 'src/types/i-message';
import { ActionResultMemberAdd, ACTION_STATUSES } from '../../types/i-action-result';

export { dynamoDB } from '../../database/dynamodb';

export const memberAdd: Handler<IMessage, ActionResultMemberAdd> = async (
  event,
  context: Context,
): Promise<ActionResultMemberAdd> => {
  return Promise.resolve({ status: ACTION_STATUSES.STATUS_NO_EVENT, body: {} });
};
