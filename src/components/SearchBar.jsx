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
                <ul className=" group-focus-within:text-black group-focus-within:absolute group-focus-within:left-0 group-focus-within:right-0 group-focus-within:top-full group-focus-within:bg-white group-focus-within:z-[21] group-focus-within:block
                hover:text-black hover:absolute hover:left-0 hover:right-0 hover:top-full hover:bg-white hover:z-[21] hover:block
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