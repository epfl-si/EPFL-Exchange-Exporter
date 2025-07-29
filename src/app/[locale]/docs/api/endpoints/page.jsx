"use client";
import data from "/public/json/docs.json";

import DocsEndpointsComponent from "@/components/DocsEndpointsComponent";
import DocsSectionComponent from "@/components/DocsSectionComponent";

import { useTranslations } from "next-intl";
import { useState, useRef } from "react";

export default () => {

  const translationHandler = useTranslations(data.rootTranslationId);
  const [dataModified, setDataModified] = useState({ ...data, endpoints: data.endpoints.map(d => ({ ...d, refLateralMenu: useRef(null), ref: useRef(null) })).sort((a, b) => a.code.localeCompare(b.code)) });

  return (
    <main className="mb-auto">
      <h1 className="text-3xl my-6 mb-16 text-center">{translationHandler("title")}</h1>
      <DocsSectionComponent doc="api" data={dataModified.endpoints} color={"#FF0000"}>
        <div className="w-full">
          {
            <DocsEndpointsComponent data={dataModified}/>
          }
        </div>
      </DocsSectionComponent>
    </main>
  )
}