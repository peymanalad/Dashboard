import momentJ, {Moment} from 'moment-jalaali';

export const getNowDateTime = (format: string = 'jYYYY/jMM/jDD HH:mm:ss') => momentJ().utc(true).format(format);

export const convertUtcTimeToLocal = (dateTime?: string, format: string = 'jYYYY/jMM/jDD HH:mm:ss') => {
  if (dateTime) return momentJ(dateTime).utc(false).local().format(format);
  return getNowDateTime(format);
};

export const convertTimeToLocalMoment = (dateTime: string): Moment | undefined => {
  if (dateTime === '') return momentJ();
  if (momentJ(dateTime).isValid()) return momentJ(dateTime).utc(true).local();
  return undefined;
};

export const convertTimeToUTC = (
  dateTime: Moment | string,
  format: string = 'YYYY-MM-DD HH:mm:ss',
  keepLocalTime: boolean = false,
  inputFormat: string | undefined = undefined
): string => {
  try {
    const newDateTime = momentJ(dateTime, inputFormat);
    return newDateTime.utc(keepLocalTime).format(format);
  } catch (e) {
    return '';
  }
};
