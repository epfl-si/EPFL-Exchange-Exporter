import disconnect from "@/services/disconnect";

import { useTranslations } from "next-intl";

export default ({imageUrl, session}) =>{

  const t = useTranslations("SignOut");

  return (
    <details className="relative">
      <summary className="list-none [&::-webkit-details-marker]:hidden">
          {
            session?.user?.image ?
              <img
              className="rounded-3xl w-10 h-10 shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f] hover:cursor-pointer"
              src={imageUrl || session?.user?.image}/>
            :
              <div className="rounded-3xl w-10 h-10 shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f] hover:cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="2 2 20 20" strokeWidth="1" stroke="currentColor" className="size-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </div>
          }
      </summary>
      <div className="text-black absolute right-0 top-full mt-1 bg-white z-20 block rounded-lg shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f]">
        <button onClick={() => disconnect()} className="hover:text-[#FF0000] hover:cursor-pointer m-1">{t("label")}</button>
      </div>
    </details>
  );
};