// components/FilterSelect.tsx
import React from 'react';
import Select from '../Select';

interface FilterSelectProps {
    label?: string;
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
    label,
    options,
    value,
    onChange,
    placeholder = 'Select...',
    className = '',
}) => {
    return (
        <div className={`col-span-3 justify-center ${className}`}>
            {label && (
                <label
                    htmlFor={label?.toLowerCase()}
                    className="ml-5 text-center font-medium text-black dark:text-white"
                >
                    {label}
                </label>
            )}
            <div className="ml-1">
                <Select
                    name={label?.toLowerCase()}
                    id={label?.toLowerCase()}
                    value={value}
                    onChange={onChange}
                    options={options}
                    placeholder={placeholder}
                    className={`min-w-[150px] border-gray-300 bg-white hover:border-purple-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white ${value ? 'text-black' : 'text-gray-400'}`}
                />
            </div>
        </div>
    );
};

export default FilterSelect;
