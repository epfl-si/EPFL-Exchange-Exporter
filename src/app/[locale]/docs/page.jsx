"use client";

import Link from "next/link"
import { useTranslations } from "next-intl"
import { useState } from "react";

import data from "/public/json/docs.json";

export default () => {
  const translationHandler = useTranslations("Documentation");
  const [documentationElements, setDocumentationElements] = useState(data.documentations)
  return (
    <main className="mb-auto w-screen h-full">
      <h1 className="my-6 text-3xl text-center z-10 relative">{translationHandler("title")}</h1>
      <div className="absolute flex flex-wrap flex-row text-center justify-center items-center gap-4 h-screen right-0 left-0 top-0">
        {
          documentationElements.map(docElem => {
            return (
              <div className="size-32 hover:bg-gray-100" key={docElem.titleId}>
                <Link href={docElem.href} >
                  <div style={{ '--custom-color': docElem.color }} className={`border-2 border-[var(--custom-color)] p-2 rounded-lg size-32 flex justify-center items-center flex-col`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
                      <path strokeLinecap="round" strokeLinejoin="round" stroke={docElem.color} d={docElem.SVGPattern} />
                    </svg>
                    <span style={{ '--custom-color': docElem.color }} className={`text-[var(--custom-color)] font-bold text-2xl`}>
                      {translationHandler(`choices.${docElem.titleId}`)}
                    </span>
                  </div>
                </Link>
              </div>
            )
          })
        }
      </div>
    </main>
  )
}