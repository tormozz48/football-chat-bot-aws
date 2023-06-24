import { LambdaLog } from 'lambda-log';
import { getChatEvent } from '../database/repository';
import { ActionResults, IMessage, Actions, ActionStatuses } from '../types';
import { Event } from '../database/types';

const logger = new LambdaLog({ tags: ['wrapper'] });

/**
 * Custom action error class
 * @export
 * @class ActionError
 * @extends Error
 */
export class ActionError extends Error {
  constructor(public readonly status: ActionStatuses, public readonly body = {}) {
    super();
  }
}

/**
 * Resolves active event for given chat identifier
 * Throws error if active event was not found
 * @export
 * @throws ActionError
 * @param  {number} chatId
 * @return Promise<Event>
 */
export async function resolveEvent(chatId: number): Promise<Event> {
  const currentEvent = await getChatEvent({ chatId });
  if (!currentEvent) {
    logger.warn('current event does not exist', { chatId });
    throw new ActionError(ActionStatuses.eventNotFound);
  }

  return currentEvent;
}

/**
 * Wraps given function into error handler
 * @export
 * @template T
 * @param  {(message: IMessage) => Promise<ActionResults[T]>} fn
 * @return
 */
export function wrapper<T extends Actions>(fn: (message: IMessage) => Promise<ActionResults[T]>) {
  return async (message: IMessage): Promise<ActionResults[T]> => {
    try {
      logger.info('command received', message);
      const response = await fn(message);
      logger.info('command completed', response);
      return response;
    } catch (error) {
      if (error instanceof ActionError) {
        return {
          status: error.status,
          body: error.body,
        } as ActionResults[T];
      }

      logger.error('Unhandled error occurred', { error });
      return {
        status: ActionStatuses.fail,
        body: {},
      } as ActionResults[T];
    }
  };
}
