import { Actions } from 'src/types';
import { ActionStatuses } from '../types';
import { Template } from './types';

export const templates = [
  <Template<Actions.eventRemove, ActionStatuses.success>>{
    action: Actions.eventRemove,
    status: ActionStatuses.success,
    bundle: {
      en: ['🚫 Event on <strong>{{eventDate}}</strong> has been canceled 🚫'],
      ru: ['🚫 Событие <strong>{{eventDate}}</strong> было отменено 🚫'],
    },
  },
];
