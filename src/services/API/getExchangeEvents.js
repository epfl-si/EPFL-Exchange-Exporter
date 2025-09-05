import { changeFormat, changeUTC } from "@/services/dateRefactor";
import Event from "@/class/EventClass";

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
  const { room, start, end, session, accessToken } = params;

  const token = accessToken || session.accessToken;

  let request = `https://graph.microsoft.com/v1.0/users/${room || session.user.email}/calendarView?startDateTime=${start}&endDateTime=${end}&select=subject,organizer,start,end&top=1000`;

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
    .map(d =>(new Event(changeFormat(changeUTC(d.start.dateTime, 1)), changeFormat(changeUTC(d.end.dateTime, 1)), d.subject || "sujet privé", d.organizer?.emailAddress.address || "email privé")));

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
    "schedules": [option.room],
    "startTime": {
      "dateTime": `${option.start}T00:00:00`,
      "timeZone": "W. Europe Standard Time"
    },
    "endTime": {
      "dateTime": `${option.end}T23:59:59`,
      "timeZone": "W. Europe Standard Time"
    },
    "availabilityViewInterval": 60
  }
  const response = await APICall(request, token, "POST", body, "application/json");
  // return { data: response };
  let data = response.value[0].scheduleItems.map(d => (
    {
      debut: d.start.dateTime,
      fin: d.end.dateTime,
      raison: d.status,
      email: option.room,
    }
  ));
  return { data: data };
}

export const getExchangeEvents = async(params) => {

  const resultJSON = await getEvents(params);
  return { data: resultJSON };
}