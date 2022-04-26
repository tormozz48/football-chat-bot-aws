import { Context, Handler } from 'aws-lambda';
import { ActionResults, Actions, ActionStatuses, IMessage } from '../types';

export const memberRemove: Handler<IMessage, ActionResults[Actions.memberRemove]> = async (
  event,
  context: Context,
): Promise<ActionResults[Actions.memberRemove]> => {
  return Promise.resolve({ status: ActionStatuses.eventNotFound, body: {} });
};
