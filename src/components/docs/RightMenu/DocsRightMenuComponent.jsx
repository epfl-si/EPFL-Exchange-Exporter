import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

import data from "/public/json/docs.json";

export default ({ doc, color }) => {

    const translationHandler = useTranslations("Documentation.choices");
    const [documentation, setDocumentation] = useState(doc);
    const [allDocs, setAllDocs] = useState(data.documentations);

    return (
        <div className="hidden sm:flex sm:justify-center">
            <div className="fixed">
                <span>{translationHandler("title")}</span>
                <ol>
                    {
                        allDocs.map(docs => {
                            return (
                                <li key={docs.titleId} style={{ '--custom-color': color }} className={`overflow-hidden border-l-2 pl-1 border-l-[var(--custom-color)] ${docs.titleId == doc ? `text-white font-bold bg-[var(--custom-color)]` : ""}`}>
                                    <Link className="hover:underline" href={docs.href}>{translationHandler(docs.titleId)}</Link>
                                </li>
                            )
                        })
                    }
                </ol>
            </div>
        </div>
    );
};