import DocsDetails from "@/components/DocsDetails";

export default ({data, endpointsArray}) =>{

    return (
        <>
            {
                data.endpoints.map(endpoint =>
                    endpoint.values.map(ep =>
                        <DocsDetails
                            key={endpoint.endpoint ? endpoint.endpoint + ep.method : "Invalid endpoint name" + Math.round(Math.random() * 4096)}
                            endpoint={endpoint}
                            rootTranslationId={data.rootTranslationId}
                            endpointTranslationPath={data.endpointTranslationPath}
                            ep={ep} />
                    )
                )
            }
        </>
    );
};