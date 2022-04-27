import { ActionResults, Actions, ActionStatuses } from '../../types';
import * as eventNotFound from '../shared/event-not-found';
import { LangBundle } from '../types';
import * as success from './success';

export const template: Record<ActionResults[Actions.eventRemove]['status'], LangBundle> = {
  [ActionStatuses.eventNotFound]: eventNotFound,
  [ActionStatuses.success]: success,
};
