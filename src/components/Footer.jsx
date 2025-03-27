"use client"

import { useTranslations } from "next-intl";

const Footer = () =>{

    const t = useTranslations("Footer");

    return (
        <footer className="bg-white flex justify-center items-center gap-2 text-xl ml-6 mr-6 m-2 min-h-10 shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f] z-30">
            <span>
                V2 -
            </span>
            <a href="https://github.com/epfl-si/EPFL-Exchange-Exporter/" target="_blank" className="hover:text-[#FF0000]">
                {t("source")}
            </a>
        </footer>
    );
};

export default Footer;