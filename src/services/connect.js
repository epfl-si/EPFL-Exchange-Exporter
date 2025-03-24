"use client";

import { signIn } from "next-auth/react";

export default (redirection=false) =>{
  redirection ? (signIn("microsoft-entra-id", { redirectTo: "/" })) : (signIn("microsoft-entra-id"));
};