import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc)
dayjs.extend(timezone)

export const changeUTC = (dateStr) => {
  // let date = new Date(dateStr);
  // return new Date(date.setUTCHours(date.getUTCHours() + utc));
  return dayjs(dateStr).tz('Europe/Zurich').format('YYYY-MM-DDTHH:mm:ss[Z]');
}

export const changeFormat = (date) =>{
  return date.toISOString();
}