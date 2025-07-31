"use client";

import { signIn } from "next-auth/react";

export default () =>{
  signIn("microsoft-entra-id");
};