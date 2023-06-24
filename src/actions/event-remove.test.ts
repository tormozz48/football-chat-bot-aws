import * as faker from 'faker';
import { Wrapped } from 'lambda-wrapper';
import * as path from 'path';
import { lambdaWrapper } from 'serverless-jest-plugin';
import { formatDate } from '../utils/date';
import { ActionResults, Actions, ActionStatuses, IMessage, Languages } from '../types';
import { eventAdd } from './event-add';
import { eventRemove } from './event-remove';
import { getEvents } from '../database/repository';

describe(`${path.relative(process.cwd(), __filename)}`, () => {
  let eventAddAction: Wrapped<IMessage, ActionResults[Actions.eventAdd]>;
  let eventRemoveAction: Wrapped<IMessage, ActionResults[Actions.eventRemove]>;

  const createPayloadBaseParams = () => ({
    lang: Languages.en,
    memberName: faker.datatype.string(),
  });

  beforeAll(() => {
    eventAddAction = lambdaWrapper.wrap<IMessage, ActionResults[Actions.eventAdd]>({
      handler: eventAdd,
    });
    eventRemoveAction = lambdaWrapper.wrap<IMessage, ActionResults[Actions.eventRemove]>({
      handler: eventRemove,
    });
  });

  it('success', async () => {
    const chatId = faker.datatype.number();
    const dateInMillis = faker.date.future().getTime();
    const date = formatDate(dateInMillis);

    const eventsBefore = await getEvents({ chatId });
    expect(eventsBefore).toHaveLength(0);

    await eventAddAction.run({
      ...createPayloadBaseParams(),
      chatId,
      text: date,
      action: Actions[Actions.eventAdd],
      fullText: `/event_add ${date}`,
    });

    const eventsAfterCreation = await getEvents({ chatId });
    expect(eventsAfterCreation).toHaveLength(1);

    const response = await eventRemoveAction.run({
      ...createPayloadBaseParams(),
      chatId,
      text: '',
      action: Actions[Actions.eventRemove],
      fullText: `/event_remove`,
    });

    expect(response.status).toEqual(ActionStatuses.success);
    expect(response.body).toMatchObject({
      chatId,
      members: [],
    });

    const eventsAfterRemoval = await getEvents({ chatId });
    expect(eventsAfterRemoval).toHaveLength(0);
  });

  describe('errors', () => {
    it(`status: ${ActionStatuses.eventNotFound}`, async () => {
      const chatId = faker.datatype.number();

      const response = await eventRemoveAction.run({
        ...createPayloadBaseParams(),
        chatId,
        text: '',
        action: Actions[Actions.eventRemove],
        fullText: `/event_remove`,
      });

      expect(response.status).toEqual(ActionStatuses.eventNotFound);
      expect(response.body).toEqual({});
    });
  });
});
