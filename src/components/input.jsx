import { forwardRef } from "react";

const input = forwardRef(function input({label, textarea,...props }, ref){
    const classes="w-full px-4 py-3 border-2 rounded-lg border-gray-200 bg-white text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"  ;
    return(
        <>
            <div className="flex flex-col gap-2 my-3">

                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>

                {textarea ?
                (<textarea ref={ref} className={classes} {...props} /> )
                :
                ( <input ref={ref} className={classes} {...props} /> )}

            </div>
        </>
    );
});

export default input;