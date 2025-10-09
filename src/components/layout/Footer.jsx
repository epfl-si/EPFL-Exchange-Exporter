"use client"

import { useTranslations } from "next-intl";
import Link from "next/link";

import xmas from '/public/img/xmas.gif'
import easter from '/public/img/easter.gif'
import hlwn from '/public/img/hlwn.gif'
import { useEffect, useState } from "react";

import packageConfig from '../../../package.json' with { type: 'json' };

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
        <footer className="bg-white flex justify-between items-center gap-2 text-xl mx-6 px-2 m-2 min-h-10 shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f] z-[19]">
            <div className="size-12 select-none">
                {/* Icon by Freepik */}
                {today?.event?.isEvent ? <img src={events[today.event.name].src} draggable="false" /> : <div></div>}
            </div>
            <div className="[&>*]:mx-1">
                <Link href="/docs" className="hover:text-[#FF0000]">
                    Documentations
                </Link>
                <a href="https://github.com/epfl-si/EPFL-Exchange-Exporter/" target="_blank" className="hover:text-[#FF0000]" id="SourceCode">
                    {translationHandler("source")}
                </a>
            </div>
            <span>
                v{packageConfig.version}
            </span>
        </footer>
    );
};

export default Footer;