"use client"

import CopyButton from "../../../utilities/CopyButton";
import { CodeBlock } from "react-code-block";

export default ({ code, language = "js", id, bg, disabledScroll=false, maxHeight, copyButton=true, shadowless=false, ...attributes }) => {
    const prettyCode = JSON.stringify(JSON.parse(code), null, 2);
    return (
        // https://react-code-block.netlify.app/usage#showing-line-numbers
        <div className="flex relative rounded-xl" id={id}>
            <CodeBlock code={prettyCode} language={language} {...attributes} >
                <CodeBlock.Code className={`lg:text-lg text-sm ${bg ? `bg-${bg}` : "bg-gray-900"} p-6 rounded-xl ${shadowless ? "" : "shadow-lg"} ${maxHeight ? "lg:h-[maxHeight] lg:max-h-[maxHeight]" : "lg:h-96 lg:max-h-96 h-40 max-h-40"} overflow-hidden ${disabledScroll ? "" : "overflow-x-auto overflow-y-auto"} w-full`}>
                    <div className="table-row">
                        <CodeBlock.LineNumber className="table-cell pr-4 text-sm text-gray-500 text-right select-none" />
                        <CodeBlock.LineContent className="table-cell">
                        <CodeBlock.Token />
                        </CodeBlock.LineContent>
                    </div>
                </CodeBlock.Code>
            </CodeBlock>
            {
                copyButton ?
                    <div className="absolute right-0 m-4">
                        <CopyButton link={prettyCode} copyColor={"#FFFFFF"}/>
                    </div>
                :
                    <></>
            }
        </div>
    );
};