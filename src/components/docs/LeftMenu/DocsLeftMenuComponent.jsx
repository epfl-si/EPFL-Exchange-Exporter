import Link from "next/link";
import { useEffect, useState } from "react";

export default ({ doc, data, color }) => {

    const [highlightAtLaunch, setHighlightAtLaunch] = useState(true);

    useEffect(() => {
        const onScroll = e => {
        let datasInScreen = data.filter(
            d =>
            (d.ref.current.getBoundingClientRect().top >= 0 && d.ref.current.getBoundingClientRect().bottom <= window.innerHeight) ||
            (d.ref.current.getBoundingClientRect().top > 0 && d.ref.current.getBoundingClientRect().top < window.innerHeight && d.ref.current.getBoundingClientRect().bottom >= window.innerHeight) ||
            (d.ref.current.getBoundingClientRect().bottom <= window.innerHeight && d.ref.current.getBoundingClientRect().bottom > 0 && d.ref.current.getBoundingClientRect().top < 0) ||
            (d.ref.current.getBoundingClientRect().top <= 0 && d.ref.current.getBoundingClientRect().bottom >= window.innerHeight)
        );
        let dataInScreen = datasInScreen.sort(d => d.ref.current.getBoundingClientRect().bottom).reverse()[0];

        data.forEach(d => { d.refLateralMenu.current.classList.remove(`border-l-[var(--custom-color)]`); d.refLateralMenu.current.classList.remove("font-bold"); d.refLateralMenu.current.classList.add("border-l-gray-400");});

        dataInScreen.refLateralMenu.current.classList.remove("border-l-gray-400");
        dataInScreen.refLateralMenu.current.classList.add(`border-l-[var(--custom-color)]`);
        dataInScreen.refLateralMenu.current.classList.add("font-bold");
        };

        if (highlightAtLaunch) {
            setHighlightAtLaunch(false);
            onScroll();
        }

        window.addEventListener("scroll", onScroll);

        return () => window.removeEventListener("scroll", onScroll);
        console.log(data);
    }, []);

    return (
        <div id="lateralMenu" className="hidden sm:block">
            {(() => {
                switch (doc) {
                    case "errors":
                        return(
                            <>
                                <ol className="max-w-full break-words ml-6 fixed justify-center">
                                {
                                    data.map(err => {
                                    return (
                                        <li key={err.code} ref={err.refLateralMenu} style={{ '--custom-color': color }} className={`overflow-hidden border-l-2 border-l-[var(--custom-color)]`}>
                                            <Link href={`#${err.code}`} className="group"><div className="group-hover:bg-gray-300 pl-1">{err.code}</div></Link>
                                        </li>
                                    )
                                    })
                                }
                                </ol>
                            </>
                        )
                    default:
                        return (
                            <ol className="max-w-full break-words ml-6 fixed justify-center">
                            {
                                data.map(endpoint => {
                                return (
                                    <li key={endpoint.endpoint} ref={endpoint.refLateralMenu} style={{ '--custom-color': color }} className={`overflow-hidden border-l-2 border-l-[var(--custom-color)]`}>
                                        <Link href={`#${endpoint.endpoint.replace("/", "")}`} className="group"><div className="group-hover:bg-gray-300 pl-1">{endpoint.endpoint}</div></Link>
                                    </li>
                                )
                                })
                            }
                            </ol>
                        )
                }
            })()}
        </div>
    );
};