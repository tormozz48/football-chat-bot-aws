import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const ALLOWED_DATE_FORMATS = ['DD-MM-YYYY HH:mm'];
const REFERENCE_DATE_FORMAT = ALLOWED_DATE_FORMATS[0];

export const parseDate = (dateStr: string): dayjs.Dayjs => {
  return dayjs(dateStr, ALLOWED_DATE_FORMATS, true).utc();
};

export const isDateInPast = (date: dayjs.Dayjs): boolean => {
  return date.isBefore(dayjs().utc());
};

export const formatDate = (date: dayjs.Dayjs | number): string => {
  return dayjs(date).utc().format(REFERENCE_DATE_FORMAT);
};
