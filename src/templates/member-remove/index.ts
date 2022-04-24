import { ActionResultMemberRemove, ACTION_STATUSES } from '../../types';
import * as eventNotFound from '../shared/event-not-found';
import * as memberNotFound from './member-not-found';
import * as success from './success';

export const template: Record<ActionResultMemberRemove['status'], LangBundle> = {
  [ACTION_STATUSES.EVENT_NOT_FOUND]: eventNotFound,
  [ACTION_STATUSES.MEMBER_NOT_FOUND]: memberNotFound,
  [ACTION_STATUSES.SUCCESS]: success,
};
