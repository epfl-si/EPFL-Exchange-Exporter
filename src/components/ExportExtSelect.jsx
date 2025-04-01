"use client";

import { useTranslations } from "next-intl";

export default ({value, setter, isLastMissing, checkName, required=false}) => {
  const t = useTranslations("Form");

  const allChoices = [
    {
      name : "csv",
      plot : t("csv")
    },
    {
      name : "json",
      plot : t("json")
    }
  ]
  return (
    <div>
      <label className="select-none">Extension</label>
      <ul className="grid w-full gap-6 md:grid-cols-2">
          {
            allChoices.map((choice) =>
              <li key={allChoices.map((x)=> x.name).indexOf(choice.name)}>
                <input type="radio" id={`extension-${choice.name}`} name="extension" value={choice.name} className="hidden peer" onChange={(e) => {setter(choice.name); checkName.setter(choice.name)}} checked={choice.name == checkName.value} required={required}/>
                <label tabIndex={0} onKeyDown={(e) => {if (e.keyCode === 13 || e.keyCode === 32) {e.target.click()}}} htmlFor={`extension-${choice.name}`} className="select-none inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-[#FF0000] peer-checked:text-[#FF0000] hover:text-gray-600 hover:bg-gray-100">
                  <div className="block">
                    <div className="w-full text-lg font-semibold">{choice.name.toUpperCase()}</div>
                    <div className="w-full">{choice.plot}</div>
                  </div>
                  <svg className="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                  </svg>
                </label>
              </li>
        )
          }
      </ul>
      {
        !value && isLastMissing ?
        <span className="text-red-600 font-bold absolute select-none">Veuillez sélectionner une extension.</span>
        :
        <></>
      }
    </div>
  );
};