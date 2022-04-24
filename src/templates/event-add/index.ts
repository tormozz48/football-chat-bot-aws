import { ActionResultEventAdd, ACTION_STATUSES } from '../../types';
import * as eventAlreadyExists from './event-already-exists';
import * as eventInvalidDate from './event-invalid-date';
import * as eventInvalidDatePast from './event-invalid-date-past';
import * as success from './success';

export const template: Record<ActionResultEventAdd['status'], LangBundle> = {
  [ACTION_STATUSES.EVENT_INVALID_DATE]: eventInvalidDate,
  [ACTION_STATUSES.EVENT_INVALID_DATE_PAST]: eventInvalidDatePast,
  [ACTION_STATUSES.EVENT_ALREADY_EXISTS]: eventAlreadyExists,
  [ACTION_STATUSES.SUCCESS]: success,
};
