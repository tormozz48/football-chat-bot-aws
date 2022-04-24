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

export async function getEvent<T = Event>(params: GetEventParam): Promise<T> {
  const { Item } = await dynamoDBDocumentClient
    .get({
      ...eventsTableName,
      Key: params,
    })
    .promise();

  return Item as T;
}

export async function getActiveEvents<T = Event>({ chatId }: ChatIdParam): Promise<T[]> {
  const { Items } = await dynamoDBDocumentClient
    .query({
      ...eventsTableName,
      ...getActiveEventQuery(chatId),
    })
    .promise();

  return Items as T[];
}

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
        members: [],
      },
    })
    .promise();
}

export async function updateEventMembers(params: UpdateEventMembersParam): Promise<void> {
  await dynamoDBDocumentClient.update({
    ...eventsTableName,
    Key: { chatId: params.chatId, eventDate: params.eventDate },
    UpdateExpression: 'SET members = :m',
    ExpressionAttributeValues: { ':m': params.members },
    ReturnValues: 'ALL_NEW',
  });
}

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

export async function removeEvent(params: RemoveEventParam): Promise<void> {
  await dynamoDBDocumentClient.delete({
    ...eventsTableName,
    Key: params,
  });
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
