"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import LangSwitcher from "./LangSwitcher";

const Header = () =>{

    const [session, setSession] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // const session = useSession();

    // console.log(session);
    // console.log(session?.data);
    // console.log(session?.data?.user?.image);

    useEffect(() =>{
        const api = async() =>{
            let response = await fetch("/api/auth/session").then((res) => res.json());
            setSession(response);

            if (response?.user?.image){
                let response2 = await fetch(`https://graph.microsoft.com/v1.0/users/${response?.user?.email || ""}/photo/$value`, {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': `Bearer ${response.accessToken}`
                    })
                });

                if (response2.ok) {
                    const imageBlob = await response2.blob();
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    setImageUrl(imageObjectURL);
                }
            }
        }
        api();
    }, [])

    return (
        <header className="bg-white flex justify-between items-center gap-4 text-xl min-h-20 shadow-[0_3px_1px_-2px_#0003,_0_2px_2px_#00000024,_0_1px_5px_#0000001f] p-4 text-black z-20">
            <div className="flex pl-2">
                <img src="https://www.epfl.ch/wp-content/themes/wp-theme-2018/assets/svg/epfl-logo.svg" className="w-28 border-r border-r-[#c1c1c1] pr-4"/>
                <Link href={"/"} className="hover:text-[#FF0000] hover:cursor-pointer">
                    <h1 className="text-2xl hover:text-[#FF0000] hover:cursor-pointer pl-2 ml-1">
                        Exchange Exporter - EEE
                    </h1>
                </Link>
            </div>
            <div className="flex gap-3">
                {
                    !session ?
                    <LoginButton/>
                    :
                    <>
                        <span className="place-self-center">{session?.user?.email}</span>
                        <LogoutButton imageUrl={imageUrl} session={session}/>
                    </>
                }
                <LangSwitcher/>
            </div>
        </header>
    );
};

export default Header;