import React, { useEffect, useRef } from 'react';

interface DropdownProps {
    name?: string;
    value: string;
    className?: string;
    open: boolean;
    close: () => void;
    children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({
    name,
    value,
    className = '',
    open,
    close,
    children,
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                close();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, close]);

    // Enhance children to close dropdown on selection
    const enhancedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            const element = child as React.ReactElement<any>;
            const type = element.type;
            // For native elements
            if (typeof type === 'string' && (type === 'button' || type === 'li' || type === 'a')) {
                const originalOnClick = element.props.onClick;
                return React.cloneElement(element, {
                    onClick: (...args: any[]) => {
                        if (typeof originalOnClick === 'function') {
                            originalOnClick(...args);
                        }
                        close();
                    },
                });
            }
            // For custom components
            if (typeof type !== 'string') {
                const originalOnClick = (element.props as any).onClick;
                return React.cloneElement(element, {
                    onClick: (...args: any[]) => {
                        if (typeof originalOnClick === 'function') {
                            originalOnClick(...args);
                        }
                        close();
                    },
                });
            }
        }
        return child;
    });


    return (
        <div ref={dropdownRef} className={`relative inline-block ${className}`}>
            <button
                onClick={close}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white ${'bg-brand-500 hover:bg-brand-600'
                    }`}
            >
                {name}
                <svg
                    className={`stroke-current duration-200 ease-in-out ${open ? 'rotate-180' : ''}`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4.79199 7.396L10.0003 12.6043L15.2087 7.396"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            {open && (
                <div className="shadow-theme-lg absolute top-[calc(100%+8px)] -left-30 z-40 mt-0 w-full min-w-[260px] rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-[#1E2635]">
                    <ul className="flex flex-col gap-1">{enhancedChildren}</ul>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
