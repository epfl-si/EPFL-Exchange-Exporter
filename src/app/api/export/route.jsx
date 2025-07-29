import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { headers } from "next/headers";

import { checkArgsMissing, checkArgsValidity } from "@/services/checkArgs";

import getEvents from "@/services/API/getEvents";

export async function GET(request) {

  const searchParamsReq = request.nextUrl.searchParams;
  const headersReq = await headers();

  const missingArgs = checkArgsMissing(searchParamsReq, ["room", "start", "end"]);
  if (missingArgs.state == "error") {
    return NextResponse.json(missingArgs.value);
  }

  let session = "";

  if (!headersReq.has("Authorization")) {
    session = await auth();

    if (!session || session?.error){
      const error = {
        error: {
          code: "errCredentials",
          message: "Credentials error, please connecting you to your account."
        }
      }
      return NextResponse.json(error);
    }
  }

  let option = {
    room: searchParamsReq.get("room"),
    start: searchParamsReq.get("start"),
    end: searchParamsReq.get("end"),
    ...(headersReq.has("Authorization")) && {accessToken: headersReq.get("Authorization").replace("Bearer ", "")},
    ...(!headersReq.has("Authorization")) && {session: session}
  }

  const isArgsCorrect = checkArgsValidity(option);

  if (!isArgsCorrect.state) {
    const error = {
      error: {
        code: "errParameters",
        message: `Arguments error, please check '${isArgsCorrect.cause}' parameters and try again.`
      }
    }
    return NextResponse.json(error);
  }

  const data = await getEvents(option);

  return NextResponse.json(data);
}