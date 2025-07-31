import { useEffect, useState } from "react";

import BackgroundTasks from "../tasks/BackgroundTasks";
import CopyButton from "../utilities/CopyButton";

import { useTranslations } from "next-intl";
import { useMediaQuery } from "react-responsive";

export default ({setPopupOpen, data}) =>{

    const translationHandler = useTranslations("Form");

    const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

    const checkIfWanted = (key)=>{
        switch(key){
            case "room":
                return wantedRoom;
            case "start":
            case "end":
                return wantedPeriod;
            case "filename":
                return wantedFilename;
            case "extension":
                return wantedExtension;
        }
        return true;
    }

    const [isAutoDownload, setIsAutoDownload] = useState(false);
    const [wantedRoom, setWantedRoom] = useState(true);
    const [wantedPeriod, setWantedPeriod] = useState(true);
    const [wantedFilename, setWantedFilename] = useState(true);
    const [wantedExtension, setWantedExtension] = useState(true);

    const createLink = () =>{
        let lk = Object.entries(data).map((entry) => ({[entry[0]] : entry[1]})).filter((x)=> (Object.values(x)[0] != "") && checkIfWanted(Object.keys(x)[0])).map((x) => `${Object.keys(x)[0]}=${Object.values(x)[0]}`).join("&");
        return window.location.protocol + "//" + window.location.host + `${lk ? `?${lk}` : ""}${isAutoDownload ? "&download" : ""}`;
    }


    const [link, setLink] = useState(createLink(isAutoDownload));

    const selectValues = [
        {
            id: "room",
            name: translationHandler("room"),
            disabledCondition: !data.room,
            value: wantedRoom,
            setter: setWantedRoom
        },
        {
            id: "period",
            name: translationHandler("period"),
            disabledCondition: !(data.start || data.end),
            value: wantedPeriod,
            setter: setWantedPeriod
        },
        {
            id: "filename",
            name: translationHandler("filename"),
            disabledCondition: !data.filename,
            value: wantedFilename,
            setter: setWantedFilename
        },
        {
            id: "extension",
            name: translationHandler("extension"),
            disabledCondition: !data.extension,
            value: wantedExtension,
            setter: setWantedExtension
        },
        {
            id: "download",
            name: translationHandler("autoDownload"),
            disabledCondition: !wantedRoom,
            value: isAutoDownload,
            setter: setIsAutoDownload
        },
    ]

    //Handler to reset checkbox of auto download if one of other checkbox is missing.
    useEffect(()=>{
        setLink(createLink());
        setWantedRoom(wantedRoom && !selectValues.filter((x)=> x.id=="room")[0].disabledCondition)
        setWantedPeriod(wantedPeriod && !selectValues.filter((x)=> x.id=="period")[0].disabledCondition)
        setWantedFilename(wantedFilename && !selectValues.filter((x)=> x.id=="filename")[0].disabledCondition)
        setWantedExtension(wantedExtension && !selectValues.filter((x)=> x.id=="extension")[0].disabledCondition)
        setIsAutoDownload(isAutoDownload && !selectValues.filter((x)=> x.id=="download")[0].disabledCondition)
    },[wantedRoom, wantedPeriod, wantedFilename, wantedExtension, isAutoDownload])


    useEffect(()=>{
        const handleKeyDown = (e) =>{
            if (e.keyCode== 27){
                setPopupOpen(false);
            }
        }
        document.addEventListener('keydown', handleKeyDown, true);
    })


    return (
        <BackgroundTasks>
            <div className="bg-white w-4/5 sm:w-96 h-96 shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f] rounded-tl-xl rounded-br-xl flex flex-col justify-between animate-[ping_.15s_ease-in-out_forwards_reverse] p-2">
                <div className="flex justify-between">
                    <span>{translationHandler("linkGenerator")}</span>
                    <button id="CloseButton" type="button" onClick={()=>setPopupOpen(false)}>
                        {/* Icon From HeroIcons, made by Tailwind CSS */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ed333b" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-row items-center justify-end border border-black rounded-lg">
                    <div id="linkPreview" className="w-full mx-2 overflow-y-hidden overflow-x-auto bg-transparent focus:outline-none whitespace-nowrap py-[6px]">{link}</div>
                    <CopyButton link={createLink(isAutoDownload)}/>
                </div>
                <div>
                    <h4>{translationHandler("parameters")}</h4>
                    <div className="grid grid-cols-2 col-span-full gap-2">
                        {
                            selectValues.map(sv =>
                                <label htmlFor={sv.id} className={`rounded-lg h-full ${selectValues[selectValues.length - 1].id == sv.id && selectValues.length % 2 == 1 ? "col-start-1 col-end-3" : ""}`} key={sv.id}>
                                    <input className="peer hidden" id={`${sv.id}Invisible`} type="checkbox" disabled={sv.disabledCondition} checked={sv.value} onChange={() => { sv.setter(v => !v);  console.log(sv.value)}}/>
                                    <div className="flex items-center peer-disabled:text-gray-400 bg-white peer-enabled:hover:bg-gray-100 border w-full h-full p-2 peer-checked:border-[#FF0000] rounded-lg">
                                        <input className="peer accent-red-600" id={sv.id} type="checkbox" disabled={sv.disabledCondition} checked={sv.value} onChange={()=>{ sv.setter(v => !v);  console.log(sv.value)}}/>
                                        <span className="peer-disabled:text-gray-400 ml-1">{sv.name}</span>
                                    </div>
                                </label>
                            )
                        }
                    </div>
                </div>
            </div>
        </BackgroundTasks>
    );
};