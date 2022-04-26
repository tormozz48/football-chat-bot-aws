import { ActionResults, Actions, ActionStatuses } from '../../types';
import * as eventNotFound from '../shared/event-not-found';
import * as success from './success';

export const template: Record<ActionResults[Actions.eventInfo]['status'], LangBundle> = {
  [ActionStatuses.eventNotFound]: eventNotFound,
  [ActionStatuses.success]: success,
};
