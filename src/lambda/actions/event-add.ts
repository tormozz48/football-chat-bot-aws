import { promisify } from 'util';
import { Context, Handler } from 'aws-lambda';
import { ActionResultEventAdd } from 'src/types/i-action-result';
import { ACTION_STATUSES } from '../../types/i-action-result';
import { IMessage } from '../../types/i-message';
import { dynamoDBDocumentClient } from '../../database/dynamodb';

export const eventAdd: Handler<IMessage, ActionResultEventAdd> = async (
  event,
  context: Context,
): Promise<ActionResultEventAdd> => {
  await dynamoDBDocumentClient
    .put({
      TableName: process.env.EVENTS_TABLE,
      Item: {
        chatId: event.chatId,
        eventDate: new Date().getTime(),
        active: 0,
        members: [],
      },
    })
    .promise();

  const { Items } = await dynamoDBDocumentClient
    .query({
      TableName: process.env.EVENTS_TABLE,
      KeyConditionExpression: 'chatId = :c',
      FilterExpression: 'active = :a',
      ExpressionAttributeValues: {
        ':c': event.chatId,
        ':a': 1,
      },
    })
    .promise();

  console.log(Items);

  return Promise.resolve({ status: ACTION_STATUSES.STATUS_INVALID_DATE_PAST, body: {} });
};
