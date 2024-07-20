import { addMinutes, isWithinInterval, subMinutes } from 'date-fns';

export const compareDates = (date1: Date, date2: Date) => {
  const interval = {
    start: subMinutes(date1, 5),
    end: addMinutes(date1, 5),
  };

  const isWithin15Minutes = isWithinInterval(date2, interval);

  return isWithin15Minutes;
};
