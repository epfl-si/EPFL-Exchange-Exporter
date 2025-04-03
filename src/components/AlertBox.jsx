"use client"

import BackgroundTasks from "./BackgroundTasks";

import textRefactor from "@/services/textRefactor";

import checkImg from "/public/img/check.gif";
import infoImg from "/public/img/info.gif";
import warningImg from "/public/img/warning.gif";
import { useTranslations } from "use-intl";
import { useState } from "react";


export default ({data}) =>{

  const t = useTranslations("Form");

  const getTranslateErrorMsg = (error) =>{
        if (textRefactor(error).includes("date") && textRefactor(error).includes("maximum")){
          return t("errPeriodTooHigh");
        }
        else if (textRefactor(error).includes("date") && textRefactor(error).includes("earlier")){
          return t("errPeriodEndBeforeStart");
        }
        else if (textRefactor(error).includes("date")){
          return t("errPeriodInvalid");
        }
        else if (textRefactor(error).includes("object") && textRefactor(error).includes("not found") && textRefactor(error).includes("store")){
          return t("errUserUnavailable");
        }
        else if (textRefactor(error).includes("mailbox") && textRefactor(error).includes("inactive") && textRefactor(error).includes("hosted on-premise")){
          return t("errUserDisabled");
        }
        else if (textRefactor(error).includes("user") && textRefactor(error).includes("is invalid")){
          return t("errNoUser");
        }
        else if (textRefactor(error).includes(noData)){
          return t("errNoData");
        }
        else if (textRefactor(error).includes(muchData)){
          return t("errTooMuchData", {nb: error.split(',')[1]});
        }
        else{
          return t("errTokenExpired");
        }
  }

  const [errorMsg, setErrorMsg] = useState(getTranslateErrorMsg(data.error));

  return (
    <BackgroundTasks>
      <div className="bg-white w-60 h-68 text-center shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f] rounded-xl flex flex-col justify-between animate-[ping_.3s_ease-in-out_forwards_reverse]">
        {data.title ?
          <span className="text-left font-bold">{data.title}</span>
          : <></>
        }
        <img
        draggable={false}
        src={
          textRefactor(data.state).includes("check") ?
          checkImg.src
          : textRefactor(data.state).includes("warn") ?
          warningImg.src
          : infoImg.src
        }
        alt="icon from lordicon"
        className="w-32 ml-auto mr-auto mt-5"/>
        <span>{errorMsg}</span>
        <div className="flex justify-end">
          <input
          className="bg-[#FF0000] hover:bg-[#B51F1F] active:bg-[#891818] text-white font-bold rounded w-12 h-10 m-1 text-center hover:cursor-pointer"
          type="button"
          value={data.button.value || "OK"}
          onClick={() => data.button.setter(false)}/>
        </div>
      </div>
    </BackgroundTasks>
  );
};