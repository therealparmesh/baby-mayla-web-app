import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

const roundDownToQuarterHour = (d) =>
  dayjs(d)
    .minute(Math.floor(dayjs(d).minute() / 15) * 15)
    .second(0);

export { dayjs, roundDownToQuarterHour };
