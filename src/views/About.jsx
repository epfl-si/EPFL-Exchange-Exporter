"use client"

import { useTranslations } from "use-intl";

import { useMediaQuery } from "react-responsive";

export default () =>{
    const translationHandler = useTranslations("HomePage");
    const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
    return (
        <section className={`w-auto ${isMobile ? "mx-10" : "mx-56"} flex flex-col gap-4`}>
            <div>
                <h2 className="text-6xl">{translationHandler("eeee-title")}</h2>
                <p className="ml-2">{translationHandler("eeee-paragraph")}</p>
            </div>
            <div>
                <h2 className="text-6xl">{translationHandler("guid-title")}</h2>
                <p className="ml-2">{translationHandler("guid-paragraph")}</p>
            </div>
        </section>
    );
};