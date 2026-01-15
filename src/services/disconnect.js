import { signOut } from "next-auth/react";
import { logAuth } from "./logs";

export default (session) => {
  const user = session?.user;
  const usr = {...user};
  delete usr.image;
  delete usr.name;
  const log = {
    user: usr,
  };
  logAuth("signout", log);
  signOut();
};