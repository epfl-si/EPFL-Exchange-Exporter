export default ({ params, translationHandler, paramsTranslationPath }) => {
    let translationPath = `${paramsTranslationPath}.params.${params.key}`;
    return (
        <div className="m-2">
            <h4 className="font-bold">
                {translationHandler(`${translationPath}.title`)}
            </h4>
            <p>
                {translationHandler(`${translationPath}.explanation`,
                    {
                        type: params.type,
                        format: params.format,
                        acceptedSynthax: params.acceptedSynthax.map(
                            (synthax, index) => `\`${synthax}\`${index == params.acceptedSynthax.length - 1 || params.acceptedSynthax.length <= 1 ?
                                "" :
                                index == params.acceptedSynthax.length - 2 ?
                                    " and " :
                                    ", "
                            }`
                        ).join("")
                    }
                )}
            </p>
        </div>
    );
};