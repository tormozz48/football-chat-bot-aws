import { DateTime } from 'luxon';

export const dateFormats = [
  'dd-MM-yyyy HH:mm',
  'yyyy-MM-dd HH:mm',
  'dd/MM/yyyy HH:mm',
  'yyyy/MM/dd HH:mm',
];

/**
 * Parse given date string
 * @export
 * @param  {string} dateStr
 * @return DateTime
 */
export function parseDate(dateStr: string, index: number = 0): DateTime {
  const parsedDate = DateTime.fromFormat(dateStr, dateFormats[index]).toUTC();
  return !parsedDate.isValid && index < dateFormats.length - 1
    ? parseDate(dateStr, ++index)
    : parsedDate;
}

/**
 * Returns true if given date less then current date. Otherwise returns false
 * @export
 * @param  {DateTime} date
 * @return boolean
 */
export function isDateInPast(date: DateTime): boolean {
  return date.toMillis() < DateTime.utc().toMillis();
}

/**
 * Returns formatted date string
 * @export
 * @param  {(DateTime | number)} date
 * @return string
 */
export function formatDate(date: DateTime | number, format = dateFormats[0]): string {
  date = date instanceof DateTime ? date : DateTime.fromMillis(date);
  return date.toFormat(format);
}
