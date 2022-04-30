import { Handler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { LambdaLog } from 'lambda-log';
import { eventAdd } from './actions/event-add';
import { eventInfo } from './actions/event-info';
import { eventRemove } from './actions/event-remove';
import { memberAdd } from './actions/member-add';
import { memberRemove } from './actions/member-remove';
import { template as eventAddTemplate } from './templates/event-add';
import { template as eventInfoTemplate } from './templates/event-info';
import { template as eventRemoveTemplate } from './templates/event-remove';
import { template as memberAddTemplate } from './templates/member-add';
import { template as memberRemoveTemplate } from './templates/member-remove';
import { ActionResult, ActionResults, Actions, IMessage } from './types';

const logger = new LambdaLog({ tags: ['app'] });

const serviceName = process.env.SERVICE_NAME;
const stage = process.env.STAGE;

logger.info(`environment parameters`, { serviceName, stage });

const ActionsMap: Record<Actions, Handler<IMessage, ActionResult>['name']> = {
  [Actions.eventAdd]: eventAdd.name,
  [Actions.eventInfo]: eventInfo.name,
  [Actions.eventRemove]: eventRemove.name,
  [Actions.memberAdd]: memberAdd.name,
  [Actions.memberRemove]: memberRemove.name,
};

const templatesMap = {
  [Actions.eventAdd]: eventAddTemplate,
  [Actions.eventInfo]: eventInfoTemplate,
  [Actions.eventRemove]: eventRemoveTemplate,
  [Actions.memberAdd]: memberAddTemplate,
  [Actions.memberRemove]: memberRemoveTemplate,
};

export async function processMessage(message: IMessage): Promise<string> {
  logger.info('message received', message);

  const { StatusCode, FunctionError, Payload } = await new AWS.Lambda()
    .invoke({
      FunctionName: `${serviceName}-${stage}-${ActionsMap[message.action]}`,
      InvocationType: 'Event',
      Payload: JSON.stringify(message),
    })
    .promise();

  if (FunctionError) {
    logger.error(`Error occurred on lambda invoke`, {
      StatusCode,
      Payload,
    });
  }

  const response: ActionResults[keyof ActionResults] = JSON.parse(Payload.toString());
  const template = templatesMap[message.action][response.status][message.lang];

  return template;
}
