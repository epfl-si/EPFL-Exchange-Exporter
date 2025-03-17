"use client";

import Loading from "@/components/Loading";

import { signOut } from "next-auth/react";


export default ({authSession}) =>{

    if (authSession){
        signOut();
    }

    return (
        <>
            {
                authSession ?
                <Loading label="Déconnexion de votre compte"/>
                :
                <h1>Vous avez bien été déconnecté</h1>
            }
        </>
    );
};