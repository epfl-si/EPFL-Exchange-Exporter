import { useState } from "react";

export default ({link}) =>{

    const [isCopy, setIsCopy] = useState(false);

    const copyToClipboard = () =>{
        if (!isCopy){
            navigator.clipboard.writeText(link);
            setIsCopy(true);
            setTimeout(() => {
                setIsCopy(false);
            }, 1500);
        }
    }

    return (
        <>
            <button id="CopyButton" className={`flex justify-center items-center ${ isCopy ? "cursor-default" : ""}`} type="button" onClick={() => {copyToClipboard()}}>
                {
                    !isCopy ?
                        <div className="animate-[ping_.19s_forwards_reverse]">
                            {/* Icon From HeroIcons, made by Tailwind CSS */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                            </svg>
                        </div>
                    :
                        // section instead of div, to force web page to reload animation
                        <section className="animate-[ping_.19s_forwards_reverse]">
                            {/* Icon From HeroIcons, made by Tailwind CSS */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" stroke="#43A047"/>
                            </svg>
                        </section>
                }
            </button>
        </>
    );
};