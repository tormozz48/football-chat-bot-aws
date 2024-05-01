import { faker } from '@faker-js/faker';
import { Wrapped } from 'lambda-wrapper';
import * as path from 'path';
import { lambdaWrapper } from 'serverless-jest-plugin';
import { formatDate } from '../utils/date';
import { ActionResults, Actions, ActionStatuses, IMessage, Languages } from '../types';
import { eventAdd } from './event-add';
import { memberAdd } from './member-add';

describe(`${path.relative(process.cwd(), __filename)}`, () => {
  let eventAddAction: Wrapped<IMessage, ActionResults[Actions.eventAdd]>;
  let memberAddAction: Wrapped<IMessage, ActionResults[Actions.memberAdd]>;

  const createPayloadBaseParams = () => ({
    lang: Languages.en,
    memberName: faker.datatype.string(),
  });

  const createEvent = async (chatId: number) => {
    const dateInMillis = faker.date.future().getTime();
    const date = formatDate(dateInMillis);

    await eventAddAction.run({
      ...createPayloadBaseParams(),
      chatId,
      text: date,
      action: Actions[Actions.eventAdd],
      fullText: `/event_add ${date}`,
    });
  };

  beforeAll(() => {
    eventAddAction = lambdaWrapper.wrap<IMessage, ActionResults[Actions.eventAdd]>({
      handler: eventAdd,
    });
    memberAddAction = lambdaWrapper.wrap<IMessage, ActionResults[Actions.memberAdd]>({
      handler: memberAdd,
    });
  });

  it('success', async () => {
    const chatId = faker.datatype.number();

    await createEvent(chatId);

    const memberName = faker.datatype.string();
    const response = await memberAddAction.run({
      ...createPayloadBaseParams(),
      chatId,
      text: '',
      action: Actions[Actions.memberAdd],
      fullText: `/add`,
      memberName,
    });

    expect(response.status).toEqual(ActionStatuses.success);
    expect(response.body).toMatchObject({
      chatId,
      members: [{ name: memberName }],
    });
  });

  it('append another person', async () => {
    const chatId = faker.datatype.number();

    await createEvent(chatId);

    const anotherPersonName = faker.datatype.string();
    const response = await memberAddAction.run({
      ...createPayloadBaseParams(),
      chatId,
      text: anotherPersonName,
      action: Actions[Actions.memberAdd],
      fullText: `/add ${anotherPersonName}`,
    });

    expect(response.status).toEqual(ActionStatuses.success);
    expect(response.body).toMatchObject({
      chatId,
      members: [{ name: anotherPersonName }],
    });
  });

  describe('errors', () => {
    it(`status: ${ActionStatuses.eventNotFound}`, async () => {
      const chatId = faker.datatype.number();

      const response = await memberAddAction.run({
        ...createPayloadBaseParams(),
        chatId,
        text: '',
        action: Actions.memberAdd,
        fullText: `/add`,
      });

      expect(response.status).toEqual(ActionStatuses.eventNotFound);
      expect(response.body).toEqual({});
    });

    it(`status: ${ActionStatuses.memberAlreadyAdded} (case #1)`, async () => {
      const chatId = faker.datatype.number();

      await createEvent(chatId);

      const memberName = faker.datatype.string();
      const message: IMessage = {
        ...createPayloadBaseParams(),
        chatId,
        text: '',
        action: Actions[Actions.memberAdd],
        fullText: `/add`,
        memberName,
      };
      const firstCallResponse = await memberAddAction.run(message);
      const secondCallResponse = await memberAddAction.run(message);

      expect(firstCallResponse.status).toEqual(ActionStatuses.success);
      expect(secondCallResponse.status).toEqual(ActionStatuses.memberAlreadyAdded);
      expect(secondCallResponse.body).toMatchObject({ name: memberName });
    });

    it(`status: ${ActionStatuses.memberAlreadyAdded} (case #2)`, async () => {
      const chatId = faker.datatype.number();

      await createEvent(chatId);

      const memberName = faker.datatype.string();
      const message: IMessage = {
        ...createPayloadBaseParams(),
        chatId,
        text: memberName,
        action: Actions[Actions.memberAdd],
        fullText: `/add ${memberName}`,
      };
      const firstCallResponse = await memberAddAction.run(message);
      const secondCallResponse = await memberAddAction.run(message);

      expect(firstCallResponse.status).toEqual(ActionStatuses.success);
      expect(secondCallResponse.status).toEqual(ActionStatuses.memberAlreadyAdded);
      expect(secondCallResponse.body).toMatchObject({ name: memberName });
    });
  });
});
