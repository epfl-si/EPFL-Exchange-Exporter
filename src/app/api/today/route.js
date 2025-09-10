import { NextResponse } from "next/server";
import dayjs from "dayjs";

const getEvent = (now) => {
  switch (now.month() + 1) {
    case 4:
      return { isEvent: true, name: "easter" };
    case 10:
      return { isEvent: true, name: "hlwn" };
    case 12:
      return { isEvent: true, name: "xmas" };
    default:
      return { isEvent: false };
  }
}

export async function GET(request) {

  const now = dayjs();

  const data = {
    iso: now,
    year: now.year(),
    month: now.month() + 1,
    day: now.date(),
    dayOfWeek: now.day(),
    hour: now.hour(),
    min: now.minute(),
    sec: now.second(),
    event: getEvent(now)
  }

  return NextResponse.json(data);
}