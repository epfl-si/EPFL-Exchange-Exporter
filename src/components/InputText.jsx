"use client"

import { useEffect, useState } from "react";

export default ({id, value, setter, placeholder, exportedValiditySetter, type="text", pattern="", title="", autoComplete=false, borderColorClassName=false, labelColorClassName=false, required=false}) =>{
  const [idInput, setIdInput] = useState(id || `floating_outlined-${Math.round(Math.random() * 3011)}`);
  const [isValid, setIsValid] = useState(false);

  useEffect(()=>{
    setIsValid((new RegExp(pattern)).test(value));
    if (exportedValiditySetter){
      exportedValiditySetter((new RegExp(pattern)).test(value))
    }
  },[value])

  return (
    <div className={`duration-200 transform relative text-xl block font-light w-full bg-transparent border rounded-lg appearance-none focus:outline-none focus:ring-0 ${borderColorClassName ? borderColorClassName : `focus-within:border-[#B51F1F] ${pattern ? isValid ? "border-[#FF0000]" : "border-gray-500" : value ? "border-[#FF0000]" : "border-gray-500"}`}`}>
      <div className="relative pr-6">
        <input
        id={idInput}
        type={type}
        pattern={pattern}
        title={title}
        required={required}
        className="tracking-wide text-xl block py-2.5 pl-4 pr-3 font-light w-full text-black bg-transparent rounded-lg appearance-none focus:outline-none focus:ring-0 peer"
        placeholder=""
        value={value}
        autoComplete={autoComplete ? "on" : "off"}
        onChange={(e) => {setter(e.target.value);}}/>
        {/* for floating label, tailwind css code from flowbite */}
        <label
        htmlFor={idInput}
        className={`cursor-text select-none absolute text-sm ${labelColorClassName ? labelColorClassName : `peer-focus:text-[#B51F1F] ${pattern ? isValid ? "text-[#FF0000]" : "text-gray-500" : value ? "text-[#FF0000]" : "text-gray-500"}`} duration-200 transform -translate-y-4 scale-75 top-1.5 left-3 z-10 origin-[0] bg-[#EEEEEE] px-2 peer-placeholder-shown:text-xl peer-focus:text-sm peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1.5 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>{placeholder}</label>
      </div>
      <svg className={`h-5 w-5 absolute top-3.5 right-3.5 text-gray-400 ${value ? "" : "hidden"} animate-[ping_.2s_ease-in-out_forwards_reverse] hover:cursor-pointer`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" onClick={()=>{setter(""); setIsValid(false)}}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </div>
  );
};