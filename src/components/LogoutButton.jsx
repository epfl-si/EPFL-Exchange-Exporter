import disconnect from "@/services/disconnect";

import { useTranslations } from "next-intl";

import userPP from "/public/img/user.png"

export default ({imageUrl, session}) =>{

  const t = useTranslations("SignOut");

  return (
    <details className="relative">
      <summary className="list-none [&::-webkit-details-marker]:hidden">
          <img
          className="rounded-3xl w-10 h-10 shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f] hover:cursor-pointer"
          src={imageUrl || session?.user?.image || userPP.src}/>
      </summary>
      <div className="text-black absolute right-0 top-full mt-1 bg-white z-20 block w-20 shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f]">
      <button onClick={() => disconnect()} className="hover:text-[#FF0000] hover:cursor-pointer">{t("label")}</button>
      </div>
    </details>
  );
};