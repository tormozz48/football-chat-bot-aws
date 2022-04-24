export enum ACTION_STATUSES {
  SUCCESS = 'success',
  FAIL = 'fail',
  EVENT_ALREADY_EXISTS = 'event_already_exist',
  EVENT_INVALID_DATE = 'invalid_date',
  EVENT_INVALID_DATE_PAST = 'invalid_date_past',
  MEMBER_NO_EVENT = 'no_event',
  MEMBER_NO_PLAYER = 'no_player',
  MEMBER_ALREADY_ADDED = 'already_added',
}

interface Event {
  readonly date: number;
}

interface Member {
  readonly name: string;
}

interface MemberListItem {
  readonly name: string;
  readonly index: number;
}

interface MemberList {
  readonly total: number;
  readonly members: MemberListItem[];
}

type ActionResult<T = ACTION_STATUSES, U = {}> = { status: T; body: U };

export type ActionResultEventAdd =
  | ActionResult<ACTION_STATUSES.EVENT_INVALID_DATE>
  | ActionResult<ACTION_STATUSES.EVENT_INVALID_DATE_PAST>
  | ActionResult<ACTION_STATUSES.EVENT_ALREADY_EXISTS, Event>
  | ActionResult<ACTION_STATUSES.SUCCESS, Event>;

export type ActionResultEventRemove =
  | ActionResult<ACTION_STATUSES.MEMBER_NO_EVENT>
  | ActionResult<ACTION_STATUSES.SUCCESS, Event>;

export type ActionResultEventInfo =
  | ActionResult<ACTION_STATUSES.MEMBER_NO_EVENT>
  | ActionResult<ACTION_STATUSES.SUCCESS, Event & MemberList>;

export type ActionResultMemberAdd =
  | ActionResult<ACTION_STATUSES.MEMBER_NO_EVENT>
  | ActionResult<ACTION_STATUSES.MEMBER_ALREADY_ADDED, Member>
  | ActionResult<ACTION_STATUSES.SUCCESS, Member & MemberList>;

export type ActionResultMemberRemove =
  | ActionResult<ACTION_STATUSES.MEMBER_NO_EVENT>
  | ActionResult<ACTION_STATUSES.MEMBER_NO_PLAYER, Member>
  | ActionResult<ACTION_STATUSES.SUCCESS, Member & MemberList>;
