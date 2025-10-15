"use client"

import { useEffect, useState } from "react";

import CodeBlock from "@/components/docs/MiddleContent/utilities/CodeBlock";
import CopyButton from "../../../utilities/CopyButton";
import EndpointParameters from "./EndpointParameters";
import DocsParamsExplanation from "./DocsParamsExplanation";

import { themes } from 'prism-react-renderer';

import { useTranslations } from "next-intl";

const getMethodStyle = (method, opacity) => {
    opacity = opacity ? `0${ Math.round( ( 255 / 100 ) * opacity ).toString( 16 ) }`.slice( -2 ).toUpperCase() : "";
    switch (method) {
        case "GET":
            return `#61affe${opacity}`;
        case "POST":
            return `#49cc90${opacity}`;
        case "PUT":
            return `#fca130${opacity}`;
        case "DELETE":
            return `#f93e3e${opacity}`;
        default:
            return `#FF00FF${opacity}`;
    }
}

const callAPI = async (request, setterValue, setterLoading) => {
    let response = await fetch(`/api/${request}`).then((res) => res.json());
    setterValue(JSON.stringify(response));
    setterLoading(false);
}

export default ({ endpoint, ep, rootTranslationId, endpointTranslationPath }) => {

    const translationHandler = useTranslations(rootTranslationId);

    const initCode = `{"message" : "${translationHandler("return.placeholder")}"}`;
    const [code, setCode] = useState(initCode);
    const [isLoading, setIsLoading] = useState(false);
    const [params, setParams] = useState([]);
    const [endpointUrl, setEndpointUrl] = useState("/export");
    const [paramsKeyValue, setParamsKeyValue] = useState([]);
    const [headersKeyValue, setHeadersKeyValue] = useState([]);
    const [website, setWebsite] = useState("");
    const [id, setId] = useState("");
    const [separatorId, setSeparatorId] = useState("_");
    const [statusRequests, setStatusRequests] = useState(endpoint.status);

    useEffect(() => {
        // const paramsLabel = [...ep.params.matchAll(/[&?](.*?)=/gm)].map((entry) => ({ [entry[0]]: entry[1] }));
        // const paramsLabel = [...ep.params.matchAll(/[&?](.*?)=/gm)];
        const params = [...ep.endpoint.matchAll(/={(.*?)}/gm)].map((entry) => ({ [entry[0]]: entry[1] }));
        // const paramsKeyValue = [...ep.params.matchAll(/={(.*?)}/gm)].map((entry) => ({ [entry[1]]: "" }));
        const paramsKeyValue = [...ep.endpoint.matchAll(/={(.*?)}/gm)].map((entry) => ({"label": entry[1], "origin": entry[0].replace("=", ""), "value": ""}));
        setParams(params);
        setParamsKeyValue(ep.params.values.map(p => ({...p, value: ""})));
        setHeadersKeyValue(ep.headers.values.map(h => ({...h, value: ""})));
        setWebsite(`${window.location.protocol}//${window.location.host}`);
        setId(`${endpoint.endpoint.slice(1).replaceAll("/", "-")}${separatorId}${ep.method}`);
        // for (let i = 0; i < 50; i++){
        //     console.log(endpoint);
        // }
    }, [])
    useEffect(() => {
        let url = ep.endpoint;
        for (let i of paramsKeyValue) {
            url = url.replace(ep.params.open + i.name + ep.params.close, i.value);
        }
        setEndpointUrl(`/export${url}`);

    }, [paramsKeyValue])

    return (
        <details id={id} ref={endpoint.ref} style={{ '--custom-color': getMethodStyle(ep.method), '--custom-bg-color': getMethodStyle(ep.method, 25) }}
            className="group bg-[var(--custom-bg-color)] w-auto sm:mx-10 border border-[var(--custom-color)] rounded p-[0.5rem 0.5rem 0] my-2"
            // {...ep.isOpen == true ? { open : "" } : {}}>
            {...JSON.parse(ep.isOpen || "false") ? { open : "ep.isOpen" } : {}}>
            <summary
                style={{ '--custom-color': getMethodStyle(ep.method) }}
                className="flex font-bold m-[-0.5rem, -0.5rem, 0] p-2 hover:cursor-pointer select-none content-center items-center
                group-open:border-b group-open:border-b-[var(--custom-color)]">
                <span
                    style={{ '--custom-color': getMethodStyle(ep.method, 70) }}
                    className={`p-1 bg-[var(--custom-color)] mr-2 rounded-lg min-w-[5.5rem] text-center`}>
                    {ep.method ? ep.method : "N/A"}
                </span>
                {/* <div className="content-center font-mono mx-auto w-full "> */}
                <div className="mx-auto font-mono w-full mt-1 mb-[1px]">
                    {endpoint.endpoint ?
                        <>
                            <span>{endpoint.endpoint}</span>
                            <span className="font-normal">   {translationHandler(`${endpointTranslationPath}.${endpoint.endpoint}.${ep.method}.title`)}</span>
                        </>
                    :
                        <span>Invalid endpoint name</span>
                    }
                </div>
                <div className="my-auto text-right flex justify-end">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 group-open:rotate-90 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </summary>
            <div>
            {
                ep.endpoint.includes("?") ?
                <>
                    <section>
                        <h4 className="bg-white bg-opacity-70 p-3 font-bold shadow-[0_1px_2px_#0000001a]">
                            {translationHandler("parameters.title")}
                                </h4>
                                <div>
                                    {
                                        paramsKeyValue ?
                                            paramsKeyValue.map(p => {
                                                return (
                                                    // <span key={p.key}>{p.key}</span>
                                                    <DocsParamsExplanation key={p.key} params={p} translationHandler={translationHandler} paramsTranslationPath={`${endpointTranslationPath}.${endpoint.endpoint}.${ep.method}`} color={getMethodStyle(ep.method, 35)} />
                                                )
                                            })
                                        :
                                            <></>
                                    }
                                </div>
                    </section>
                    <section>
                        <h4 className="bg-white bg-opacity-70 p-3 font-bold shadow-[0_1px_2px_#0000001a]">
                            {translationHandler("headers.title")}
                                </h4>
                                <div>
                                    {
                                        headersKeyValue ?
                                            headersKeyValue.map(h => {
                                                return (
                                                    // <span key={p.key}>{p.key}</span>
                                                    <DocsParamsExplanation key={h.key} params={h} translationHandler={translationHandler} paramsTranslationPath={`${endpointTranslationPath}.${endpoint.endpoint}.${ep.method}`}/>
                                                )
                                            })
                                        :
                                            <></>
                                    }
                                </div>
                    </section>
                    <section>
                        <h4 className="bg-white bg-opacity-70 p-3 font-bold shadow-[0_1px_2px_#0000001a]">
                            {translationHandler("status.title")}
                        </h4>
                        <div className="m-2">
                            <span>
                                {translationHandler("status.description")}
                            </span>
                            <ul className="list-disc ml-8 my-4">
                                {
                                statusRequests ?
                                    statusRequests.map(status => {
                                        return (
                                            // <span key={p.key}>{p.key}</span>
                                            <li key={status}>{translationHandler(`status.${status}`)}</li>
                                        )
                                    })
                                :
                                    <></>
                                }
                            </ul>
                        </div>
                    </section>
                    {/* <section>
                        <h4 className="bg-white bg-opacity-70 p-3 font-bold shadow-[0_1px_2px_#0000001a]">
                            {translationHandler("return.error.title")}
                        </h4>
                        <div className="m-2">
                            <span>
                                {translationHandler("status.description")}
                            </span>
                            <ul className="list-disc ml-8 my-4">
                                {
                                    endpoint.return
                                }
                            </ul>
                        </div>
                    </section> */}
                    {
                        ep.return.map(r =>
                            <section key={r.id}>
                                <h4 className="bg-white bg-opacity-70 p-3 font-bold shadow-[0_1px_2px_#0000001a]">
                                    {translationHandler(`endpoints.${endpoint.endpoint}.${ep.method}.return.${r.id}.title`)}
                                </h4>
                                <div className="m-2">
                                    {/* <CodeBlock code={r.code} language="json" bg="transparent" theme={themes.gruvboxMaterialLight} /> */}
                                    {/* <CodeBlock code={r.code} language="json" bg="transparent" theme={themes.jettwaveLight} /> */}
                                    {/* <CodeBlock code={r.code} language="json" bg="transparent" theme={themes.nightOwlLight} /> */}
                                    {/* <CodeBlock code={r.code} language="json" bg="transparent" theme={themes.oneLight} /> */}
                                    {/* <CodeBlock code={r.code} language="json" bg="transparent" theme={themes.ultramin} /> */}
                                    <CodeBlock code={r.code} language="json" bg="transparent" theme={themes.vsLight} disabledScroll={true} maxHeight={"auto"} shadowless={true} copyButton={false} />
                                </div>
                            </section>
                        )
                    }
                    <section>
                        <h4 className="bg-white bg-opacity-70 p-3 font-bold shadow-[0_1px_2px_#0000001a]">
                            {translationHandler("console.title")}
                        </h4>
                        {/* <div style={{ '--custom-bg-color': `${getMethodStyle(ep.method)}40` }} className="bg-[var(--custom-bg-color)] flex">
                            <span className="text-center m-2 rounded-lg">
                                {website + "/api" + endpointUrl}
                            </span>
                            <span className="text-center m-2 rounded-lg">
                                {website + "/api" + endpointUrl}
                            </span>
                        </div> */}
                        <div style={{ '--custom-bg-color': getMethodStyle(ep.method, 25) }} className="flex flex-row items-center justify-end border bg-[var(--custom-bg-color)] rounded-lg m-2">
                            <div id="linkPreview" className="w-full mx-2 overflow-y-hidden overflow-x-auto bg-transparent focus:outline-none whitespace-nowrap py-[6px]">
                                <span className="font-bold">{ep.method}  </span>
                                <span>{website + "/api" + endpointUrl}</span>
                            </div>
                            <div>
                                <CopyButton link={website + "/api" + endpointUrl}/>
                            </div>
                        </div>
                        <div className="">
                            <div>
                                {/* <div className="p-2 w-fit"> */}
                                <div className="p-2">
                                {
                                    paramsKeyValue ?
                                    //     paramsKeyValue.map(p => {
                                    //         return (
                                    //             <EndpointParametersInput key={p.key} params={p.key} placeholder={p.placeholder} paramsKeyValue={paramsKeyValue} setParamsKeyValue={setParamsKeyValue} />
                                    //         )
                                    //     })
                                        <EndpointParameters key={paramsKeyValue} params={paramsKeyValue} paramsKeyValue={paramsKeyValue} setParamsKeyValue={setParamsKeyValue} getColor={getMethodStyle} methodHTTP={ep.method} color={getMethodStyle(ep.method)} borderColor={getMethodStyle(ep.method, 25)} translationHandler={translationHandler} />
                                    :
                                        <></>
                                }
                                </div>
                            </div>
                            <div className="m-2">
                                <CodeBlock id={`${id}${separatorId}console`} code={code} language="json" />
                                <div className="w-full text-center m-2 flex justify-center mx-auto">
                                    <button className="bg-[#4990e2] p-1 rounded-md text-white font-bold hover:cursor-pointer flex mx-2"
                                        onClick={() => { setIsLoading(true); callAPI(endpointUrl, setCode, setIsLoading); }}>
                                        {
                                            isLoading ?
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 animate-spin">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" stroke="#FFF" />
                                                </svg>
                                            :
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                        }
                                        <label className="hover:cursor-pointer">{translationHandler("console.button.launch.label")}</label>
                                    </button>
                                    <button className="bg-[#B51F1F] p-1 rounded-md text-white font-bold hover:cursor-pointer flex mx-2"
                                        onClick={() => { setCode(initCode); }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                        <label className="hover:cursor-pointer">{translationHandler("console.button.reset.label")}</label>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
                :
                <></>
            }
            </div>
        </details>
    );
};