"use client";

import { useTranslations } from "next-intl"

import data from "/public/json/docs.json";
import { useEffect, useRef, useState } from "react";

import DocsSectionComponent from "@/components/DocsSectionComponent";
import DocsErrorsComponent from "@/components/DocsErrorsComponent";

export default () => {
  const [color, setColor] = useState("#FF0000")
  const translationHandler = useTranslations("Documentation.errors");
  const [errors, setErrors] = useState(data.errors.map(d => ({ ...d, refLateralMenu: useRef(null), ref: useRef(null) })).sort((a, b) => a.code.localeCompare( b.code)));

  return (
    <main className="mb-auto w-screen">
      <h1 className="my-6 text-3xl text-center z-10 relative mb-16">{translationHandler("title")}</h1>
      <DocsSectionComponent doc="errors" data={errors} color={color}>
        <DocsErrorsComponent errors={errors} translationHandler={translationHandler}/>
      </DocsSectionComponent>
    </main>
  )
}