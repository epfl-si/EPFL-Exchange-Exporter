import { useEffect, useState } from "react";

import BackgroundTasks from "./BackgroundTasks";
import CopyButton from "./CopyButton";

import { useTranslations } from "next-intl";

export default ({setPopupOpen, data}) =>{

    const t = useTranslations("Form");

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

    //Handler to reset checkbox of auto download if one of other checkbox is missing.
    useEffect(()=>{
        setLink(createLink());
        setWantedRoom(wantedRoom && data.room)
        setWantedPeriod(wantedPeriod && data.start && data.end)
        setWantedFilename(wantedFilename && data.filename)
        setWantedExtension(wantedExtension && data.extension)
        setIsAutoDownload(isAutoDownload && (wantedRoom && wantedPeriod && wantedFilename && wantedExtension))
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
            <div className="bg-white w-96 h-96 shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f] rounded-xl flex flex-col justify-between animate-[ping_.15s_ease-in-out_forwards_reverse] p-2">
                <div className="flex justify-between">
                    <span>{t("linkGenerator")}</span>
                    <button type="button" onClick={()=>setPopupOpen(false)}>
                        {/* Icon From HeroIcons, made by Tailwind CSS */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ed333b" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-row items-center justify-end border border-black rounded-lg">
                    <div className="w-full mx-2 overflow-y-hidden overflow-x-auto bg-transparent focus:outline-none whitespace-nowrap py-[6px]">{link}</div>
                    <CopyButton link={createLink(isAutoDownload)}/>
                </div>
                <div>
                    <h4>{t("parameters")}</h4>
                    <div className="ml-4">
                        <div>
                            <input className="peer accent-red-600" id="room" type="checkbox" disabled={!data.room} checked={wantedRoom} onChange={()=>{ setWantedRoom(!wantedRoom)}}/>
                            <label htmlFor="room" className="peer-disabled:text-gray-400">{t("room")}</label>
                        </div>
                        <div>
                            <input className="peer accent-red-600" id="period" type="checkbox" disabled={!(data.start || data.end)} checked={wantedPeriod} onChange={()=>{ setWantedPeriod(!wantedPeriod)}}/>
                            <label htmlFor="period" className="peer-disabled:text-gray-400">{t("period")}</label>
                        </div>
                        <div>
                            <input className="peer accent-red-600" id="filename" type="checkbox" disabled={!data.filename} checked={wantedFilename} onChange={()=>{ setWantedFilename(!wantedFilename)}}/>
                            <label htmlFor="filename" className="peer-disabled:text-gray-400">{t("filename")}</label>
                        </div>
                        <div>
                            <input className="peer accent-red-600" id="extension" type="checkbox" disabled={!data.extension} checked={wantedExtension} onChange={()=>{ setWantedExtension(!wantedExtension)}}/>
                            <label htmlFor="extension" className="peer-disabled:text-gray-400">{t("extension")}</label>
                        </div>
                        <div>
                            <input className="peer accent-red-600" id="autodownload" type="checkbox" disabled={!(wantedRoom && wantedPeriod && wantedFilename && wantedExtension)} checked={isAutoDownload} onChange={()=>{setIsAutoDownload(!isAutoDownload);}}/>
                            <label htmlFor="autodownload" className="peer-disabled:text-gray-400">{t("autoDownload")}</label>
                        </div>
                    </div>
                </div>
            </div>
        </BackgroundTasks>
    );
};