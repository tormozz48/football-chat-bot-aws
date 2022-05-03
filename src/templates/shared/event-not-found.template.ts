import { Actions, ActionStatuses } from '../../types';
import { Template } from '../types';

export const templates = [
  Actions.eventInfo,
  Actions.eventRemove,
  Actions.memberAdd,
  Actions.memberRemove,
].map(
  (action: Actions): Template<typeof action, ActionStatuses.eventNotFound> => ({
    action,
    status: ActionStatuses.eventNotFound,
    bundle: {
      en: ['🚫 No planned events were found 🚫'],
      ru: ['🚫 Нет назначенных событий 🚫'],
    },
  }),
);
