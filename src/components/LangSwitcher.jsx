"use client"

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { startTransition } from "react";

export default () =>{
    const lang = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const searchParams = useSearchParams();

    const onSelectChange = (eee) =>{
        const nextLocale = eee.target.value;
        startTransition(()=>{
            router.replace(
                {pathname, params},
                {locale : pathname == "/" ? `${nextLocale}?${searchParams.toString()}` : nextLocale}
            )
        })
    }
    return (
        <select defaultValue={lang} onChange={(eee) => onSelectChange(eee)} className="bg-transparent">
            <option value={"fr"}>
                🇫🇷 FR
            </option>
            <option value={"en"}>
                🇬🇧 EN
            </option>
        </select>
    );
};