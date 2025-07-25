"use client"

import { useTranslations } from "use-intl";

export default () =>{
    const translationHandler = useTranslations("HomePage");
    return (
        <section className="w-[980px] flex flex-col gap-4">
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