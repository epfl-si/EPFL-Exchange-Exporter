import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { headers } from "next/headers";

import { checkArgsMissing, checkArgsValidity } from "@/services/checkArgs";

import getEvents from "@/services/API/getEvents";

export async function GET(request) {

  const searchParamsReq = request.nextUrl.searchParams;
  const headersReq = await headers();

  const missingArgs = checkArgsMissing(searchParamsReq, ["ressource", "start", "end"]);
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
    ressource: searchParamsReq.get("ressource"),
    start: searchParamsReq.get("start"),
    end: searchParamsReq.get("end"),
    ...(headersReq.has("Authorization")) && {accessToken: headersReq.get("Authorization").replace("Bearer ", "")},
    ...(!headersReq.has("Authorization")) && {session: session}
  }

  const isArgsCorrect = checkArgsValidity(option);

  let data = {};

  if (!isArgsCorrect.state) {
    data = {
      error: {
        code: "errParameters",
        message: `Arguments error, please check '${isArgsCorrect.cause}' parameters and try again.`
      }
    }
  }
  else {
    data = await getEvents(option);
  }

  data = Object.keys(data).includes("error") ?
    {
      status: "fail",
      error: {
        ...data.error,
        url: `${headersReq.get('X-Forwarded-Proto')}://${headersReq.get('host')}/docs/api/errors#${data.error.code}`,
      },
      ...data.error = ""
    }
    :
    {
      status: "success",
      ...data
    };

  return NextResponse.json(data);
}