import { useState } from "react";

import LinkGeneratorForm from "./LinkGeneratorForm";

export default ({data, label}) =>{

    const [popupOpen, setPopupOpen] = useState(false);

    return (
        <>
            <button id="LinkButton" className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-flex items-center" type="button" onClick={() => setPopupOpen(true)}>
                {/* Icon From HeroIcons, made by Tailwind CSS */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
                <span>{label}</span>
            </button>
            {popupOpen ? <LinkGeneratorForm setPopupOpen={setPopupOpen} data={data}/> : <></>}
        </>
    );
};