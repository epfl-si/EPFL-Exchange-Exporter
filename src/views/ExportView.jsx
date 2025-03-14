"use client";

import ExportComponent from "@/components/ExportComponent";
import Loading from "@/components/Loading";

import connect from "@/services/connect";


export default ({authSession}) =>{

    if (!authSession){
        connect();
    }

    return (
        <>
            {
                !authSession ?
                <Loading label="Connection à votre compte"/>
                :
                <div className="flex flex-col justify-center">
                    <ExportComponent authSession={authSession}/>
                    {
                    authSession ?
                        <div className="flex flex-col text-center">
                            <span>Connected as {authSession?.user?.email}</span>
                        </div>
                    :
                    <></>
                    }
                </div>
            }
        </>
    );
};