"use client";

import Loading from "@/components/Loading";

import { signOut } from "next-auth/react";

import { useTranslations } from "next-intl";

export default ({authSession}) =>{

    if (authSession){
        signOut();
    }

    const t = useTranslations("LogOutPage");

    return (
        <>
            {
                authSession ?
                <Loading label="Déconnexion de votre compte"/>
                :
                <h1>{t("title")}</h1>
            }
        </>
    );
};