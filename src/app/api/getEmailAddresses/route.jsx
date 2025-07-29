import { NextResponse } from "next/server";
import { auth } from "@/auth";

import getEmailRoom from "@/services/API/getEmailRoom";

export async function GET(request) {
  const searchParamsReq = request.nextUrl.searchParams;

  let session = await auth();

  if (!session || session?.error){
    const error = {
      error: {
        code: "errCredentials",
        message: "Credentials error, please connecting you to your account."
      }
    }
    return NextResponse.json(error);
  }

  let room = searchParamsReq.get("room");

  const data = await getEmailRoom(room);

  return NextResponse.json({ data: data });
}