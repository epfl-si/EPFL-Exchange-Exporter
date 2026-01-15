import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { headers } from "next/headers";

import { checkArgsMissing, checkArgsValidity } from "@/services/checkArgs";

import getEvents from "@/services/API/getEvents";

import APIReturnClass from "@/class/APIReturnClass";
import { logAPI } from "@/services/logs";

const log = (data, request, header) => {
  const paramsQuery = request.nextUrl.searchParams.entries().reduce((result, paramKeyValue, index) => result += `${index == 0 ? '?' : '&'}${paramKeyValue[0]}=${paramKeyValue[1]}`, ''); //Empty string at the end is the initial value used for .reduce(). Without this, first element of array will not be impacted by reducer.
  const url = `${header.get('X-Forwarded-Proto')}://${header.get('host')}${request?.nextUrl?.pathname}${paramsQuery}`;
  const response = {
    response: { ...data },
    url
  }
  logAPI(response);
}

export async function GET(request) {

  const searchParamsReq = request.nextUrl.searchParams;
  const headersReq = await headers();

  let data = {};

  const missingArgs = checkArgsMissing(searchParamsReq, ["resource", "start", "end"]);
  if (missingArgs.state == "error") {
    const APIReturn = new APIReturnClass(missingArgs.value, headersReq);
    log(APIReturn, request, headersReq);
    return NextResponse.json(APIReturn, { status: APIReturn.status.code });
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
      const APIReturn = new APIReturnClass(error, headersReq);
      log(APIReturn, request, headersReq);
      return NextResponse.json(APIReturn, { status: APIReturn.status.code });
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
  if (data.status.name != "success") {
    log(data, request, headersReq);
    return NextResponse.json(data, {status: data.status.code});
  }
  const len = data.data.length;
  const logData = {data: `${len} event${len > 1 ? 's' : ''} returned.`}
  log(logData, request, headersReq);
  return NextResponse.json(data);
}