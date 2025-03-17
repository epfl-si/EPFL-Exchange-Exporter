"use server"
import { auth } from "@/auth";
import LogOutView from "@/views/LogOutView";
import { signOut } from "next-auth/react";
export default async() => {
  const authSession = await auth();
  return (
    <LogOutView authSession={authSession}/>
  );
};