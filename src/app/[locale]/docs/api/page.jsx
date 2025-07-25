"use client";
import { useState } from "react";
// import { CodeBlock } from "react-code-block";
import DocsDetails from "@/components/DocsDetails";
import data from "/public/json/docs.json";

import { useTranslations } from "next-intl";

export default () => {

  const translationHandler = useTranslations(data.rootTranslationId);

  return (
    <main className="mb-auto">
      <h1 className="text-3xl my-6 text-center">{translationHandler("title")}</h1>
      <div className="w-screen">
        {
          data.endpoints.map(endpoint =>
            endpoint.values.map(ep =>
              <DocsDetails
                key={endpoint.endpoint ? endpoint.endpoint + ep.method : "Invalid endpoint name" + Math.round(Math.random() * 4096)}
                endpoint={endpoint}
                rootTranslationId={data.rootTranslationId}
                endpointTranslationPath={data.endpointTranslationPath}
                ep={ep} />
            )
          )
        }
      </div>
    </main>
  )
}