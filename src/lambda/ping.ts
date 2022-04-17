import * as logger from 'lambda-log';

export const handler = (event, context, callback) => {
  logger.options.tags.push('ping');
  logger.info('event has been received');

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ status: 'ok' }),
  });
};
