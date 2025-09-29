export default ({ params, translationHandler, paramsTranslationPath, color }) => {
    let translationPath = `${paramsTranslationPath}.params.${params.key}`;
    return (
        <div className="m-2">
            <h4 className="font-bold">
                {translationHandler(`${translationPath}.title`)}
                <span className="text-red-600">{JSON.parse(params.required) ? " *" : ""}</span>
            </h4>
            <p>
                {translationHandler.rich(`${translationPath}.explanation`,
                    {
                        type: params.type,
                        format: params.format,
                        name: params.name,
                        isRequired: params.required,
                        acceptedSynthax: params.acceptedSynthax ? params.acceptedSynthax.map(
                            (synthax, index) =>
                                <span key={synthax}><span style={{ '--custom-bg-color': color }} className="border border-[var(--custom-bg-color)] p-[2px] rounded-lg bg-[var(--custom-bg-color)] bg-opacity-50">{synthax}</span><span>{index == params.acceptedSynthax.length - 1 || params.acceptedSynthax.length <= 1 ?
                                "" :
                                index == params.acceptedSynthax.length - 2 ?
                                    " and " :
                                    ", "
                                }</span></span>
                            )
                            : ""
                    }
                )
                }
            </p>
            <ul className="list-disc ml-8 my-4">
                {
                    params.keyArray ? params.keyArray.map(p =>
                        <li key={p}>
                            {p} ({translationHandler(`${translationPath}.keyArrayExplanation.${p}`)})
                        </li>
                    ) : <></>
                }
            </ul>
        </div>
    );
};