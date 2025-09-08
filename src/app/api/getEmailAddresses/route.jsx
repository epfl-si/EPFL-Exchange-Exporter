import { NextResponse } from "next/server";
import { auth } from "@/auth";

import getEmailRessource from "@/services/API/getEmailRessource";

export async function GET(request) {
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

  const data = await getEmailRessource();

  return NextResponse.json({ data: data });
}