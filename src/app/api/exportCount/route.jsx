import { NextResponse } from "next/server";
import { auth, signIn } from "@/auth";

import checkMissingArgs from "@/services/checkMissingArgs";

import getEventCount from "@/services/getEventCount";

export async function GET(request) {

  const session = await auth();

  const headersReq = request.nextUrl.searchParams;

  const missingArgs = checkMissingArgs(headersReq, ["room", "start", "end"]);
  if (missingArgs.state == "error") {
    return NextResponse.json(missingArgs.value);
  }

  const option = {
    room: headersReq.get("room"),
    start: headersReq.get("start"),
    end: headersReq.get("end"),
    session: session
  }

  const resultJSON = await getEventCount(option);

  return NextResponse.json(resultJSON);
}