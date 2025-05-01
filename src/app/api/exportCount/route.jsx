import { NextResponse } from "next/server";
import { auth, signIn } from "@/auth";

import checkMissingArgs from "@/services/checkMissingArgs";

export async function GET(request) {

  const session = await auth();

  const headersReq = request.nextUrl.searchParams;

  const missingArgs = checkMissingArgs(headersReq, ["room", "start", "end"]);
  if (missingArgs.state == "error") {
    return NextResponse.json(missingArgs.value);
  }

  const room = headersReq.get("room");
  const start = headersReq.get("start");
  const end = headersReq.get("end");

  const startDate = start ? new Date(new Date(start).setHours(1)).toISOString() : new Date(new Date(new Date(Date.now()).setDate(0)).setHours(1)).toISOString();
  const endDate = end ? new Date(new Date(end).setHours(23)).toISOString() : new Date(new Date(new Date(Date.now()).setDate(27)).setHours(1)).toISOString();

  let result = await fetch(`https://graph.microsoft.com/v1.0/users/${room || session.user.email}/calendarView?startDateTime=${startDate}&endDateTime=${endDate}&count=true&top=1&select=id`, {
      method: 'get',
      headers: new Headers({
          'Authorization': `Bearer ${session.accessToken}`
      })
  }).then((r) => { return r.json() });

  const resultJSON = !result.error ?
    {
      count: result["@odata.count"]
    }
  :
    {
      error: result.error
    }

  return NextResponse.json(resultJSON);
}