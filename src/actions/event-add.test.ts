import * as faker from 'faker';
import { Wrapped } from 'lambda-wrapper';
import * as path from 'path';
import { lambdaWrapper } from 'serverless-jest-plugin';
import { formatDate } from '../utils/date';
import { ActionResults, Actions, ActionStatuses, IMessage, Languages } from '../types';
import { eventAdd } from './event-add';

describe(`${path.relative(process.cwd(), __filename)}`, () => {
  let eventAddAction: Wrapped<IMessage, ActionResults[Actions.eventAdd]>;

  const createPayloadBaseParams = () => ({
    lang: Languages.en,
    action: Actions.eventAdd,
    memberName: faker.datatype.string(),
  });

  beforeAll(() => {
    eventAddAction = lambdaWrapper.wrap<IMessage, ActionResults[Actions.eventAdd]>({
      handler: eventAdd,
    });
  });

  it('success', async () => {
    const chatId = faker.datatype.number();
    const dateInMillis = faker.date.future().getTime();
    const date = formatDate(dateInMillis);

    const response = await eventAddAction.run({
      ...createPayloadBaseParams(),
      chatId,
      text: date,
      fullText: `/event_add ${date}`,
    });

    expect(response.status).toEqual(ActionStatuses.success);
    expect(response.body).toMatchObject({
      chatId,
      // eventDate: new Date(dateInMillis).ge.valueOf(),
      active: 1,
      members: [],
    });
  });

  describe('errors', () => {
    it(`status: ${ActionStatuses.eventInvalidDate}`, async () => {
      const chatId = faker.datatype.number();
      const date = 'Invalid Date';

      const response = await eventAddAction.run({
        ...createPayloadBaseParams(),
        chatId,
        text: date,
        fullText: `/event_add ${date}`,
      });

      expect(response.status).toEqual(ActionStatuses.eventInvalidDate);
      expect(response.body).toEqual({});
    });

    it(`status: ${ActionStatuses.eventInvalidDatePast}`, async () => {
      const chatId = faker.datatype.number();
      const date = formatDate(faker.date.past().getTime());

      const response = await eventAddAction.run({
        ...createPayloadBaseParams(),
        chatId,
        text: date,
        fullText: `/event_add ${date}`,
      });

      expect(response.status).toEqual(ActionStatuses.eventInvalidDatePast);
      expect(response.body).toEqual({});
    });

    it(`status: ${ActionStatuses.eventAlreadyExists}`, async () => {
      const chatId = faker.datatype.number();
      const date = formatDate(faker.date.future().getTime());

      const payload: IMessage = {
        ...createPayloadBaseParams(),
        chatId,
        text: date,
        fullText: `/event_add ${date}`,
      };

      const firstCallResponse = await eventAddAction.run(payload);
      expect(firstCallResponse.status).toEqual(ActionStatuses.success);

      const secondCallResponse = await eventAddAction.run(payload);
      expect(secondCallResponse.status).toEqual(ActionStatuses.eventAlreadyExists);
    });
  });
});
