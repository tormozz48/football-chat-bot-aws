module.exports = {
  tables: [
    {
      TableName: `events-table-dev`,
      KeySchema: [
        { AttributeName: 'chatId', KeyType: 'HASH' },
        { AttributeName: 'eventDate', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'chatId', AttributeType: 'N' },
        { AttributeName: 'eventDate', AttributeType: 'N' },
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
  ],
  // installerConfig: {
  //   installPath: './docker/dynamodb',
  // },
  port: 8000,
};
