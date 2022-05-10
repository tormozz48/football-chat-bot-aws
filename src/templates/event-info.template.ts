import { Event } from '../database/types';
import { ActionResult, ActionResults, Actions, ActionStatuses } from '../types';
import { formatDate } from '../utils/date';
import { Template } from './types';

export const templates = [
  <Template<Actions.eventInfo, ActionStatuses.success>>{
    action: Actions.eventInfo,
    status: ActionStatuses.success,
    beforeApply: (data: ActionResults[Actions.eventInfo]) => {
      const { body } = data as ActionResults[Actions.eventInfo] as ActionResult<
        ActionStatuses.success,
        Event
      >;

      return {
        eventDate: formatDate(body.eventDate),
        members: body.members.map(({ name }, index) => ({ index: index + 1, name })),
        total: body.members.length,
      };
    },
    bundle: {
      en: [
        '⚽️🗓 Event Info <i>Date: {{eventDate}}</i>',
        '',
        'ℹ️ List of members:',
        '{{#each members}}',
        '{{index}}: <i>{{name}}</i>',
        '{{/each}}',
        '',
        'Total: <strong>{{total}}</strong>',
      ],
      ru: [
        '🗓 Информация о событии <i>Дата: {{eventDate}}</i>',
        '',
        'ℹ️ Список участников:',
        '{{#each members}}',
        '{{index}}: <i>{{name}}</i>',
        '{{/each}}',
        '',
        'Итого: <strong>{{total}}</strong>',
      ],
    },
  },
];
