"use client";

import { signIn } from "next-auth/react";

export default (redirection=false) =>{
  redirection ? (signIn("microsoft-entra-id")) : (signIn("microsoft-entra-id"));
};