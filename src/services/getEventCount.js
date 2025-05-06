export default async(data) => {
  const { room, start, end, session, accessToken } = data;

  const startDate = start ? new Date(new Date(start).setHours(1)).toISOString() : new Date(new Date(new Date(Date.now()).setDate(0)).setHours(1)).toISOString();
  const endDate = end ? new Date(new Date(end).setHours(23)).toISOString() : new Date(new Date(new Date(Date.now()).setDate(27)).setHours(1)).toISOString();

  let result = await fetch(`https://graph.microsoft.com/v1.0/users/${room || session.user.email}/calendarView?startDateTime=${startDate}&endDateTime=${endDate}&count=true&top=1&select=id`, {
      method: 'get',
      headers: new Headers({
          'Authorization': `Bearer ${accessToken || session.accessToken}`
      })
  }).then((r) => { return r.json() });
  console.log(result)
  return !result.error ?
    {
      count: result["@odata.count"]
    }
  :
    result
}