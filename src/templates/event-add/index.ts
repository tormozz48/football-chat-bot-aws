import { ActionResults, Actions, ActionStatuses } from '../../types';
import * as eventAlreadyExists from './event-already-exists';
import * as eventInvalidDate from './event-invalid-date';
import * as eventInvalidDatePast from './event-invalid-date-past';
import * as success from './success';

export const template: Record<ActionResults[Actions.eventAdd]['status'], LangBundle> = {
  [ActionStatuses.eventInvalidDate]: eventInvalidDate,
  [ActionStatuses.eventInvalidDatePast]: eventInvalidDatePast,
  [ActionStatuses.eventAlreadyExists]: eventAlreadyExists,
  [ActionStatuses.success]: success,
};
