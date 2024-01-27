import { ActionResult, ActionResults, Actions, ActionStatuses, Member } from '../types';
import { Template } from './types';
import { Event } from '../database/types';

const memberAlreadyAdded: Template<Actions.memberAdd, ActionStatuses.memberAlreadyAdded> = {
  action: Actions.memberAdd,
  status: ActionStatuses.memberAlreadyAdded,
  bundle: {
    en: ['🚷 Member <strong>{{name}}</strong> has been already invited 🚷'],
    ru: ['🚷 Участник <strong>{{name}}</strong> уже есть в списке 🚷'],
  },
};

const success: Template<Actions.memberAdd, ActionStatuses.success> = {
  action: Actions.memberAdd,
  status: ActionStatuses.success,
  beforeApply: (data: ActionResults[Actions.memberAdd]) => {
    const { body } = data as ActionResults[Actions.memberAdd]['body'] as ActionResult<
      ActionStatuses.success,
      Event & Member
    >;

    return {
      name: body.name,
      eventDate: body.eventDate,
      members: body.members.map(({ name }, index) => ({ index: index + 1, name })),
      total: body.members.length,
    };
  },
  bundle: {
    en: [
      '✅ <strong>{{name}}</strong> will take part in event ✅',
      '🗓 <i>{{eventDate}}</i>',
      'ℹ️ List of members:',
      '{{#each members}}',
      '{{index}}: <i>{{name}}</i>',
      '{{/each}}',
      '',
      'Total: <strong>{{total}}</strong>',
    ],
    ru: [
      '✅ <strong>{{name}}</strong> примет участие в событии ✅',
      '🗓 <i>{{eventDate}}</i>',
      'ℹ️ Список участников:',
      '{{#each members}}',
      '{{index}}: <i>{{name}}</i>',
      '{{/each}}',
      '',
      'Итого: <strong>{{total}}</strong>',
    ],
  },
};

export const templates = [memberAlreadyAdded, success];
