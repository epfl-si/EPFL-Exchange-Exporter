import { NextResponse } from "next/server";
import { auth } from "@/auth";
import checkMissingArgs from "@/services/checkMissingArgs";

import getEvents from "@/services/API/getEvents";

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

  let option = {
    room: headersReq.get("room"),
    start: headersReq.get("start"),
    end: headersReq.get("end"),
    session: session
  }

  const data = await getEvents(option);

  return NextResponse.json(data);
}