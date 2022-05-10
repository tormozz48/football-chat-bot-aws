import { ActionResult, ActionResults, Actions, ActionStatuses, Member } from '../types';
import { Template } from './types';
import { Event } from '../database/types';

const memberNotFound: Template<Actions.memberRemove, ActionStatuses.memberNotFound> = {
  action: Actions.memberRemove,
  status: ActionStatuses.memberNotFound,
  bundle: {
    en: ['🚷 Member <strong>{{name}}</strong> was not found 🚷'],
    ru: ['🚷 Участник <strong>{{name}}</strong> не найден 🚷'],
  },
};

const success: Template<Actions.memberRemove, ActionStatuses.success> = {
  action: Actions.memberRemove,
  status: ActionStatuses.success,
  beforeApply: (data: ActionResults[Actions.memberRemove]) => {
    const { body } = data as ActionResults[Actions.memberRemove]['body'] as ActionResult<
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
      '❌ <strong>{{name}}</strong> canceled his participation ❌',
      '',
      'ℹ️ List of members:',
      '{{#each members}}',
      '{{index}}: <i>{{name}}</i>',
      '{{/each}}',
      '',
      'Total: <strong>{{total}}</strong>',
    ],
    ru: [
      '❌ <strong>{{name}}</strong> отменил свое участие в событии ❌',
      '',
      'ℹ️ Список участников:',
      '{{#each members}}',
      '{{index}}: <i>{{name}}</i>',
      '{{/each}}',
      '',
      'Итого: <strong>{{total}}</strong>',
    ],
  },
};

export const templates = [memberNotFound, success];
