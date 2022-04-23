import { dynamoDBDocumentClient } from './dynamodb';
import { ChatIdParam, CreateEventParam, DeactivateEventParam, GetEventParam, Event } from './types';

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
