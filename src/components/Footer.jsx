"use client"

import { useEffect, useState } from "react";

const Footer = () =>{
    const [hour, setHour] = useState();
    useEffect(()=>{
        setHour(new Date(Date.now()).toLocaleString("en-GB").replace(",", ""));
    },[])
    return (
        <footer className="bg-white flex justify-center items-center gap-2 text-xl ml-6 mr-6 m-2 min-h-10 shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f] z-10">
            {hour ? `Données du ${hour}` : ""}
        </footer>
    );
};

export default Footer;