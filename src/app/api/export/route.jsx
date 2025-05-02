import { NextResponse } from "next/server";
import { auth } from "@/auth";
import getEventCount from "@/services/getEventCount";
import checkMissingArgs from "@/services/checkMissingArgs";

import getExchangeEvents from "@/services/API/getExchangeEvents";

const getOnPremEvents = async (host, room, start, end) => {
  console.log(`${host}/api/exportOnPrem?room=${room}&start=${start}&end=${end}`);
  let result = await fetch(`${host}/api/exportOnPrem?room=${room}&start=${start}&end=${end}`, {
    method: 'get'
  }).then((r) => { return r.json() });
  return result;
}

export async function GET(request) {
  const session = await auth();

  if (!session || session?.error){
    const error = {
      error: {
        code: "ConnexionFailed",
        value: "Credentials error, please connecting you to your account."
      }
    }
    return NextResponse.json(error);
  }

  const headersReq = request.nextUrl.searchParams;

  const missingArgs = checkMissingArgs(headersReq, ["room", "start", "end"]);
  if (missingArgs.state == "error") {
    return NextResponse.json(missingArgs.value);
  }

  const room = headersReq.get("room");
  const start = headersReq.get("start");
  const end = headersReq.get("end");

  let option = {
    room: headersReq.get("room"),
    start: headersReq.get("start"),
    end: headersReq.get("end"),
    session: session
  }

  const resultJSON = await getEventCount(option);

  if (resultJSON?.error) {
    switch (resultJSON.error.code) {
      case "MailboxNotEnabledForRESTAPI":
        const data = await getOnPremEvents(request.nextUrl.origin, room, start, end);
        return NextResponse.json(data);
      default:
        return NextResponse.json(resultJSON?.error);
    }
  }
  option = {
    room: room,
    start: start,
    end: end,
    session: session,
  }
  const data = await getExchangeEvents(option);
  return NextResponse.json(data);
}