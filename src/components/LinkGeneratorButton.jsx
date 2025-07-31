import { useState } from "react";

import LinkGeneratorForm from "./LinkGeneratorForm";
import { useMediaQuery } from "react-responsive";

export default ({data, label}) =>{

    const [popupOpen, setPopupOpen] = useState(false);

    const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

    return (
        <>
            <button id="LinkButton" className={`bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white font-bold rounded inline-flex items-center ${!isMobile ? "mr-2 py-2 px-4" : "size-10 p-0 m-auto justify-center"}`} type="button" onClick={() => setPopupOpen(true)}>
                {/* Icon From HeroIcons, made by Tailwind CSS */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className={`size-4 ${!isMobile ? "mr-2" : ""}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
                {
                    !isMobile ?
                        <span>{label}</span>
                    :
                        <></>
                }
            </button>
            {popupOpen ? <LinkGeneratorForm setPopupOpen={setPopupOpen} data={data}/> : <></>}
        </>
    );
};