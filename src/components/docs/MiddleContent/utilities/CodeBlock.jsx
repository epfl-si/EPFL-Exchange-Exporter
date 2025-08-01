"use client"

import CopyButton from "../../../utilities/CopyButton";
import { CodeBlock } from "react-code-block";

export default ({ code, language = "js", id }) => {
    const prettyCode = JSON.stringify(JSON.parse(code), null, 2);
    return (
        // https://react-code-block.netlify.app/usage#showing-line-numbers
        <div className="flex border relative rounded-xl" id={id}>
            <CodeBlock code={prettyCode} language={language}>
                <CodeBlock.Code className="lg:text-lg text-sm bg-gray-900 p-6 rounded-xl shadow-lg lg:h-96 lg:max-h-96 h-40 max-h-40 overflow-hidden overflow-x-auto overflow-y-auto w-full">
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