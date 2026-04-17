import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

export const toDateTime = (date, time) => dayjs.utc(`${dayjs(date).format("YYYY-MM-DD")}T${time}:00`).toDate();

export const overlap = (rangeAStart, rangeAEnd, rangeBStart, rangeBEnd) =>
  rangeAStart < rangeBEnd && rangeBStart < rangeAEnd;

export const eachDay = (start, end) => {
  const days = [];
  let cursor = dayjs(start).startOf("day");
  const finish = dayjs(end).startOf("day");

  while (cursor.isBefore(finish) || cursor.isSame(finish)) {
    days.push(cursor.toDate());
    cursor = cursor.add(1, "day");
  }

  return days;
};
