export enum ACTION_STATUSES {
  STATUS_SUCCESS = 'success',
  STATUS_FAIL = 'fail',
  STATUS_NO_EVENT = 'no_event',
  STATUS_ALREADY_ADDED = 'already_added',
  STATUS_NO_PLAYER = 'no_player',
  STATUS_INVALID_DATE = 'invalid_date',
  STATUS_INVALID_DATE_PAST = 'invalid_date_past',
}

interface Event {
  readonly date: string;
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
  | ActionResult<ACTION_STATUSES.STATUS_INVALID_DATE>
  | ActionResult<ACTION_STATUSES.STATUS_INVALID_DATE_PAST>
  | ActionResult<ACTION_STATUSES.STATUS_SUCCESS, Event>;

export type ActionResultEventRemove =
  | ActionResult<ACTION_STATUSES.STATUS_NO_EVENT>
  | ActionResult<ACTION_STATUSES.STATUS_SUCCESS, Event>;

export type ActionResultEventInfo =
  | ActionResult<ACTION_STATUSES.STATUS_NO_EVENT>
  | ActionResult<ACTION_STATUSES.STATUS_SUCCESS, Event & MemberList>;

export type ActionResultMemberAdd =
  | ActionResult<ACTION_STATUSES.STATUS_NO_EVENT>
  | ActionResult<ACTION_STATUSES.STATUS_ALREADY_ADDED, Member>
  | ActionResult<ACTION_STATUSES.STATUS_SUCCESS, Member & MemberList>;

export type ActionResultMemberRemove =
  | ActionResult<ACTION_STATUSES.STATUS_NO_EVENT>
  | ActionResult<ACTION_STATUSES.STATUS_NO_PLAYER, Member>
  | ActionResult<ACTION_STATUSES.STATUS_SUCCESS, Member & MemberList>;
