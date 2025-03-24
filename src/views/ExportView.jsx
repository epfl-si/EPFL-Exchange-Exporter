"use client";

import About from "@/components/About";
import ExportComponent from "@/components/ExportComponent";
import Loading from "@/components/Loading";

import connect from "@/services/connect";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useTranslations } from "next-intl";


export default ({authSession}) =>{


    const session = useSession();

    const t = useTranslations("Loading");
    // if (!authSession){
    //     connect();
    // }

    return (
        <>
            {
                session?.status == "unauthenticated" ?
                    <>
                        <About/>
                    </>
                :
                    session?.status == "loading" ?
                        <Loading label={t("connect")}/> //"Connection à votre compte"
                    :
                        <div className="flex flex-col justify-center">
                            <ExportComponent authSession={session?.data}/>
                        </div>
            }
        </>
    );
};