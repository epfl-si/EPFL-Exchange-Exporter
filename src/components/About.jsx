"use client"

import { useTranslations } from "use-intl";

export default () =>{
    const t = useTranslations("HomePage");
    return (
        <section>
            <div>
                <h1 className="text-6xl">{t("eee-title")}</h1>
                <p>{t("eee-paragraph")}</p>
            </div>
            <div>
                <h2 className="text-6xl">{t("guid-title")}</h2>
                <p>{t("guid-paragraph")}</p>
            </div>
        </section>
    );
};