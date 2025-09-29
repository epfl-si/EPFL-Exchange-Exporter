import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { headers } from "next/headers";

import { checkArgsMissing, checkArgsValidity } from "@/services/checkArgs";

import getEvents from "@/services/API/getEvents";

import APIReturnClass from "@/class/APIReturnClass";

export async function GET(request) {

  const searchParamsReq = request.nextUrl.searchParams;
  const headersReq = await headers();

  const missingArgs = checkArgsMissing(searchParamsReq, ["resource", "start", "end"]);
  if (missingArgs.state == "error") {
    return NextResponse.json(new APIReturnClass(missingArgs.value, headersReq));
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
      return NextResponse.json(new APIReturnClass(error, headersReq));
    }
  }

  let option = {
    resource: searchParamsReq.get("resource"),
    start: searchParamsReq.get("start"),
    end: searchParamsReq.get("end"),
    ...(searchParamsReq.has("select")) && {select: searchParamsReq.get("select")},
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

  if (data.error?.code == "ErrorInvalidUser") {
    data.error.code = "errInvalidResource";
    data.error.message = data.error.message.replaceAll("user", "resource");
  }

  data = new APIReturnClass(data, headersReq);

  return NextResponse.json(data);
}