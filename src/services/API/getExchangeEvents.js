import { changeFormat, changeUTC } from "@/services/dateRefactor";
import Event from "@/class/EventClass";

const getEvents = async (params) => {
  const { room, start, end, session, accessToken } = params;

  let request = `https://graph.microsoft.com/v1.0/users/${room || session.user.email}/calendarView?startDateTime=${start}&endDateTime=${end}&select=subject,organizer,start,end&top=1000`;

  let response = await fetch(request, {
    method: 'get',
    headers: new Headers({
      'Authorization': `Bearer ${accessToken || session.accessToken}`
    })
  }).then((r) => {return r.json()});

  if (!response?.error){
    let data = response.value
    .sort((d1, d2)=> new Date(d2.start.dateTime) - new Date(d1.start.dateTime))
    .map(d =>(new Event(changeFormat(changeUTC(d.start.dateTime, 1)), changeFormat(changeUTC(d.end.dateTime, 1)), d.subject || "sujet privé", d.organizer?.emailAddress.address || "email privé")));

    return data;
  }
  else{
    return response.error.message;
  }
}

export default async(params) => {

  const resultJSON = await getEvents(params);
  return { data: resultJSON };
}