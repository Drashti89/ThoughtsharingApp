export default function Button({children, variant = "primary", ...props}){
    // Define different button styles
    const buttonStyles = {
        primary: "px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow-md font-semibold",
        secondary: "px-6 py-3 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow-md font-semibold",
        danger: "px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
    };
    
    const className = buttonStyles[variant] || buttonStyles.primary;
    
    return (
        <>
            <button className={className}
                    {...props}>
               {children}
            </button>
        </>
    );
}