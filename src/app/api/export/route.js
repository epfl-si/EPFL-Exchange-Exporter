import { NextResponse, NextRequest } from "next/server";
import { auth, signIn } from "@/auth";
import { headers } from "next/headers";

import path from 'path'
import fs from 'fs';

import downloadFile from "@/services/exportManager";

// Handles GET requests to /api
export async function GET(request) {
  const session = await auth();

  console.log(session);
  // return new NextResponse(["Credentials error, please connecting you to your account."]);

  // const blob = new Blob(["coucou"], { type: "text/plain" });

  if (!session || session?.error){
    return new NextResponse(["Credentials error, please connecting you to your account."]);
  }

  // return new NextResponse(blob, {headers: headers});
  const headersReq = request.nextUrl.searchParams;
  const room = headersReq.get("room");
  const start = headersReq.get("start");
  const end = headersReq.get("end");
  const filename = headersReq.get("filename");
  const extension = headersReq.get("extension");

  if (room){
    if (start){

    }
    else{
      return new NextResponse(["Missing other arguments"]);
    }
  }
  else{
    return new NextResponse(["Missing room arguments"]);
  }

  const fakeFunc = (a)=>{
    return null;
  }

  const option = {
    authSession: session,
    filename: filename,
    extension: extension,
    startDate: start,
    endDate: end,
    userSearch: room,
    setLoadingLabel: fakeFunc,
    setIsLoading: fakeFunc,
    isBackend: true
  }

  const blob = await downloadFile(option)

  if (blob?.error){

  }


  const headers = new Headers();
  headers.set("Content-Disposition", `attachment; filename="${option.filename}.${option.extension}"`)
  headers.set("Content-Type", "text/plain");



  // return new NextResponse(JSON.stringify(NextRequest, null, 2));
  return new NextResponse(blob, {headers: headers});
  return new NextResponse(JSON.stringify(blob, null, 2));
  return new NextResponse(blob);
}