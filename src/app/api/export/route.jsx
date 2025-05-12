import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { headers } from "next/headers";

import { checkArgsMissing, checkArgsValidity } from "@/services/checkArgs";

import getEvents from "@/services/API/getEvents";

export async function GET(request) {

  const headersReq = request.nextUrl.searchParams;

  const missingArgs = checkArgsMissing(headersReq, ["room", "start", "end"]);
  if (missingArgs.state == "error") {
    return NextResponse.json(missingArgs.value);
  }


  const session = await auth();

  if (!session || session?.error){
    const error = {
      error: {
        code: "ConnexionFailed",
        message: "Credentials error, please connecting you to your account."
      }
    }
    return NextResponse.json(error);
  }

  //Create option variable for Event requests
  let option = {
    room: headersReq.get("room"),
    start: headersReq.get("start"),
    end: headersReq.get("end"),
    session: session
  }

  const isArgsWrong = checkArgsValidity(option);

  if (!isArgsWrong.state) {
    const error = {
      error: {
        code: "WrongArguments",
        message: `Arguments error, please check "${isArgsWrong.cause}" parameters and try again.`
      }
    }
    return NextResponse.json(error);
  }

  const data = await getEvents(option);

  return NextResponse.json(data);
}

export async function POST(request) {

  const searchParamsReq = request.nextUrl.searchParams;
  const headersReq = await headers();

  const missingArgs = checkArgsMissing(searchParamsReq, ["room", "start", "end"]);
  if (missingArgs.state == "error") {
    return NextResponse.json(missingArgs.value);
  }

  let session = "";

  // let t = [];
  // headersReq.forEach((x) => t.push(x))

  // return NextResponse.json({ k: t });
  // return NextResponse.json({ Authorization: headersReq.get("Authorization") });

  if (!headersReq.has("Authorization")) {
    session = await auth();

    if (!session || session?.error){
      const error = {
        error: {
          code: "ConnexionFailed",
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

  const isArgsWrong = checkArgsValidity(option);

  if (!isArgsWrong.state) {
    const error = {
      error: {
        code: "WrongArguments",
        message: `Arguments error, please check "${isArgsWrong.cause}" parameters and try again.`
      }
    }
    return NextResponse.json(error);
  }

  const data = await getEvents(option);

  return NextResponse.json(data);
}