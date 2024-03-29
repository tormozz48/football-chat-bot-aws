import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { dynamoDBDocumentClient } from './dynamodb';
import { UpdateEventMembersParam } from './types';
import { ChatIdParam, CreateEventParam, GetEventParam, Event, RemoveEventParam } from './types';

const eventsTableName = { TableName: process.env.EVENTS_TABLE };

/**
 * Get list of events for given chat identifier
 * @export
 * @template T
 * @param  {ChatIdParam} { chatId } - unique chat identifier
 * @return Promise<T[]>
 */
export async function getEvents<T = Event>({ chatId }: ChatIdParam): Promise<T[]> {
  const { Items } = await dynamoDBDocumentClient
    .query({
      ...eventsTableName,
      ...getEventQuery(chatId),
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
 * Get last event for given chat identifier
 * @export
 * @template T
 * @param  {ChatIdParam} { chatId } - unique chat identifier
 * @return Promise<T>
 */
export async function getChatEvent<T = Event>({ chatId }: ChatIdParam): Promise<T> {
  const { Items } = await dynamoDBDocumentClient
    .query({
      ...eventsTableName,
      ...getEventQuery(chatId),
      ScanIndexForward: false,
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
  const events = await getEvents(params);
  for (const { chatId, eventDate } of events) {
    await removeEvent({ chatId, eventDate });
  }

  await dynamoDBDocumentClient
    .put({
      ...eventsTableName,
      Item: {
        ...params,
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

function getEventQuery(chatId: number): Omit<DocumentClient.QueryInput, 'TableName'> {
  return {
    KeyConditionExpression: 'chatId = :c',
    ExpressionAttributeValues: {
      ':c': chatId,
    },
  };
}
