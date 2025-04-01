import connect from "@/services/connect";

import { useTranslations } from "next-intl";

export default ({redirection=false}) =>{
  const t = useTranslations("SignIn");
  return (
    <button onClick={() => connect(redirection)} className="hover:text-[#FF0000] hover:cursor-pointer">
      {t("label")}
    </button>
  );
};