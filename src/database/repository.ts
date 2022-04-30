import { dynamoDBDocumentClient } from './dynamodb';
import { UpdateEventMembersParam } from './types';
import {
  ChatIdParam,
  CreateEventParam,
  DeactivateEventParam,
  GetEventParam,
  Event,
  RemoveEventParam,
} from './types';

const eventsTableName = { TableName: process.env.EVENTS_TABLE };

/**
 * Get list of all events for given chat identifier
 * @export
 * @template T
 * @param  {ChatIdParam} { chatId } - unique chat identifier
 * @return Promise<T[]>
 */
export async function getEvents<T = Event>({ chatId }: ChatIdParam): Promise<T[]> {
  const { Items } = await dynamoDBDocumentClient
    .query({
      ...eventsTableName,
      KeyConditionExpression: 'chatId = :c',
      ExpressionAttributeValues: { ':c': chatId },
    })
    .promise();

  return Items as T[];
}

/**
 * Get event by chat identifier and event date
 * @export
 * @template T
 * @param  {GetEventParam} params - unique event params
 * @return Promise<T>
 */
export async function getEvent<T = Event>(params: GetEventParam): Promise<T> {
  const { Item } = await dynamoDBDocumentClient
    .get({
      ...eventsTableName,
      Key: params,
    })
    .promise();

  return Item as T;
}

/**
 * Get list of active events for given chat identifier
 * @export
 * @template T
 * @param  {ChatIdParam} { chatId } - unique chat identifier
 * @return Promise<T[]>
 */
export async function getActiveEvents<T = Event>({ chatId }: ChatIdParam): Promise<T[]> {
  const { Items } = await dynamoDBDocumentClient
    .query({
      ...eventsTableName,
      ...getActiveEventQuery(chatId),
    })
    .promise();

  return Items as T[];
}

/**
 * Get last active event for given chat identifier
 * @export
 * @template T
 * @param  {ChatIdParam} { chatId } - unique chat identifier
 * @return Promise<T>
 */
export async function getActiveEvent<T = Event>({ chatId }: ChatIdParam): Promise<T> {
  const { Items } = await dynamoDBDocumentClient
    .query({
      ...eventsTableName,
      ...getActiveEventQuery(chatId),
      ScanIndexForward: false,
      Limit: 1,
    })
    .promise();

  return Items[0] as T;
}

/**
 * Create event with given event params
 * @export
 * @param  {CreateEventParam} params
 * @return Promise<void>
 */
export async function createEvent(params: CreateEventParam): Promise<void> {
  const events = await getActiveEvents(params);
  for (const { chatId, eventDate } of events) {
    await deativateEvent({ chatId, eventDate });
  }

  await dynamoDBDocumentClient
    .put({
      ...eventsTableName,
      Item: {
        ...params,
        active: 1,
        members: [],
      },
    })
    .promise();
}

/**
 * Update set of members for given event params
 * @export
 * @param  {UpdateEventMembersParam} params
 * @return Promise<void>
 */
export async function updateEventMembers(params: UpdateEventMembersParam): Promise<void> {
  await dynamoDBDocumentClient
    .update({
      ...eventsTableName,
      Key: { chatId: params.chatId, eventDate: params.eventDate },
      UpdateExpression: 'SET members = :m',
      ExpressionAttributeValues: { ':m': params.members },
      ReturnValues: 'ALL_NEW',
    })
    .promise();
}

/**
 * Deactivate event for given event params
 * @export
 * @param  {DeactivateEventParam} params
 * @return Promise<void>
 */
export async function deativateEvent(params: DeactivateEventParam): Promise<void> {
  await dynamoDBDocumentClient
    .update({
      ...eventsTableName,
      Key: params,
      UpdateExpression: 'SET active = 0',
      ReturnValues: 'ALL_NEW',
    })
    .promise();
}

/**
 * Remove event for given event params
 * @export
 * @param  {RemoveEventParam} params
 * @return Promise<void>
 */
export async function removeEvent(params: RemoveEventParam): Promise<void> {
  await dynamoDBDocumentClient
    .delete({
      ...eventsTableName,
      Key: params,
    })
    .promise();
}

// private

function getActiveEventQuery(chatId: number) {
  return {
    KeyConditionExpression: 'chatId = :c',
    FilterExpression: 'active = :a',
    ExpressionAttributeValues: {
      ':c': chatId,
      ':a': 1,
    },
  };
}
