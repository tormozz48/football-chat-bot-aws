import * as AWS from 'aws-sdk';
import { offlineOptions } from '../src/database/dynamodb';
import { setTimeout } from 'timers/promises';

const dynamodb = new AWS.DynamoDB(offlineOptions);

const waitForDynamoDbToStart = async () => {
  try {
    await dynamodb.listTables().promise();
  } catch (error) {
    console.log('Waiting for Docker container to start...');
    await setTimeout(500);
    return waitForDynamoDbToStart();
  }
};

module.exports = async () => {
  process.env.IS_OFFLINE = 'true';
  process.env.EVENTS_TABLE = 'events-table-dev';

  const start = Date.now();
  try {
    await waitForDynamoDbToStart();
    console.info(`DynamoDB-local started after ${Date.now() - start}ms.`);
    process.exit(0);
  } catch (error) {
    console.info('Error starting DynamoDB-local!', error);
    process.exit(1);
  }
};
