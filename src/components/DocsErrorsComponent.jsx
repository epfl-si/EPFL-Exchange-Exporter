import Link from "next/link";

export default ({ errors, translationHandler }) => {
    return (
        <div>
        {
            errors.map(err => {
                return (
                    <div key={err.code} ref={err.ref}>
                        <Link id={err.code} className="font-bold text-2xl hover:after:content-['_#'] hover:cursor-pointer my-4 hover:underline" href={`#${err.code}`}>{err.code}</Link>
                        <div className="m-4">
                            <h4 className="text-xl font-bold italic">{translationHandler(`errors.title`)}</h4>
                            <span>
                                {translationHandler(`errors.${err.code}.title`) || ""}
                            </span>
                            <h4 className="text-xl font-bold italic">{translationHandler(`errors.message`)}</h4>
                            <p>
                                {translationHandler(`errors.${err.code}.message`) || ""}
                            </p>
                            <h4 className="text-xl font-bold italic">{translationHandler(`errors.explanation`)}</h4>
                            <p>
                                {translationHandler(`errors.${err.code}.explanation`) || ""}
                            </p>
                        </div>
                    </div>
                )
            })
        }
        </div>
    );
};