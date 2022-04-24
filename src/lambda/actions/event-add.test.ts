import * as path from 'path';
import { eventAdd } from './event-add';
import { lambdaWrapper } from 'serverless-jest-plugin';
import { ActionResultEventAdd } from '../../types';
import { IMessage } from '../../types';
import { Wrapped } from 'lambda-wrapper';

describe(`${path.relative(process.cwd(), __filename)}`, () => {
  let wrapped: Wrapped<IMessage, ActionResultEventAdd>;

  beforeAll(() => {
    wrapped = lambdaWrapper.wrap<IMessage, ActionResultEventAdd>({ handler: eventAdd });
  });

  it('success', async () => {
    const response = await wrapped.run({
      chatId: 1,
      lang: 'en',
      text: '23-04-2022 00:00',
      fullText: '/event_add 23-04-2022 00:00',
      command: 'event_add',
      memberName: '',
    });

    console.log(response);
  });
});
