import { changeFormat, changeUTC } from "@/services/dateRefactor";
import Event from "@/class/EventClass";
import { RewriteKeyValue } from "./ConvertSelectKeyValue";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

dayjs.extend(utc)
dayjs.extend(timezone)

const APICall = async (request, token, type='get', body, contentType) => {
  let response = await fetch(request, {
    method: type,
    ...(body && { body: JSON.stringify(body) }),
    headers: new Headers({
      'Authorization': `Bearer ${token}`,
      ...(contentType && { "Content-Type": contentType })
    })
  }).then((r) => { return r.json() });
  console.log(request);
  console.log(JSON.stringify(body));
  console.log(response);
  return response;
}

const getEvents = async (params) => {
  const { resource, start, end, session, accessToken, select } = params;

  const token = accessToken || session.accessToken;

  let request = `https://graph.microsoft.com/v1.0/users/${resource || session.user.email}/calendarView?startDateTime=${start}&endDateTime=${dayjs(end).add(1, "days").format("YYYY-MM-DD")}&select=subject,organizer,start,end&top=1000`;

  // let response = await fetch(request, {
  //   method: 'get',
  //   headers: new Headers({
  //     'Authorization': `Bearer ${accessToken || session.accessToken}`
  //   })
  // }).then((r) => { return r.json() });

  console.log("a");
  let response = await APICall(request, token);
  console.log("b");

  if (!response?.error){
    let data = response.value
    .sort((d1, d2)=> new Date(d2.start.dateTime) - new Date(d1.start.dateTime))
    .map(d =>(new Event(changeUTC(changeUTC(d.start.dateTime)), changeUTC(changeUTC(d.end.dateTime)), d.subject || "sujet privé", d.organizer?.emailAddress.address || "email privé")));
    // .map(d =>(new Event(dayjs(d.start.dateTime).toISOString(), dayjs(d.end.dateTime), d.subject || "sujet privé", d.organizer?.emailAddress.address || "email privé")));

    data = RewriteKeyValue(data, select);

    return data;
  }
  else {
    response = {
      error: {
        message: response.error
      }
    }
    return response;
  }
}

export const getEchangeEventsBusy = async(option) => {
  const request = 'https://graph.microsoft.com/v1.0/me/calendar/getSchedule';
  const token = option.accessToken || option.session.accessToken;
  let body = {
    "schedules": [option.resource],
    "startTime": {
      "dateTime": `${option.start}T00:00:00`,
      "timeZone": "America/Caracas"
    },
    "endTime": {
      "dateTime": `${option.end}T23:59:59`,
      "timeZone": "America/Caracas"
    },
    "availabilityViewInterval": 60
  }
  const response = await APICall(request, token, "POST", body, "application/json");
  // return { data: response };
  let data = response.value[0].scheduleItems.map(d => (
    {
      // debut: changeUTC(changeUTC(d.start.dateTime)),
      // fin: changeUTC(changeUTC(d.end.dateTime)),
      debut: changeUTC(d.start.dateTime.split(".")[0] + "Z"),
      fin: changeUTC(d.end.dateTime.split(".")[0] + "Z"),
      // debut: d.start.dateTime,
      // fin: d.end.dateTime,
      raison: d.status,
      email: option.resource,
    }
  ));
  return { data: data };
}

export const getExchangeEvents = async(params) => {

  const resultJSON = await getEvents(params);
  return { data: resultJSON };
}