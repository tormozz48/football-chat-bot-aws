import { ActionResult, ActionResults, Actions, ActionStatuses } from '../types';
import { formatDate } from '../utils/date';
import { Template } from './types';
import { Event } from '../database/types';

const eventInvalidDate: Template<Actions.eventAdd, ActionStatuses.eventInvalidDate> = {
  action: Actions.eventAdd,
  status: ActionStatuses.eventInvalidDate,
  bundle: {
    en: [
      '<strong>Invalid date format</strong>❗️',
      '',
      '🕰 Allowed date examples:',
      '  <i>22-04-2022 09:30</i>',
      '  <i>22/04/2022 09:30</i>',
      '  <i>2022-04-22 09:30</i>',
      '  <i>2022/04/22 09:30</i>',
    ],
    ru: [
      '❗️<strong>Неправильный формат даты</strong>❗️',
      '',
      '🕰 Допустимые форматы:',
      '  <i>22-04-2022 09:30</i>',
      '  <i>22/04/2022 09:30</i>',
      '  <i>2022-04-22 09:30</i>',
      '  <i>2022/04/22 09:30</i>',
    ],
  },
};

const eventInvalidDatePast: Template<Actions.eventAdd, ActionStatuses.eventInvalidDatePast> = {
  action: Actions.eventAdd,
  status: ActionStatuses.eventInvalidDatePast,
  bundle: {
    en: ['❗️<strong>Invalid date</strong>❗️', '', '🕰 Event date must be in future'],
    ru: ['❗️<strong>Неправильная дата</strong>❗️', '', '🕰 Дата события должна быть в будущем'],
  },
};

const eventAlreadyExists: Template<Actions.eventAdd, ActionStatuses.eventAlreadyExists> = {
  action: Actions.eventAdd,
  status: ActionStatuses.eventAlreadyExists,
  bundle: {
    en: [
      '❗️<strong>Event with same date already exists</strong>❗️',
      '',
      'Select another date or remove existed event',
    ],
    ru: [
      '❗️<strong>Событие с указанной датой уже существует</strong>❗️',
      '',
      'Выберите другую дату или удалите существующее событие',
    ],
  },
};

const success: Template<Actions.eventAdd, ActionStatuses.success> = {
  action: Actions.eventAdd,
  status: ActionStatuses.success,
  beforeApply: (data: ActionResults[Actions.eventAdd]) => {
    const { body } = data as ActionResults[Actions.eventAdd] as ActionResult<
      ActionStatuses.success,
      Event
    >;

    return {
      eventDate: formatDate(body.eventDate),
    };
  },
  bundle: {
    en: [
      '🛎<strong>New Event is coming</strong>🛎',
      '',
      '🗓 <i>Date: {{eventDate}}</i>',
      '',
      '1️⃣ Apply to upcoming event: <strong>/add</strong>',
      '2️⃣ Invite member: <strong>/add username</strong>',
      '3️⃣ Cancel your invitation request: <strong>/remove</strong>',
      '4️⃣ View information about upcoming event: <strong>/info</strong>',
    ],
    ru: [
      '🛎<strong>Новое событие</strong>🛎',
      '',
      '🗓 <i>Дата: {{eventDate}}</i>',
      '',
      '1️⃣ Принять участие: <strong>/add</strong>',
      '2️⃣ Пригласить другого: <strong>/add username</strong>',
      '3️⃣ Отменить свою заявку на участие: <strong>/remove</strong>',
      '4️⃣ Посмотреть список участников: <strong>/info</strong>',
    ],
  },
};

export const templates = [eventInvalidDate, eventInvalidDatePast, eventAlreadyExists, success];
