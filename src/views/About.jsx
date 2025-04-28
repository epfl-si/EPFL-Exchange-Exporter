"use client"

import { useTranslations } from "use-intl";

export default () =>{
    const t = useTranslations("HomePage");
    return (
        <section className="w-[980px] flex flex-col gap-4">
            <div>
                <h2 className="text-6xl">{t("eeee-title")}</h2>
                <p className="ml-2">{t("eeee-paragraph")}</p>
            </div>
            <div>
                <h2 className="text-6xl">{t("guid-title")}</h2>
                <p className="ml-2">{t("guid-paragraph")}</p>
            </div>
        </section>
    );
};