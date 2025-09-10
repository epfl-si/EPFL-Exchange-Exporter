"use client"

import { useTranslations } from "next-intl";
import Link from "next/link";

import xmas from '/public/img/xmas.gif'
import easter from '/public/img/easter.gif'
import hlwn from '/public/img/hlwn.gif'
import { useEffect, useState } from "react";

const Footer = () => {

    const [today, setToday] = useState("");
    const [events, setEvents] = useState({ xmas: xmas, easter: easter, hlwn: hlwn });

    useEffect(() => {
        const api = async () => {
            const dateResponse = await fetch("/api/today").then((res) => res.json());
            console.log(dateResponse);
            console.log(dateResponse.event);
            setToday(dateResponse);
        }
        api();
    }, [])

    const translationHandler = useTranslations("Footer");

    return (
        <footer className="bg-white flex justify-center items-center gap-2 text-xl ml-6 mr-6 m-2 min-h-10 shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f] z-[19]">
            {/* Icon by Freepik */}
            {today?.event?.isEvent ? <img className="absolute size-12 left-0 bottom-0 mb-[2px] ml-6" src={events[today.event.name].src} /> : <></>}
            <Link href="/docs" className="hover:text-[#FF0000]">
                Documentations
            </Link>
            <a href="https://github.com/epfl-si/EPFL-Exchange-Exporter/" target="_blank" className="hover:text-[#FF0000]" id="SourceCode">
                {translationHandler("source")}
            </a>
        </footer>
    );
};

export default Footer;