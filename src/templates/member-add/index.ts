import { ActionResults, Actions, ActionStatuses } from '../../types';
import * as eventNotFound from '../shared/event-not-found';
import * as memberAlreadyAdded from './member-already-added';
import * as success from './success';

export const template: Record<ActionResults[Actions.memberAdd]['status'], LangBundle> = {
  [ActionStatuses.eventNotFound]: eventNotFound,
  [ActionStatuses.memberAlreadyAdded]: memberAlreadyAdded,
  [ActionStatuses.success]: success,
};
