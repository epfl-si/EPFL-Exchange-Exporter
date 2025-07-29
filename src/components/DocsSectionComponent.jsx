import DocsRightMenuComponent from "./DocsRightMenuComponent";
import DocsLeftMenuComponent from "./DocsLeftMenuComponent";
export default ({ children, doc, data, color }) => {
    return (
        <section className="grid grid-cols-[auto_65%_auto] gap-1 m-2">
            <DocsLeftMenuComponent doc={doc} data={data} color={color}/>
            {children}
            <DocsRightMenuComponent doc={doc} color={color}/>
        </section>
    );
};