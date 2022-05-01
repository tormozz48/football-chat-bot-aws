import { Actions, ActionStatuses } from 'src/types';
import { Template } from '../types';

export const templates = [
  Actions.eventAdd,
  Actions.eventInfo,
  Actions.eventRemove,
  Actions.memberAdd,
  Actions.memberRemove,
].map(
  (action: Actions): Template<typeof action, ActionStatuses.fail> => ({
    action,
    status: ActionStatuses.fail,
    bundle: {
      en: ['❗️ Error: {{message}}'],
      ru: ['❗️ Ошибка: {{message}}'],
    },
  }),
);
