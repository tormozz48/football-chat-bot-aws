import * as AWS from 'aws-sdk';

export const offlineOptions = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DEFAULT_ACCESS_KEY',
  secretAccessKey: 'DEFAULT_SECRET',
  sslEnabled: false,
};

let options = {};
if (process.env.IS_OFFLINE) {
  options = offlineOptions;
}

export const dynamoDBDocumentClient = new AWS.DynamoDB.DocumentClient(options);
