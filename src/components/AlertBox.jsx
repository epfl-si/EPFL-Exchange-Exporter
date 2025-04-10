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

  const getTranslateErrorMsg = (error, errorName) =>{
    return errorName == "errTooMuchData" ? t(errorName, {nb: error.split(',')[1]}) : t(errorName);
  }

  const [errorMsg, setErrorMsg] = useState(!data.choices ? getTranslateErrorMsg(data.error, data.errorName) : "");

  return (
    <BackgroundTasks>
      {
        data.choices ?
          <div className="bg-white w-60 h-68 text-center shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f] rounded-xl flex flex-col justify-between animate-[ping_.3s_ease-in-out_forwards_reverse]">
          {data.title ?
            <span className="text-left font-bold">{data.title}</span>
            : <></>
          }
          <img
          draggable={false}
          src={warningImg.src}
          alt="icon from lordicon"
          className="w-32 ml-auto mr-auto mt-5"/>
          <span>{data.choices.label}</span>
          <div className="flex justify-around">
            {
              data.choices.data.map(
                (d) =>
                  <input
                  key={Math.random()}
                  className="bg-[#FF0000] hover:bg-[#B51F1F] active:bg-[#891818] text-white font-bold rounded min-w-12 h-10 m-1 pl-3 pr-3 text-center hover:cursor-pointer"
                  type="button"
                  value={d.value || "OK"}
                  onClick={() => d.setter(false)}/>
                )
            }
          </div>
        </div>
        :
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
      }
    </BackgroundTasks>
  );
};