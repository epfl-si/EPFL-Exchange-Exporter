import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { headers } from "next/headers";

import checkMissingArgs from "@/services/checkMissingArgs";

import getEvents from "@/services/API/getEvents";

export async function GET(request) {

  const headersReq = request.nextUrl.searchParams;

  const missingArgs = checkMissingArgs(headersReq, ["room", "start", "end"]);
  if (missingArgs.state == "error") {
    return NextResponse.json(missingArgs.value);
  }


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

  let option = {
    room: headersReq.get("room"),
    start: headersReq.get("start"),
    end: headersReq.get("end"),
    session: session
  }

  const data = await getEvents(option);

  return NextResponse.json(data);
}

export async function POST(request) {

  const searchParamsReq = request.nextUrl.searchParams;
  const headersReq = await headers();

  const missingArgs = checkMissingArgs(searchParamsReq, ["room", "start", "end"]);
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
          value: "Credentials error, please connecting you to your account."
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

  // return NextResponse.json(option);

  const data = await getEvents(option);

  return NextResponse.json(data);
}