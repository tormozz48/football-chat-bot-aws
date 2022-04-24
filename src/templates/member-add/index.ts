import { ActionResultMemberAdd, ACTION_STATUSES } from '../../types';
import * as eventNotFound from '../shared/event-not-found';
import * as memberAlreadyAdded from './member-already-added';
import * as success from './success';

export const template: Record<ActionResultMemberAdd['status'], LangBundle> = {
  [ACTION_STATUSES.EVENT_NOT_FOUND]: eventNotFound,
  [ACTION_STATUSES.MEMBER_ALREADY_ADDED]: memberAlreadyAdded,
  [ACTION_STATUSES.SUCCESS]: success,
};
