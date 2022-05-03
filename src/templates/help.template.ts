import { Actions, ActionStatuses } from '../types';
import { Template } from './types';

export const templates = [
  <Template<Actions.help, ActionStatuses.success>>{
    action: Actions.help,
    status: ActionStatuses.success,
    bundle: {
      en: [
        '🤖 Hi! I am a robot who helps you to organize your event 🤖',
        'Commands: ',
        '1️⃣ Apply to upcoming event: <strong>/add</strong>',
        '2️⃣ Invite member: <strong>/add username</strong>',
        '3️⃣ Cancel your invitation request: <strong>/remove</strong>',
        '4️⃣ View information about upcoming event: <strong>/info</strong>',
        '5️⃣ Create new event: <strong>/event_add</strong>',
        '6️⃣ Cancel existed event: <strong>/event_remove</strong>',
      ],
      ru: [
        '🤖 Привет! Я помогу организовать твое событие 🤖',
        'Commands: ',
        '1️⃣ Принять участие: <strong>/add</strong>',
        '2️⃣ Пригласить другого: <strong>/add username</strong>',
        '3️⃣ Отменить свою заявку на участие: <strong>/remove</strong>',
        '4️⃣ Посмотреть список участников: <strong>/info</strong>',
        '5️⃣ Создать новое событие: <strong>/event_add</strong>',
        '6️⃣ Отменить событие: <strong>/event_remove</strong>',
      ],
    },
  },
];
