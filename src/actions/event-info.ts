import { Handler } from 'aws-lambda';
import { LambdaLog } from 'lambda-log';
import { getActiveEvent } from '../database/repository';
import { ActionResults, Actions, ActionStatuses, IMessage } from '../types';

const logger = new LambdaLog({ tags: ['eventInfo'] });

/**
 * Show information about current active event
 * @export
 * @param  {IMessage} message
 * @return Promise<ActionResults[Actions.eventInfo]>
 */
export async function eventInfo(message: IMessage): Promise<ActionResults[Actions.eventInfo]> {
  const { chatId } = message;

  logger.debug('command received', message);

  const activeEvent = await getActiveEvent({ chatId });
  if (!activeEvent) {
    logger.warn('active event does not exist', { chatId });
    return { status: ActionStatuses.eventNotFound, body: {} };
  }

  return {
    status: ActionStatuses.success,
    body: activeEvent,
  };
}
