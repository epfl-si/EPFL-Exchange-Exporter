"use client";

import { useEffect, useState } from "react";

import InputText from "./InputText";

import textRefactor from "@/services/textRefactor";
import closingHandler from "@/services/closingHandler";
import { useMediaQuery } from "react-responsive";

export default ({value, setter, placeholder, user, authSession, required=false}) =>{

    const [resourceList, setResourceList] = useState([]);


    useEffect(()=>{
        const getResources = async()=>{
            let response = await fetch(`/api/getEmailAddresses`, {
                method: 'get'
            }).then((r) => { return r.json() });
            setResourceList(response ? response.data.map(resource => resource.address) : ["no data"]);
        }
        getResources();
    }, [])

    const [propals, setPropals] = useState([]);

    const orderFirstLetter = (a, b, param) =>{
        return b.indexOf(param) < a.indexOf(param)
    }

    const filter = (param) =>{
        let maxPropals = 4;
        setPropals(
            param != "" ?
                resourceList.filter((d) => textRefactor(d).includes(textRefactor(param))).length == 1 && textRefactor(resourceList.filter((d) => textRefactor(d).includes(textRefactor(param)))[0]).length == textRefactor(param).length ?
                []
                : resourceList.filter((d) => textRefactor(d).includes(textRefactor(param))).sort((a,b)=> textRefactor(b) < textRefactor(a)).sort((a, b)=> orderFirstLetter(textRefactor(a), textRefactor(b), textRefactor(param))).slice(0,maxPropals)
            : []
        )
    }

    const handleClickedPropals = (e) =>{
        setter(e.target.textContent);
        setPropals([]);
    }

    const [isValid, setIsValid] = useState();

    const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

    return (
            <div className="group flex flex-col justify-center relative w-full">
                <InputText
                    id="floating_outlined_resource"
                    type="email"
                    pattern=".+@epfl\.ch"
                    title="example@epfl.ch"
                    value={value}
                    setter={(e) => {filter(e); setter(e);}}
                    placeholder={placeholder}
                    required={required}
                    exportedValiditySetter={setIsValid} borderColorClassName={`${propals.length > 0 ? "group-focus-within:border-b-0 group-focus-within:rounded-b-none" : ""} focus-within:border-[#B51F1F] ${isValid ? "border-[#FF0000]" : "border-gray-500"}`}
                    labelColorClassName={`peer-focus:text-[#B51F1F] ${isValid ? "text-[#FF0000]" : "text-gray-500"}`}/>
                <ul className={`group-focus-within:text-black group-focus-within:absolute group-focus-within:left-0 group-focus-within:right-0 group-focus-within:top-full group-focus-within:bg-white ${isMobile ? "group-focus-within:z-[41]" : "group-focus-within:z-[21]"} group-focus-within:block
                hover:text-black hover:absolute hover:left-0 hover:right-0 hover:top-full hover:bg-white ${isMobile ? "hover:z-[41]" : "hover:z-[21]"} hover:block
                ${propals.length > 0 ? "border-b border-l border-r border-[#B51F1F] rounded-b-lg" : ""}
                hidden select-none`}>
                    {propals.map((p) =>
                        <li key={p}
                        tabIndex={0}
                        onClick={(e) => handleClickedPropals(e)}
                        onKeyDown={(e)=> {closingHandler(e) ? (handleClickedPropals(e)) : ("")}}
                        className="cursor-pointer hover:bg-[#8E8E8E] pl-1 pr-1 last:rounded-b-lg"
                        >
                            {p}
                        </li>
                    )}
                </ul>
            </div>
    );
};