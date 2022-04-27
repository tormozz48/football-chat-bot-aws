import { Context, Handler } from 'aws-lambda';
import { LambdaLog } from 'lambda-log';
import { ActionResults, Actions, ActionStatuses, IMessage } from '../types';

const logger = new LambdaLog({ tags: ['memberRemove'] });

export const memberRemove: Handler<IMessage, ActionResults[Actions.memberRemove]> = async (
  event,
  context: Context,
): Promise<ActionResults[Actions.memberRemove]> => {
  logger.debug('command received', event);

  return Promise.resolve({ status: ActionStatuses.eventNotFound, body: {} });
};
