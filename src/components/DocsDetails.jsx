"use client"

import { useEffect, useState } from "react";

import CodeBlock from "@/components/CodeBlock";

const getMethodStyle = (method) => {
    switch (method) {
        case "GET":
            return "#61affe";
        case "POST":
            return "#49cc90";
        case "PUT":
            return "#fca130";
        case "DELETE":
            return "#f93e3e";
        default:
            return "#FF00FF";
    }
}

const callAPI = async (request, setterValue, setterLoading) => {
    console.log(request);
    let response = await fetch(`/api/${request}`).then((res) => res.json());
    console.log(response);
    setterValue(JSON.stringify(response));
    setterLoading(false);
}

export default ({ endpoint, ep }) => {
    // Object.entries(data).map((entry) => ({[entry[0]] : entry[1]}))
    const [code, setCode] = useState('{"message" : "API return here"}');
    const [isLoading, setIsLoading] = useState(false);
    const [paramsLabel, setParamsLabel] = useState([]);
    const [params, setParams] = useState([]);
    useEffect(() => {
        // const paramsLabel = [...ep.params.matchAll(/[&?](.*?)=/gm)].map((entry) => ({ [entry[0]]: entry[1] }));
        const paramsLabel = [...ep.params.matchAll(/[&?](.*?)=/gm)];
        const params = [...ep.params.matchAll(/={(.*?)}/gm)].map((entry) => ({ [entry[0]]: entry[1] }));
        setParamsLabel(paramsLabel);
        setParams(params);
    }, [])
    console.log(params);
    return (
        <details style={{ '--custom-color': getMethodStyle(ep.method), '--custom-bg-color': `${getMethodStyle(ep.method)}40` }}
            className="group bg-[var(--custom-bg-color)] w-auto mx-10 border border-[var(--custom-color)] rounded p-[0.5rem 0.5rem 0] my-2">
            <summary
                style={{ '--custom-color': getMethodStyle(ep.method) }}
                className="flex font-bold m-[-0.5rem, -0.5rem, 0] p-2 hover:cursor-pointer select-none
                group-open:border-b group-open:border-b-[var(--custom-color)]">
                <span
                    style={{ '--custom-color': `${getMethodStyle(ep.method)}B3` }}
                    className={`p-1 bg-[var(--custom-color)] mr-2 rounded-lg min-w-[5.5rem] text-center content-center`}>
                    {ep.method ? ep.method : "N/A"}
                </span>
                <span className="content-center font-mono w-full">
                    {endpoint.endpoint ? endpoint.endpoint + (ep.params ? ep.params : "") : "Invalid endpoint name"}
                </span>
                <div className="mx-auto w-full my-auto text-right flex justify-end">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 group-open:rotate-90 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </summary>
            <div>
            {
                ep.params.includes("?") ?
                <section>
                    <h4 className="bg-white bg-opacity-80 p-3 font-bold shadow-[0_1px_2px_#0000001a]">
                    Parameters
                    </h4>
                    <div className="grid grid-cols-2">
                    <div>
                        <div className="p-2">
                        {
                            // [...ep.params.matchAll(/[&?](.*?)=/gm)]
                            // .map(param =>
                            // {
                            //     return (
                                // <div key={param[1]}>
                                //     <input placeholder={param[1]} />
                                // </div>
                            //     )
                            // })
                            paramsLabel ?
                                paramsLabel.map(p => {
                                    return (
                                        <div key={p[1]}>
                                            <input type="text" placeholder={p[1]} />
                                        </div>
                                    )
                                })
                            :
                                <></>
                        }
                        </div>
                        <div>
                        <span>
                            {ep.params}
                        </span>
                        </div>
                    </div>
                    <div className="m-2">
                        <CodeBlock code={code} language="json" />
                        <div className="w-full text-center m-2">
                            <button className="bg-[#4990e2] p-1 rounded-md text-white font-bold hover:cursor-pointer flex mx-auto"
                                onClick={() => { setIsLoading(true); callAPI("/export?room=mail@example.com&start=2025-07-01&end=2025-07-11", setCode, setIsLoading) }}>
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
                                <label className="hover:cursor-pointer">execute</label>
                            </button>
                        </div>
                    </div>
                    </div>
                </section>
                :
                <></>
            }
            </div>
        </details>
    );
};