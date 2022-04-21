import { Context, Handler } from 'aws-lambda';
import { IMessage } from 'src/types/i-message';
import { ActionResultEventRemove, ACTION_STATUSES } from '../../types/i-action-result';

export { dynamoDB } from '../../database/dynamodb';

export const eventRemove: Handler<IMessage, ActionResultEventRemove> = async (
  event,
  context: Context,
): Promise<ActionResultEventRemove> => {
  return Promise.resolve({ status: ACTION_STATUSES.STATUS_NO_EVENT, body: {} });
};
