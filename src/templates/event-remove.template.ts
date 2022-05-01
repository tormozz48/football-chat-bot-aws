import { ActionResult, ActionResults, Actions } from 'src/types';
import { formatDate } from 'src/utils/date';
import { ActionStatuses } from '../types';
import { Template } from './types';
import { Event } from '../database/types';

export const templates = [
  <Template<Actions.eventRemove, ActionStatuses.success>>{
    action: Actions.eventRemove,
    status: ActionStatuses.success,
    beforeApply: (data: ActionResults[Actions.eventRemove]) => {
      const { body } = data as ActionResults[Actions.eventRemove] as ActionResult<
        ActionStatuses.success,
        Event
      >;

      return {
        eventDate: formatDate(body.eventDate),
      };
    },
    bundle: {
      en: ['🚫 Event on <strong>{{eventDate}}</strong> has been canceled 🚫'],
      ru: ['🚫 Событие <strong>{{eventDate}}</strong> было отменено 🚫'],
    },
  },
];
