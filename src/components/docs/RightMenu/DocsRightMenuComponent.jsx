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
                                <li key={docs.titleId} style={{ '--custom-color': color }} className={`overflow-hidden border-l-2 ${docs.titleId == doc ? `font-bold border-l-[var(--custom-color)]` : "border-l-gray-400"}`}>
                                    <Link className="group" href={docs.href}><div className="group-hover:bg-gray-300 pl-1">{translationHandler(docs.titleId)}</div></Link>
                                </li>
                            )
                        })
                    }
                </ol>
            </div>
        </div>
    );
};