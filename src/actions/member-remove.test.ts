import * as faker from 'faker';
import { Wrapped } from 'lambda-wrapper';
import * as path from 'path';
import { lambdaWrapper } from 'serverless-jest-plugin';
import { ActionResults, Actions, ActionStatuses, IMessage, Languages } from '../types';
import { formatDate } from '../utils/date';
import { eventAdd } from './event-add';
import { eventInfo } from './event-info';
import { memberAdd } from './member-add';
import { memberRemove } from './member-remove';

describe(`${path.relative(process.cwd(), __filename)}`, () => {
  let eventAddAction: Wrapped<IMessage, ActionResults[Actions.eventAdd]>;
  let eventInfoAction: Wrapped<IMessage, ActionResults[Actions.eventInfo]>;
  let memberAddAction: Wrapped<IMessage, ActionResults[Actions.memberAdd]>;
  let memberRemoveAction: Wrapped<IMessage, ActionResults[Actions.memberRemove]>;

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
    eventInfoAction = lambdaWrapper.wrap<IMessage, ActionResults[Actions.eventInfo]>({
      handler: eventInfo,
    });
    memberAddAction = lambdaWrapper.wrap<IMessage, ActionResults[Actions.memberAdd]>({
      handler: memberAdd,
    });
    memberRemoveAction = lambdaWrapper.wrap<IMessage, ActionResults[Actions.memberRemove]>({
      handler: memberRemove,
    });
  });

  it('success', async () => {
    const chatId = faker.datatype.number();

    await createEvent(chatId);

    const memberName = faker.datatype.string();
    const payload = {
      ...createPayloadBaseParams(),
      chatId,
      text: '',
      memberName,
    };

    await memberAddAction.run({
      ...payload,
      action: Actions[Actions.memberAdd],
      fullText: `/add`,
    });

    const firstInfoCallResponse = await eventInfoAction.run({
      ...payload,
      action: Actions[Actions.eventInfo],
      fullText: `/event_info`,
    });

    expect(firstInfoCallResponse.body).toMatchObject({
      members: [{ name: memberName }],
    });

    const memberRemoveResponse = await memberRemoveAction.run({
      ...payload,
      action: Actions[Actions.memberRemove],
      fullText: `/remove`,
    });

    expect(memberRemoveResponse.status).toEqual(ActionStatuses.success);
    expect(memberRemoveResponse.body).toMatchObject({
      name: memberName,
    });

    const secondInfoCallResponse = await eventInfoAction.run({
      ...payload,
      action: Actions[Actions.eventInfo],
      fullText: `/event_info`,
    });

    expect(secondInfoCallResponse.body).toMatchObject({
      members: [],
    });
  });

  describe('errors', () => {
    it(`status: ${ActionStatuses.eventNotFound}`, async () => {
      const chatId = faker.datatype.number();

      const response = await memberAddAction.run({
        ...createPayloadBaseParams(),
        chatId,
        text: '',
        action: Actions.memberRemove,
        fullText: `/remove`,
      });

      expect(response.status).toEqual(ActionStatuses.eventNotFound);
      expect(response.body).toEqual({});
    });
  });

  it(`status: ${ActionStatuses.memberNotFound} (case #1)`, async () => {
    const chatId = faker.datatype.number();

    await createEvent(chatId);

    const memberName = faker.datatype.string();
    const payload = {
      ...createPayloadBaseParams(),
      chatId,
      text: '',
      memberName,
    };

    const firstInfoCallResponse = await eventInfoAction.run({
      ...payload,
      action: Actions[Actions.eventInfo],
      fullText: `/event_info`,
    });

    expect(firstInfoCallResponse.body).toMatchObject({
      members: [],
    });

    const memberRemoveResponse = await memberRemoveAction.run({
      ...payload,
      action: Actions[Actions.memberRemove],
      fullText: `/remove`,
    });

    expect(memberRemoveResponse.status).toEqual(ActionStatuses.memberNotFound);
    expect(memberRemoveResponse.body).toMatchObject({
      name: memberName,
    });
  });

  it(`status: ${ActionStatuses.memberNotFound} (case #2)`, async () => {
    const chatId = faker.datatype.number();

    await createEvent(chatId);

    const memberName = faker.datatype.string();
    const payload = {
      ...createPayloadBaseParams(),
      chatId,
      text: '',
      memberName,
    };

    await memberAddAction.run({
      ...payload,
      action: Actions[Actions.memberAdd],
      fullText: `/add`,
    });

    const firstInfoCallResponse = await eventInfoAction.run({
      ...payload,
      action: Actions[Actions.eventInfo],
      fullText: `/event_info`,
    });

    expect(firstInfoCallResponse.body).toMatchObject({
      members: [{ name: memberName }],
    });

    const missedMember = faker.datatype.string();
    const memberRemoveResponse = await memberRemoveAction.run({
      ...payload,
      action: Actions[Actions.memberRemove],
      text: missedMember,
      fullText: `/remove ${missedMember}`,
    });

    expect(memberRemoveResponse.status).toEqual(ActionStatuses.memberNotFound);
    expect(memberRemoveResponse.body).toMatchObject({
      name: missedMember,
    });

    const secondInfoCallResponse = await eventInfoAction.run({
      ...payload,
      action: Actions[Actions.eventInfo],
      fullText: `/event_info`,
    });

    expect(secondInfoCallResponse.body).toMatchObject({
      members: [{ name: memberName }],
    });
  });
});
