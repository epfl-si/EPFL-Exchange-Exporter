"use client";

import { useTranslations } from "next-intl";

// import csvImg from "/public/img/icons8-csv-100.png";
// import jsonImg from "/public/img/icons8-json-100.png";

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
    },
    // {
    //   name : "test",
    //   plot : "Test"
    // }
  ]
  return (
    <div>
      {/* <select required={required} onChange={(e) => setter(e.target.value)} id="underline_select" value={value}
      classNameNameName="text-xl text-block py-2.5 px-0 w-full text-slate-700 bg-transparent border-0 border-b-2 border-[#FF0000] focus:outline-none focus:ring-0 focus:border-[#B51F1F] peer invalid:text-gray-400" //appearance-none
      >
          <option value="" hidden disabled>.extension</option>
          <option value="csv">.csv</option>
          <option value="json">.json</option>
      </select> */}



      <label className="select-none">Extension</label>
      <ul className="grid w-full gap-6 md:grid-cols-2">
      {/* <ul className="flex flex-wrap flex-row gap-x-6 w-full"> */}
          {/* <li>
              <input type="radio" id="extension-csv" name="extension" value="csv" className="hidden peer" required />
              <label htmlFor="extension-csv" className="select-none inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-[#007480] peer-checked:text-[#007480] hover:text-gray-600 hover:bg-gray-100">
                  <div className="block">
                      <div className="w-full text-lg font-semibold">CSV</div>
                      <div className="w-full">Débutant</div>
                  </div>
                  <svg className="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                  </svg>
              </label>
          </li>
          <li>
              <input type="radio" id="extension-json" name="extension" value="json" className="hidden peer"/>
              <label htmlFor="extension-json" className="select-none inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-[#007480] peer-checked:text-[#007480] hover:text-gray-600 hover:bg-gray-100">
                  <div className="block">
                      <div className="w-full text-lg font-semibold">JSON</div>
                      <div className="w-full">Professionnel</div>
                  </div>
                  <svg className="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                  </svg>
              </label>
          </li> */}
          {
            allChoices.map((choice) =>
              <li key={allChoices.map((x)=> x.name).indexOf(choice.name)}>
              {/* <li className="basis-2/4" key={allChoices.map((x)=> x.name).indexOf(choice.name)}> */}
                <input type="radio" id={`extension-${choice.name}`} name="extension" value={choice.name} className="hidden peer" onChange={(e) => {setter(choice.name); checkName.setter(choice.name)}} checked={choice.name == checkName.value} required={required}/>
                <label tabIndex={0} onKeyDown={(e) => {if (e.keyCode === 13 || e.keyCode === 32) {e.target.click()}}} htmlFor={`extension-${choice.name}`} className="select-none inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-[#007480] peer-checked:text-[#007480] hover:text-gray-600 hover:bg-gray-100">
                  <div className="block">
                    <div className="w-full text-lg font-semibold">{choice.name.toUpperCase()}</div>
                    <div className="w-full">{choice.plot}</div>
                  </div>
                  <svg className="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                  </svg>
                  {/* <img src={jsonImg.src} className="w-12"/> */}
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