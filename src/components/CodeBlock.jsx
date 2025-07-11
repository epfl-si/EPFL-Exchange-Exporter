"use client"

import CopyButton from "./CopyButton";
import { CodeBlock } from "react-code-block";

export default ({ code, language = "js" }) => {
    const prettyCode = JSON.stringify(JSON.parse(code), null, 2);
    return (
        // https://react-code-block.netlify.app/usage#showing-line-numbers
        <div className="flex border relative">
            <CodeBlock code={prettyCode} language={language}>
                <CodeBlock.Code className="bg-gray-900 p-6 rounded-xl shadow-lg h-96 max-h-96 overflow-hidden overflow-x-auto overflow-y-auto w-full">
                    <div className="table-row">
                        <CodeBlock.LineNumber className="table-cell pr-4 text-sm text-gray-500 text-right select-none" />
                        <CodeBlock.LineContent className="table-cell">
                        <CodeBlock.Token />
                        </CodeBlock.LineContent>
                    </div>
                </CodeBlock.Code>
            </CodeBlock>
            <div className="absolute right-0 m-4">
                <CopyButton link={prettyCode} copyColor={"#FFFFFF"}/>
            </div>
        </div>
    );
};