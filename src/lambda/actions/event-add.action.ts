import { Context, Handler } from 'aws-lambda';
import { ActionResultEventAdd } from 'src/types/i-action-result';
import { ACTION_STATUSES } from '../../types/i-action-result';
import { IMessage } from '../../types/i-message';

export { dynamoDB } from '../../database/dynamodb';

export const eventAdd: Handler<IMessage, ActionResultEventAdd> = async (
  event,
  context: Context,
): Promise<ActionResultEventAdd> => {
  return Promise.resolve({ status: ACTION_STATUSES.STATUS_INVALID_DATE_PAST, body: {} });
};
