import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import Datepicker from "react-tailwindcss-datepicker";

export default ({startValue, startSetter, endValue, endSetter, label, required=false}) => {

  const params = useParams();
  const t = useTranslations("DatePicker");

  return (
  <div className="flex items-start flex-col">
    {label ? <label className="text-black select-none" htmlFor="test">{label}</label> : <></>}

    {/* https://react-tailwindcss-datepicker.vercel.app/install - Uses tailwind css and day.js */}
    <Datepicker
    inputId="datepickerInput"
    required={required}
    value={{startDate: startValue, endDate: endValue}}
    onChange={newValue => {startSetter(newValue.startDate); endSetter(newValue.endDate);}}
    displayFormat="DD/MM/YYYY"
    popoverDirection="down"
    containerClassName={`relative z-20 w-full border rounded-lg ${startValue || endValue ? "border-[#FF0000]" : "border-gray-500"} [&>*]:outline-none`}
    inputClassName="bg-transparent relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-xl placeholder-gray-500 focus:ring-[1.2px] focus:ring-[#B51F1F] disabled:opacity-40 disabled:cursor-not-allowed"
    primaryColor={"red"}
    startWeekOn="mon"
    i18n={params.locale}
    showFooter={true}
    showShortcuts={true}
    configs={{
      shortcuts: {
        yesterday: t("yesterday"),
        today: t("today"),
        past: period => t("period", {period: period}),
        currentMonth: t("currentMonth"),
        pastMonth: t("pastMonth")
      },
      footer: {
        cancel: t("cancel"),
        apply: t("apply")
      }
    }}
    />
  </div>
  );
};