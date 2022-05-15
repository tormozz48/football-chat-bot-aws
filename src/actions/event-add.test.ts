import * as faker from 'faker';
import { Wrapped } from 'lambda-wrapper';
import * as path from 'path';
import { lambdaWrapper } from 'serverless-jest-plugin';
import { ActionResults, Actions, ActionStatuses, IMessage, Languages } from '../types';
import { dateFormats, formatDate, parseDate } from '../utils/date';
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

  dateFormats.forEach((format) => {
    it(`should support "${format}" date format`, async () => {
      const chatId = faker.datatype.number();
      const dateInMillis = faker.date.future().getTime();
      const date = formatDate(dateInMillis, format);

      const response = await eventAddAction.run({
        ...createPayloadBaseParams(),
        chatId,
        text: date,
        fullText: `/event_add ${date}`,
      });

      expect(response.status).toEqual(ActionStatuses.success);
      expect(response.body).toMatchObject({
        chatId,
        active: 1,
        members: [],
      });
    });
  });

  // TODO  fix unstable test
  it.skip('create event for another date', async () => {
    const chatId = faker.datatype.number();
    const dateInMillis1 = faker.date.future().getTime();
    const date1 = formatDate(dateInMillis1);

    const dateInMillis2 = faker.date.future().getTime();
    const date2 = formatDate(dateInMillis2);

    const response1 = await eventAddAction.run({
      ...createPayloadBaseParams(),
      chatId,
      text: date1,
      fullText: `/event_add ${date1}`,
    });

    expect(response1.status).toEqual(ActionStatuses.success);
    expect(response1.body).toMatchObject({
      chatId,
      eventDate: parseDate(date1).toMillis(),
      active: 1,
      members: [],
    });

    const response2 = await eventAddAction.run({
      ...createPayloadBaseParams(),
      chatId,
      text: date2,
      fullText: `/event_add ${date2}`,
    });

    expect(response2.status).toEqual(ActionStatuses.success);
    expect(response2.body).toMatchObject({
      chatId,
      eventDate: parseDate(date2).toMillis(),
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
