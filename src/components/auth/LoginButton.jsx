import connect from "@/services/connect";

import Loading from "../tasks/Loading";

import { useTranslations } from "next-intl";
import { useState } from "react";

export default () => {
  const [isLogin, setIsLogin] = useState(false);
  const translationHandler = useTranslations("SignIn");
  3001
  return (
    <>
      <button onClick={() => {setIsLogin(true); connect();}} className="hover:text-[#FF0000] hover:cursor-pointer" id="LoginButton">
        {translationHandler("label")}
      </button>
      {
        isLogin ?
          <Loading/>
        :
          <></>
      }
    </>
  );
};