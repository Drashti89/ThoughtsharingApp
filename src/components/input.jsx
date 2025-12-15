import { forwardRef } from "react";

const input = forwardRef(function input({label, textarea,...props }, ref){
    const classes="w-full px-4 py-3 border-2 border-stone-200 rounded-xl bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all duration-200 shadow-sm hover:shadow-md hover:border-stone-300"  ;
    return(
        <>
            <div className="flex flex-col gap-2 mb-6">

                <label className="text-sm font-semibold text-stone-700 tracking-wide">
                    {label}
                </label>

                {textarea ?
                (<textarea ref={ref} className={`${classes} min-h-[120px] resize-none`} {...props} /> )
                :
                ( <input ref={ref} className={classes} {...props} /> )}

            </div>
        </>
    );
});

export default input;