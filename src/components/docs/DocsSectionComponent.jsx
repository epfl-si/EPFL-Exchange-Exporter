import DocsRightMenuComponent from "./RightMenu/DocsRightMenuComponent";
import DocsLeftMenuComponent from "./LeftMenu/DocsLeftMenuComponent";
export default ({ children, doc, data, color }) => {
    return (
        <section className="sm:grid sm:grid-cols-[auto_70%_auto] sm:gap-1 m-2">
            <DocsLeftMenuComponent doc={doc} data={data} color={color}/>
            {children}
            <DocsRightMenuComponent doc={doc} color={color}/>
        </section>
    );
};