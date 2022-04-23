import { Context, Handler } from 'aws-lambda';
import { IMessage } from 'src/types/i-message';
import { ActionResultEventInfo, ACTION_STATUSES } from '../../types/i-action-result';

export { dynamoDB } from '../../database/dynamodb';

export const eventInfo: Handler<IMessage, ActionResultEventInfo> = async (
  event,
  context: Context,
): Promise<ActionResultEventInfo> => {
  return Promise.resolve({ status: ACTION_STATUSES.STATUS_NO_EVENT, body: {} });
};
