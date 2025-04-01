"use client";

import { useEffect, useState } from "react";

import textRefactor from "@/services/textRefactor";

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

    return (
            <div className="group flex flex-col justify-center relative w-full">
                <div className="relative">
                    <input
                    id="floating_outlined_room"
                    type="email"
                    pattern=".+@epfl\.ch"
                    title="example@epfl.ch"
                    required={required}
                    className={`text-xl block py-2.5 px-3 w-full text-slate-700 bg-transparent border ${propals.length > 0 ? "group-focus-within:border-b-0" : ""} rounded-xl ${propals.length > 0 ? "group-focus-within:rounded-b-none" : ""} appearance-none border-[#FF0000] focus:outline-none focus:ring-0 focus:border-[#B51F1F] peer peer-border-[#FF0000] invalid:border-gray-500`}
                    placeholder=""
                    value={value}
                    autoComplete="off"
                    onChange={(e) => {filter(e.target.value); setter(e.target.value);}}/>
                    {/* for floating label, tailwind css code from flowbite */}
                    <label
                    htmlFor="floating_outlined_room"
                    className="cursor-text select-none absolute text-sm text-[#FF0000] duration-300 transform -translate-y-4 scale-75 top-2 left-3 z-10 origin-[0] bg-[#EEEEEE] px-2 peer-placeholder-shown:text-gray-500 peer-invalid:text-gray-500 peer-focus:text-[#B51F1F] peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">{placeholder}</label>
                </div>
                <ul className={`group-focus-within:text-black group-focus-within:absolute group-focus-within:left-0 group-focus-within:right-0 group-focus-within:top-full group-focus-within:bg-white group-focus-within:z-[21] group-focus-within:block
                hover:text-black hover:absolute hover:left-0 hover:right-0 hover:top-full hover:bg-white hover:z-[21] hover:block
                ${propals.length > 0 ? "border-b border-l border-r border-[#B51F1F] rounded-b-xl" : ""}
                hidden select-none`}>
                    {propals.map((p) =>
                        <li key={Math.round(Math.random() * 3011)}
                        tabIndex={0}
                        onClick={(e) => {setter(e.target.textContent); setPropals([]);}}
                        className="cursor-pointer hover:bg-[#8E8E8E] pl-1 pr-1 last:rounded-b-xl"
                        >
                            {p}
                        </li>
                    )}
                </ul>
            </div>
    );
};