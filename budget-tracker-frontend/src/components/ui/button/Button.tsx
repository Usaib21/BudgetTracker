import React from "react";
import type { ReactNode } from 'react';


interface ButtonProps {
    children: ReactNode;
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "outline" | "secondary" | "ghost";
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset";
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    size = "md",
    variant = "primary",
    startIcon,
    endIcon,
    onClick,
    className = "",
    disabled = false,
    loading = false,
    type = "button",
    fullWidth = false,
}) => {
    // Size Classes
    const sizeClasses = {
        sm: "px-4 py-2.5 text-sm",
        md: "px-6 py-3.5 text-base",
        lg: "px-8 py-4 text-lg",
    };

    // Variant Classes
    const variantClasses = {
        primary:
            "bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl shadow-lg hover:shadow-orange-600/25 hover:scale-[1.02] active:scale-[0.98] disabled:bg-gray-400 disabled:shadow-none disabled:scale-100 transition-all duration-200",
        outline:
            "bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-500 dark:disabled:border-gray-700 transition-colors duration-200",
        secondary:
            "bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:disabled:bg-gray-700 dark:disabled:text-gray-500 transition-colors duration-200",
        ghost:
            "text-gray-700 rounded-xl hover:bg-gray-100 active:bg-gray-200 disabled:text-gray-400 dark:text-gray-300 dark:hover:bg-gray-800 dark:disabled:text-gray-500 transition-colors duration-200",
    };

    // Loading spinner component
    const LoadingSpinner = () => (
        <svg 
            className="animate-spin h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
        >
            <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
            />
            <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );

    // Default arrow icon for submit buttons
    const ArrowIcon = () => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform group-hover:translate-x-0.5"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.98481 2.44399C3.11333 1.57147 1.15325 3.46979 1.96543 5.36824L3.82086 9.70527C3.90146 9.89367 3.90146 10.1069 3.82086 10.2953L1.96543 14.6323C1.15326 16.5307 3.11332 18.4291 4.98481 17.5565L16.8184 12.0395C18.5508 11.2319 18.5508 8.76865 16.8184 7.961L4.98481 2.44399ZM3.34453 4.77824C3.0738 4.14543 3.72716 3.51266 4.35099 3.80349L16.1846 9.32051C16.762 9.58973 16.762 10.4108 16.1846 10.68L4.35098 16.197C3.72716 16.4879 3.0738 15.8551 3.34453 15.2223L5.19996 10.8853C5.21944 10.8397 5.23735 10.7937 5.2537 10.7473L9.11784 10.7473C9.53206 10.7473 9.86784 10.4115 9.86784 9.99726C9.86784 9.58304 9.53206 9.24726 9.11784 9.24726L5.25157 9.24726C5.2358 9.20287 5.2186 9.15885 5.19996 9.11528L3.34453 4.77824Z"
                fill="currentColor"
            />
        </svg>
    );

    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`
                inline-flex items-center justify-center gap-2 font-medium rounded-lg
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
                disabled:cursor-not-allowed disabled:opacity-60
                ${sizeClasses[size]}
                ${variantClasses[variant]}
                ${fullWidth ? "w-full" : ""}
                ${className}
                group
            `}
        >
            {/* Start Icon */}
            {startIcon && !loading && (
                <span className="flex items-center">{startIcon}</span>
            )}
            
            {/* Loading Spinner */}
            {loading && <LoadingSpinner />}
            
            {/* Button Text */}
            {children}
            
            {/* End Icon */}
            {!isDisabled && (
                <span className="flex items-center">
                    {endIcon || (type === "submit" && <ArrowIcon />)}
                </span>
            )}
        </button>
    );
};

export default Button;