import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import Datepicker from "react-tailwindcss-datepicker";

import { useMediaQuery } from "react-responsive";

export default ({startValue, startSetter, endValue, endSetter, label, required=false}) => {

  const params = useParams();
  const translationHandler = useTranslations("DatePicker");

  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

  return (
  <div className="flex items-start flex-col">
    {label ? <label className="text-black select-none" htmlFor="test">{label}</label> : <></>}

    {/* https://react-tailwindcss-datepicker.vercel.app/install - Uses tailwind css and day.js */}
    {
      isMobile ?
        // <Datepicker
        //   inputId="datepickerInput"
        //   required={required}
        //   value={{startDate: startValue, endDate: endValue}}
        //   onChange={newValue => {startSetter(newValue.startDate); endSetter(newValue.endDate);}}
        //   displayFormat="DD/MM/YYYY"
        //   popoverDirection="down"
        //   containerClassName={`relative z-40 w-full border rounded-lg ${startValue || endValue ? "border-[#FF0000]" : "border-gray-500"} [&>*]:outline-none`}
        //   inputClassName="bg-transparent relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-xl placeholder-gray-500 focus:ring-[1.2px] focus:ring-[#B51F1F] disabled:opacity-40 disabled:cursor-not-allowed"
        //   primaryColor={"red"}
        //   startWeekOn="mon"
        //   i18n={params.locale}
        //   showFooter={true}
        //   showShortcuts={false}
        //   useRange={false}
        //   />
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
          useRange={false}
          />
      :
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
              yesterday: translationHandler("yesterday"),
              today: translationHandler("today"),
              past: period => translationHandler("period", {period: period}),
              currentMonth: translationHandler("currentMonth"),
              pastMonth: translationHandler("pastMonth")
            },
            footer: {
              cancel: translationHandler("cancel"),
              apply: translationHandler("apply")
            }
          }}
          />
    }
  </div>
  );
};