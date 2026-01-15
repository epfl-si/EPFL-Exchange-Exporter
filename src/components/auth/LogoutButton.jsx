import disconnect from "@/services/disconnect";

import Loading from "../tasks/Loading";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import Image from 'next/image'

import AlertBox from "../tasks/AlertBox";

export default ({imageUrl, session}) =>{

  const translationHandler = useTranslations("SignOut");
  const translationLoadingHandler = useTranslations("Loading");

  const [isCheck, setIsCheck] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(p=>!p)
  };

  const details = useRef();

  return (
    <>
      <details ref={details} className="relative" open={ isOpen } onClick={handleClick} id="LogoutButton">
        <summary className="list-none [&::-webkit-details-marker]:hidden rounded-3xl w-10 h-10">
            {
              session?.user?.image ?
                <Image
                className="rounded-3xl shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f] hover:cursor-pointer"
                width={40}
                height={40}
                alt="user icon"
                src={imageUrl || session?.user?.image} />
              :
                <div className="rounded-3xl w-10 h-10 shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f] hover:cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="2 2 20 20" strokeWidth="1" stroke="currentColor" className="size-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </div>
            }
        </summary>
        <div className="text-black absolute right-0 top-full mt-1 bg-white z-20 block rounded-lg shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f]">
          <button onClick={() => { handleClick; setIsCheck(true) }} className="hover:text-[#FF0000] hover:cursor-pointer m-1 w-max">{translationHandler("label")}</button>
        </div>
      </details>
      {
        isCheck ?
          <AlertBox data={
                    {
                      choices: {
                        label: translationHandler("signoutLabel"),
                        data: [
                          {
                            value : translationHandler("signoutCancel"),
                            setter : (state)=>{setIsCheck(state);}
                          },
                          {
                            value : translationHandler("signoutAccept"),
                            setter : (state)=>{setIsCheck(state); setIsLogout(true); disconnect(session);}
                          }
                        ]
                      }
                    }
                  }/>
        :
          <></>
      }
      {
        isLogout ?
          <Loading label={translationLoadingHandler("connect")}/>
        :
          <></>
      }
    </>
  );
};