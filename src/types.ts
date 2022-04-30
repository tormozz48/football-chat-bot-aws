import { Event } from './database/types';

export enum Languages {
  en = 'en',
  ru = 'ru',
}

export enum Actions {
  eventAdd = 'event_add',
  eventRemove = 'event_remove',
  eventInfo = 'info',
  memberAdd = 'add',
  memberRemove = 'remove',
}

export enum ActionStatuses {
  success = 'success',
  fail = 'fail',
  eventAlreadyExists = 'event_already_exist',
  eventInvalidDate = 'invalid_date',
  eventInvalidDatePast = 'invalid_date_past',
  eventNotFound = 'no_event',
  memberNotFound = 'no_player',
  memberAlreadyAdded = 'already_added',
}

type Member = { name: string };

export type ActionResult<T = ActionStatuses, U = {}> = { status: T; body: U };

export type ActionResults = {
  [Actions.eventAdd]:
    | ActionResult<ActionStatuses.fail>
    | ActionResult<ActionStatuses.eventInvalidDate>
    | ActionResult<ActionStatuses.eventInvalidDatePast>
    | ActionResult<ActionStatuses.eventAlreadyExists, Event>
    | ActionResult<ActionStatuses.success, Event>;
  [Actions.eventInfo]:
    | ActionResult<ActionStatuses.fail>
    | ActionResult<ActionStatuses.eventNotFound>
    | ActionResult<ActionStatuses.success, Event>;
  [Actions.eventRemove]:
    | ActionResult<ActionStatuses.fail>
    | ActionResult<ActionStatuses.eventNotFound>
    | ActionResult<ActionStatuses.success, Event>;
  [Actions.memberAdd]:
    | ActionResult<ActionStatuses.fail>
    | ActionResult<ActionStatuses.eventNotFound>
    | ActionResult<ActionStatuses.memberAlreadyAdded, Member & Event>
    | ActionResult<ActionStatuses.success, Member & Event>;
  [Actions.memberRemove]:
    | ActionResult<ActionStatuses.fail>
    | ActionResult<ActionStatuses.eventNotFound>
    | ActionResult<ActionStatuses.memberNotFound, Member & Event>
    | ActionResult<ActionStatuses.success, Member & Event>;
};

export interface IMessage {
  readonly chatId: number;
  readonly lang: Languages;
  readonly text: string;
  readonly fullText: string;
  readonly action: Actions;
  readonly memberName: string;
}
