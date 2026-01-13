"use client"

import BackgroundTasks from "./BackgroundTasks";

import textRefactor from "@/services/textRefactor";

import checkImg from "/public/img/check.gif";
import infoImg from "/public/img/info.gif";
import warningImg from "/public/img/warning.gif";
import { useTranslations } from "use-intl";
import { useEffect, useState } from "react";

import Image from 'next/image'
import CopyButton from "../utilities/CopyButton";


export default ({data}) =>{

  const translationHandler = useTranslations("Form");

  const [showError, setShowError] = useState(false);

  const getTranslateErrorMsg = (error, errorName, errorCount) => {
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

  return (
    <BackgroundTasks>
      {
        data.choices ?
          <div id="popup" className="bg-white w-60 h-80 text-center shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f] rounded-xl flex flex-col justify-between animate-[ping_.3s_ease-in-out_forwards_reverse]">
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
              unoptimized
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
          <div id="popup" className={`bg-white w-60 ${!data.status.code ? "h-68" : "h-80"} text-center shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f] rounded-xl flex flex-col justify-between animate-[ping_.3s_ease-in-out_forwards_reverse]`}>
            {data.title ?
              <span className="text-left font-bold">{data.title}</span>
              : <></>
            }
            <div>
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
            </div>
            {
              data.status.code ?
                <div className="mx-2 w-auto h-full bg-gray-100 rounded-lg">
                  <div className="">
                    <details className="w-full opacity-70">
                      <summary className="list-none flex justify-between pointer-events-none">
                        <div className="flex cursor-pointer pointer-events-auto" onClick={() => setShowError(!showError)}>
                          {
                            showError ?
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                              </svg>
                            :
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                          }
                          <span>Error</span>
                        </div>
                        <div className="pointer-events-auto">
                          <CopyButton link={data.error.message} />
                        </div>
                      </summary>
                        <p className="h-16 overflow-y-auto overflow-hidden">{data.error.message}</p>
                    </details>
                  </div>
                </div>
              :
                <></>
            }
            <div className="flex justify-end mt-2">
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