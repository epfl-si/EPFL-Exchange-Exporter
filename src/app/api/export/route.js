import { NextResponse, NextRequest } from "next/server";
import { auth, signIn } from "@/auth";
import { headers } from "next/headers";

import path from 'path'
import fs from 'fs';

import downloadFile from "@/services/exportManager";

export async function GET(request) {
  const session = await auth();

  if (!session || session?.error){
    return new NextResponse(["Credentials error, please connecting you to your account."]);
  }

  const headersReq = request.nextUrl.searchParams;

  const requiredParams = ["room", "start", "end", "filename", "extension"]

  for (let param of requiredParams){
    if (!request.nextUrl.searchParams.has(param)){
      return new NextResponse([`Missing following argument : ${param}`]);
    }
  }

  const room = headersReq.get("room");
  const start = headersReq.get("start");
  const end = headersReq.get("end");
  const filename = headersReq.get("filename");
  const extension = headersReq.get("extension");

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
    isBackend: true,
    website: request.nextUrl.origin
  }

  console.log(request.nextUrl.origin);

  const blob = await downloadFile(option)

  if (blob?.error){
    return new NextResponse({error : blob?.error});
  }


  const headers = new Headers();
  headers.set("Content-Disposition", `attachment; filename="${option.filename}.${option.extension}"`)
  headers.set("Content-Type", "text/plain");

  return new NextResponse(blob, {headers: headers});
}