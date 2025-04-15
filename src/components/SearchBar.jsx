"use client";

import { useEffect, useState } from "react";

import textRefactor from "@/services/textRefactor";

import InputText from "./InputText";

export default ({value, setter, placeholder, user, authSession, required=false}) =>{

    const [roomList, setRoomList] = useState([]);


    useEffect(()=>{
        const getRooms = async()=>{
            let response = await fetch(`https://graph.microsoft.com/beta/me/findRooms`, {
                method: 'get',
                headers: new Headers({
                    'Authorization': `Bearer ${authSession.accessToken}`
                })
            }).then((r) => {return r.json()});
            setRoomList(response ? response.value.map(room => room.address) : ["no data"]);
        }
        getRooms();
    }, [])

    const [propals, setPropals] = useState([]);

    const orderFirstLetter = (a, b, param) =>{
        return b.indexOf(param) < a.indexOf(param)
    }

    const filter = (param) =>{
        let maxPropals = 4;
        setPropals(
            param != "" ?
                roomList.filter((d) => textRefactor(d).includes(textRefactor(param))).length == 1 && textRefactor(roomList.filter((d) => textRefactor(d).includes(textRefactor(param)))[0]).length == textRefactor(param).length ?
                []
                : roomList.filter((d) => textRefactor(d).includes(textRefactor(param))).sort((a,b)=> textRefactor(b) < textRefactor(a)).sort((a, b)=> orderFirstLetter(textRefactor(a), textRefactor(b), textRefactor(param))).slice(0,maxPropals)
            : []
        )
    }

    const handleClickedPropals = (e) =>{
        setter(e.target.textContent);
        setPropals([]);
    }

    const handleSelectedPropals = (e) =>{
        switch(e.keyCode){
            case 13:
            case 32:
                handleClickedPropals(e);
                break;
            default:
                break;
        }
    }

    const [isValid, setIsValid] = useState();

    return (
            <div className="group flex flex-col justify-center relative w-full">
                <InputText
                    id="floating_outlined_room"
                    type="email"
                    pattern=".+@epfl\.ch"
                    title="example@epfl.ch"
                    value={value}
                    setter={(e) => {filter(e); setter(e);}}
                    placeholder={placeholder}
                    required={required}
                    exportedValiditySetter={setIsValid} borderColorClassName={`${propals.length > 0 ? "group-focus-within:border-b-0 group-focus-within:rounded-b-none" : ""} focus-within:border-[#B51F1F] ${isValid ? "border-[#FF0000]" : "border-gray-500"}`}
                    labelColorClassName={`peer-focus:text-[#B51F1F] ${isValid ? "text-[#FF0000]" : "text-gray-500"}`}/>
                <ul className={`group-focus-within:text-black group-focus-within:absolute group-focus-within:left-0 group-focus-within:right-0 group-focus-within:top-full group-focus-within:bg-white group-focus-within:z-[21] group-focus-within:block
                hover:text-black hover:absolute hover:left-0 hover:right-0 hover:top-full hover:bg-white hover:z-[21] hover:block
                ${propals.length > 0 ? "border-b border-l border-r border-[#B51F1F] rounded-b-lg" : ""}
                hidden select-none`}>
                    {propals.map((p) =>
                        <li key={Math.round(Math.random() * 3011)}
                        tabIndex={0}
                        onClick={(e) => handleClickedPropals(e)}
                        onKeyDown={(e)=> handleSelectedPropals(e)}
                        className="cursor-pointer hover:bg-[#8E8E8E] pl-1 pr-1 last:rounded-b-lg"
                        >
                            {p}
                        </li>
                    )}
                </ul>
            </div>
    );
};