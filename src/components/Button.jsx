export default function Button({children, variant = "primary", ...props}){
    // Define different button styles
    const buttonStyles = {
        primary: "px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium",
        secondary: "px-6 py-3 rounded-lg bg-stone-700 text-stone-400 hover:bg-stone-600 hover:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
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