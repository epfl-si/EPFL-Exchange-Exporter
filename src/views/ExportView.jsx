"use client";

import About from "@/views/About";
import ExportComponent from "@/components/ExportComponent";
import Loading from "@/components/Loading";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";


export default () =>{

    const session = useSession();

    // const session = {
    //     status: "fre"
    // }

    const t = useTranslations("Loading");

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