"use client";

import { useState } from "react";

import textRefactor from "@/services/textRefactor";

export default ({value, setter, placeholder, user, required=false}) =>{

    // let data = [
    //     "Épée",
    //     "Refactor",
    //     "Facteur(euse)",
    //     "Test",
    //     "Albator",
    //     "Albatar",
    //     "Albatur",
    //     "Albatir"
    // ];
    let data = [
        "example@epfl.ch"
    ];


    if (!data.includes(user) && user){
        data.push(user);
    }

    const [propals, setPropals] = useState([]);

    const orderFirstLetter = (a, b, param) =>{
        // console.log("@@@@");
        // console.log(param);
        // console.log(a);
        // console.log(a.indexOf(param));
        // console.log(b);
        // console.log(b.indexOf(param));
        // console.log("@@@@");
        return b.indexOf(param) < a.indexOf(param)
    }

    const filter = (param) =>{
        // console.log(
        //     data.filter((d) => textRefactor(d).includes(textRefactor(param))).sort((a,b)=> textRefactor(b) < textRefactor(a))
        // );
        // console.log(
        //     data.filter((d) => textRefactor(d).includes(textRefactor(param))).sort((a,b)=> textRefactor(b) < textRefactor(a)).sort((a, b)=> orderFirstLetter(textRefactor(a), textRefactor(b), textRefactor(param)))
        // );
        let maxPropals = 4;
        setPropals(
            param != "" ?
                data.filter((d) => textRefactor(d).includes(textRefactor(param))).length == 1 && textRefactor(data.filter((d) => textRefactor(d).includes(textRefactor(param)))[0]).length == textRefactor(param).length ?
                []
                : data.filter((d) => textRefactor(d).includes(textRefactor(param))).sort((a,b)=> textRefactor(b) < textRefactor(a)).sort((a, b)=> orderFirstLetter(textRefactor(a), textRefactor(b), textRefactor(param))).slice(0,maxPropals)
            : []
        )
    }

    return (
            // <div class="max-w-sm mx-auto">
            //     <label for="email-address-icon" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
            //     <div class="relative">
            //         <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            //         <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
            //             <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
            //             <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
            //         </svg>
            //         </div>
            //         <input
            //         type="text"
            //         id="email-address-icon"
            //         class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            //         placeholder="name@flowbite.com"/>
            //     </div>
            // </div>
            <div className="group flex flex-col justify-center relative">
                <input
                type="email"
                pattern=".+@epfl\.ch"
                title="example@epfl.ch"
                required={required}
                className="text-black pl-2 pr-2 w-96 h-10 text-xl focus:outline-none"
                placeholder={placeholder || "Research something..."}
                value={value}
                onChange={(e) => { filter(e.target.value); setter(e.target.value);}}/>
                <ul className=" group-focus-within:text-black group-focus-within:absolute group-focus-within:left-0 group-focus-within:right-0 group-focus-within:top-full group-focus-within:bg-white group-focus-within:z-10 group-focus-within:block
                hover:text-black hover:absolute hover:left-0 hover:right-0 hover:top-full hover:bg-white hover:z-10 hover:block
                hidden">
                    {propals.map((p) =>
                    // <li key={Math.round(Math.random() * 3011)} onClick={(e) => {setter(e.target.textContent); inputRef.current.value = e.target.textContent;}}>
                    <li key={Math.round(Math.random() * 3011)}
                    tabIndex={0}
                    onClick={(e) => {setter(e.target.textContent); setPropals([]);}}
                    className="cursor-pointer hover:bg-[#8E8E8E] pl-1 pr-1"
                    >
                        {p}
                    </li>
                    )}
                </ul>
            </div>
    );
};