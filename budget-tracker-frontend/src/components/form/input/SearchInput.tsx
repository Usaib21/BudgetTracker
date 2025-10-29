// components/SearchInput.tsx
import React from 'react';

interface SearchInputProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
    placeholder = 'Search...',
    value,
    onChange,
    onSearch,
    className,
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };


    return (
        <div className={`col-span-4 ${className ?? ''}`}>
            <div className="relative">
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    id="searchInput"
                    className="dark:bg-dark-900 shadow-theme-xs h-11 w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-11 pl-4 text-sm text-gray-800 placeholder:text-gray-400 hover:border-purple-600 focus:ring-3 focus:outline-hidden xl:min-w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 focus:border-brand-300 focus:ring-brand-500/20 dark:focus:border-brand-800"
                    type="text"
                />

                <button
                    onClick={onSearch}
                    id="searchButton"
                    type="button"
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-transform duration-200 hover:scale-110 hover:text-green-600 dark:text-gray-400"
                >
                    <svg
                        className="fill-current"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                        />
                    </svg>
                </button>
            </div>

            {/* <div className="relative">
        <button
          className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 transition-transform duration-200 hover:scale-110 hover:text-green-600 dark:text-gray-400"
          onClick={onSearch}
        >
          <svg
            className="fill-current"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
              fill=""
            />
          </svg>
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`dark:bg-dark-900 shadow-theme-xs focus:ring-brand-500/10 h-11 w-full rounded-full border border-gray-300 bg-white py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 hover:border-purple-600 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${
            !isLoadingConfig && collegeName === 'Liberal'
              ? 'focus:border-brand-300 focus:ring-brand-500/20 dark:focus:border-brand-800'
              : 'focus:border-purple-300 focus:ring-purple-500/20 dark:focus:border-purple-800'
          }`}
        />
      </div> */}
        </div>
    );
};

export default SearchInput;
