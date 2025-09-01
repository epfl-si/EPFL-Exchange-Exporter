export default ({ params, translationHandler, paramsTranslationPath }) => {
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
                        acceptedSynthax:params.acceptedSynthax.map(
                            (synthax, index) =>
                                <span key={synthax}><span className="border border-red-700 p-[2px] rounded-lg bg-red-700 bg-opacity-50">{synthax}</span><span>{index == params.acceptedSynthax.length - 1 || params.acceptedSynthax.length <= 1 ?
                                "" :
                                index == params.acceptedSynthax.length - 2 ?
                                    " and " :
                                    ", "
                            }</span></span>
                        )
                    }
                )
                }
            </p>
        </div>
    );
};