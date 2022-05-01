import { Handler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { compile } from 'handlebars';
import { LambdaLog } from 'lambda-log';
import { EOL } from 'os';
import { templates as eventAddTemplates } from './templates/event-add.template';
import { templates as eventInfoTemplates } from './templates/event-info.template';
import { templates as eventRemoveTemplates } from './templates/event-remove.template';
import { templates as memberAddTemplates } from './templates/member-add.template';
import { templates as memberRemoveTemplates } from './templates/member-remove.template';
import { templates as eventNotFoundTemplates } from './templates/shared/event-not-found.template';
import { templates as failTemplates } from './templates/shared/fail.template';
import { ActionResult, ActionResults, Actions, IMessage } from './types';

const logger = new LambdaLog({ tags: ['app'] });

const serviceName = process.env.SERVICE_NAME;
const stage = process.env.STAGE;

logger.info(`environment parameters`, { serviceName, stage });

const ActionsMap: Record<Actions, Handler<IMessage, ActionResult>['name']> = {
  [Actions.eventAdd]: 'eventAdd',
  [Actions.eventInfo]: 'eventInfo',
  [Actions.eventRemove]: 'eventRemove',
  [Actions.memberAdd]: 'memberAdd',
  [Actions.memberRemove]: 'memberRemove',
};

const templates = [
  ...eventAddTemplates,
  ...eventInfoTemplates,
  ...eventRemoveTemplates,
  ...eventNotFoundTemplates,
  ...memberAddTemplates,
  ...memberRemoveTemplates,
  ...failTemplates,
];

export async function processMessage(message: IMessage): Promise<string> {
  logger.info('message received', message);

  const { StatusCode, FunctionError, Payload } = await new AWS.Lambda()
    .invoke({
      FunctionName: `${serviceName}-${stage}-${ActionsMap[message.action]}`,
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
  return applyTemplate(message, response);
}

// private

function applyTemplate<A extends Actions>(
  message: IMessage,
  actionResult: ActionResults[A],
): string {
  const template = templates.find(
    ({ action, status }) => action === message.action && status === actionResult.status,
  );
  const data = template.beforeApply ? template.beforeApply(actionResult) : actionResult.body;
  logger.info('apply template', {
    action: message.action,
    status: actionResult.status,
    lang: message.lang,
  });

  return compile(template.bundle[message.lang].join(EOL))(data);
}
