import { DateTime } from 'luxon';

const dateFormat = 'dd-MM-yyyy HH:mm';

/**
 * Parse given date string
 * @export
 * @param  {string} dateStr
 * @return DateTime
 */
export function parseDate(dateStr: string): DateTime {
  return DateTime.fromFormat(dateStr, dateFormat).toUTC();
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
export function formatDate(date: DateTime | number): string {
  date = date instanceof DateTime ? date : DateTime.fromMillis(date);
  return date.toFormat(dateFormat);
}
