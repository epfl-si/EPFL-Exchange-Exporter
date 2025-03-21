"use client";

import ExportComponent from "@/components/ExportComponent";
import Loading from "@/components/Loading";

import connect from "@/services/connect";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";


export default ({authSession}) =>{

    const session = useSession();

    // if (!authSession){
    //     connect();
    // }

    return (
        <>
            {
                !session?.data ?
                    <>
                        <h1>Bonjour</h1>
                    </>
                :
                    session?.status == "loading" ?
                        <Loading label="Connection à votre compte"/>
                    :
                        <div className="flex flex-col justify-center">
                            <ExportComponent authSession={session?.data}/>
                        </div>
            }
        </>
    );
};