import { faker } from '@faker-js/faker';
import { Wrapped } from 'lambda-wrapper';
import * as path from 'path';
import { lambdaWrapper } from 'serverless-jest-plugin';
import { formatDate } from '../utils/date';
import { ActionResults, Actions, ActionStatuses, IMessage, Languages } from '../types';
import { eventAdd } from './event-add';
import { eventInfo } from './event-info';

describe(`${path.relative(process.cwd(), __filename)}`, () => {
  let eventAddAction: Wrapped<IMessage, ActionResults[Actions.eventAdd]>;
  let eventInfoAction: Wrapped<IMessage, ActionResults[Actions.eventInfo]>;

  const createPayloadBaseParams = () => ({
    lang: Languages.en,
    memberName: faker.datatype.string(),
  });

  beforeAll(() => {
    eventAddAction = lambdaWrapper.wrap<IMessage, ActionResults[Actions.eventAdd]>({
      handler: eventAdd,
    });
    eventInfoAction = lambdaWrapper.wrap<IMessage, ActionResults[Actions.eventInfo]>({
      handler: eventInfo,
    });
  });

  it('success', async () => {
    const chatId = faker.datatype.number();
    const dateInMillis = faker.date.future().getTime();
    const date = formatDate(dateInMillis);

    await eventAddAction.run({
      ...createPayloadBaseParams(),
      chatId,
      text: date,
      action: Actions[Actions.eventAdd],
      fullText: `/event_add ${date}`,
    });

    const response = await eventInfoAction.run({
      ...createPayloadBaseParams(),
      chatId,
      text: '',
      action: Actions[Actions.eventInfo],
      fullText: `/event_info`,
    });

    expect(response.status).toEqual(ActionStatuses.success);
    expect(response.body).toMatchObject({
      chatId,
      members: [],
    });
  });

  describe('errors', () => {
    it(`status: ${ActionStatuses.eventNotFound}`, async () => {
      const chatId = faker.datatype.number();

      const response = await eventInfoAction.run({
        ...createPayloadBaseParams(),
        chatId,
        text: '',
        action: Actions.eventInfo,
        fullText: `/event_info`,
      });

      expect(response.status).toEqual(ActionStatuses.eventNotFound);
      expect(response.body).toEqual({});
    });
  });
});
