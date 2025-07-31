"use client";

import About from "@/views/About";
import ExportComponent from "@/components/export/ExportComponent";
import Loading from "@/components/tasks/Loading";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";


export default () =>{

    const session = useSession();

    // const session = {
    //     status: "fre"
    // }

    const translationHandler = useTranslations("Loading");

    return (
        <>
            {
                session?.status == "unauthenticated" ?
                    <>
                        <About/>
                    </>
                :
                    session?.status == "loading" ?
                        <Loading label={translationHandler("connect")}/> //"Connection à votre compte"
                    :
                        <div className="flex flex-col justify-center">
                            <ExportComponent authSession={session?.data}/>
                        </div>
            }
        </>
    );
};