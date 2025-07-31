import connect from "@/services/connect";

import { useTranslations } from "next-intl";

export default () =>{
  const translationHandler = useTranslations("SignIn");
  return (
    <button onClick={() => connect()} className="hover:text-[#FF0000] hover:cursor-pointer" id="LoginButton">
      {translationHandler("label")}
    </button>
  );
};