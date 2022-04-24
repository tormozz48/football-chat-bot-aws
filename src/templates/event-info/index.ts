import { ActionResultEventInfo, ACTION_STATUSES } from '../../types';
import * as eventNotFound from '../shared/event-not-found';
import * as success from './success';

export const template: Record<ActionResultEventInfo['status'], LangBundle> = {
  [ACTION_STATUSES.EVENT_NOT_FOUND]: eventNotFound,
  [ACTION_STATUSES.SUCCESS]: success,
};
