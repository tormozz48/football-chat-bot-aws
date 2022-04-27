import { ActionResults, Actions, ActionStatuses } from '../../types';
import * as eventNotFound from '../shared/event-not-found';
import { LangBundle } from '../types';
import * as memberNotFound from './member-not-found';
import * as success from './success';

export const template: Record<ActionResults[Actions.memberRemove]['status'], LangBundle> = {
  [ActionStatuses.eventNotFound]: eventNotFound,
  [ActionStatuses.memberNotFound]: memberNotFound,
  [ActionStatuses.success]: success,
};
