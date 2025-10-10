"use client"

import BackgroundTasks from "./BackgroundTasks";

import textRefactor from "@/services/textRefactor";

import checkImg from "/public/img/check.gif";
import infoImg from "/public/img/info.gif";
import warningImg from "/public/img/warning.gif";
import { useTranslations } from "use-intl";
import { useEffect, useState } from "react";

import Image from 'next/image'


export default ({data}) =>{

  const translationHandler = useTranslations("Form");

  const getTranslateErrorMsg = (error, errorName, errorCount) => {
    console.log(errorName);
    return errorName == "errTooMuchData" ? translationHandler(errorName, {nb: errorCount || error.split('.')[2].split(" ").filter((x) => x != "")[0]}) : translationHandler(errorName);
  }

  useEffect(()=>{
    const handleKeyDown = (e) =>{
      if (e.keyCode== 27){
        data.button.setter(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown, true);
  })

  const [errorMsg, setErrorMsg] = useState(!data.choices ? getTranslateErrorMsg(data.error, data.errorName) : "");
  console.log("dataaaaaaaa")
  console.log(data)
  console.log(data.status?.name)

  return (
    <BackgroundTasks>
      {
        data.choices ?
          <div id="popup" className="bg-white w-60 h-68 text-center shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f] rounded-xl flex flex-col justify-between animate-[ping_.3s_ease-in-out_forwards_reverse]">
          {data.title ?
            <span className="text-left font-bold">{data.title}</span>
            : <></>
          }
          <Image
              draggable={false}
              src={warningImg.src}
              alt="icon from lordicon"
              className="ml-auto mr-auto mt-5"
              width={128}
              height={128}
            />
          <span>{data.choices.label}</span>
          <div className="flex justify-around">
            {
              data.choices.data.map(
                (d) =>
                  <input
                    key={Math.random()}
                    id={d.id}
                    className="bg-[#FF0000] hover:bg-[#B51F1F] active:bg-[#891818] text-white font-bold rounded min-w-12 h-10 m-1 pl-3 pr-3 text-center hover:cursor-pointer"
                    type="button"
                    value={d.value || "OK"}
                    onClick={() => d.setter(false)}/>
                )
            }
          </div>
        </div>
        :
          <div id="popup" className="bg-white w-60 h-68 text-center shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f] rounded-xl flex flex-col justify-between animate-[ping_.3s_ease-in-out_forwards_reverse]">
            {data.title ?
              <span className="text-left font-bold">{data.title}</span>
              : <></>
            }
            <Image
              draggable={false}
              src={
                textRefactor(data.status?.name).includes("check") ?
                checkImg.src
                : textRefactor(data.status?.name).includes("warn") ?
                warningImg.src
                : infoImg.src
              }
              alt="icon from lordicon"
              className="ml-auto mr-auto mt-5"
              width={128}
              height={128}
            />
            <span id={data.errorName == "DownloadSuccess" ? data.errorName : "errorMsg"}>{errorMsg}</span>
            <div className="flex justify-end">
              <input
              id="ConfirmButton"
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