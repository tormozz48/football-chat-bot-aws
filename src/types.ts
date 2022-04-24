import { Event } from './database/types';

export enum ACTION_STATUSES {
  SUCCESS = 'success',
  FAIL = 'fail',
  EVENT_ALREADY_EXISTS = 'event_already_exist',
  EVENT_INVALID_DATE = 'invalid_date',
  EVENT_INVALID_DATE_PAST = 'invalid_date_past',
  EVENT_NOT_FOUND = 'no_event',
  MEMBER_NOT_FOUND = 'no_player',
  MEMBER_ALREADY_ADDED = 'already_added',
}

type Member = { name: string };

type ActionResult<T = ACTION_STATUSES, U = {}> = { status: T; body: U };

export type ActionResultEventAdd =
  | ActionResult<ACTION_STATUSES.EVENT_INVALID_DATE>
  | ActionResult<ACTION_STATUSES.EVENT_INVALID_DATE_PAST>
  | ActionResult<ACTION_STATUSES.EVENT_ALREADY_EXISTS, Event>
  | ActionResult<ACTION_STATUSES.SUCCESS, Event>;

export type ActionResultEventRemove =
  | ActionResult<ACTION_STATUSES.EVENT_NOT_FOUND>
  | ActionResult<ACTION_STATUSES.SUCCESS, Event>;

export type ActionResultEventInfo =
  | ActionResult<ACTION_STATUSES.EVENT_NOT_FOUND>
  | ActionResult<ACTION_STATUSES.SUCCESS, Event>;

export type ActionResultMemberAdd =
  | ActionResult<ACTION_STATUSES.EVENT_NOT_FOUND>
  | ActionResult<ACTION_STATUSES.MEMBER_ALREADY_ADDED, Member & Event>
  | ActionResult<ACTION_STATUSES.SUCCESS, Member & Event>;

export type ActionResultMemberRemove =
  | ActionResult<ACTION_STATUSES.EVENT_NOT_FOUND>
  | ActionResult<ACTION_STATUSES.MEMBER_NOT_FOUND, Member & Event>
  | ActionResult<ACTION_STATUSES.SUCCESS, Member & Event>;

export interface IMessage {
  readonly chatId: number;
  readonly lang: string;
  readonly text: string;
  readonly fullText: string;
  readonly command: string;
  readonly memberName: string;
}
