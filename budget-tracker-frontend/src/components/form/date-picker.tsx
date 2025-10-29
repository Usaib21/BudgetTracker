// import { useEffect } from "react";
// import flatpickr from "flatpickr";
// import "flatpickr/dist/flatpickr.css";
// import Label from "./Label";
// import { CalenderIcon } from "../../icons";
// import Hook = flatpickr.Options.Hook;
// import DateOption = flatpickr.Options.DateOption;

// type PropsType = {
//   id: string;
//   mode?: "single" | "multiple" | "range" | "time";
//   onChange?: Hook | Hook[];
//   defaultDate?: DateOption;
//   label?: string;
//   placeholder?: string;
// };

// export default function DatePicker({
//   id,
//   mode,
//   onChange,
//   label,
//   defaultDate,
//   placeholder,
// }: PropsType) {
//   useEffect(() => {
//     const flatPickr = flatpickr(`#${id}`, {
//       mode: mode || "single",
//       static: true,
//       monthSelectorType: "static",
//       dateFormat: "Y-m-d",
//       defaultDate,
//       onChange,
//     });

//     return () => {
//       if (!Array.isArray(flatPickr)) {
//         flatPickr.destroy();
//       }
//     };
//   }, [mode, onChange, id, defaultDate]);

//   return (
//     <div>
//       {label && <Label htmlFor={id}>{label}</Label>}

//       <div className="relative">
//         <input
//           id={id}
//           placeholder={placeholder}
//           className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
//         />

//         <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
//           <CalenderIcon className="size-6" />
//         </span>
//       </div>
//     </div>
//   );
// }

// // D:\College-Portal\college-portal\src\components\form\date-picker.tsx
'use client';
import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import type { Options } from 'flatpickr/dist/types/options';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';
import { CalenderIcon } from '../../icons';

interface DatePickerProps {
  id: string;
  name?: string;
  mode?: Options['mode'];
  onChange?: (value: string) => void;
  onBlur?: () => void;
  value?: string;
  defaultDate?: Options['defaultDate'];
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  id,
  name,
  mode = 'single',
  onChange,
  onBlur,
  value,
  defaultDate,
  label,
  placeholder,
  isRequired = false,
  isDisabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      flatpickrInstance.current = flatpickr(inputRef.current, {
        mode,
        static: true,
        monthSelectorType: 'static',
        dateFormat: 'Y-m-d',
        defaultDate: value || defaultDate,
        onChange: (selectedDates) => {
          if (onChange) {
            if (selectedDates.length > 0) {
              // Use local date string instead of UTC to avoid timezone offset
              const date = selectedDates[0];
              const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
              onChange(dateStr);
            } else {
              onChange(''); // Clear value if no date selected
            }
          }
        },
        onClose: () => {
          if (onBlur) onBlur(); // Trigger onBlur after value update
        },
      });

      // Sync controlled value with Flatpickr
      if (value !== undefined && flatpickrInstance.current) {
        flatpickrInstance.current.setDate(value, false);
      }

      return () => {
        flatpickrInstance.current?.destroy();
      };
    }
  }, [mode, value, defaultDate, onChange, onBlur]);


  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <input
          id={id}
          name={name}
          ref={inputRef}
          placeholder={placeholder}
          // className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow placeholder:text-gray-400 focus:outline-none focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
          className={`h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 focus:border-purple-300 focus:ring-purple-500/20 dark:focus:border-purple-800
          } ${value ? 'text-gray-800 dark:text-white/90' : 'text-gray-400 dark:text-gray-400'} `}
          required={isRequired}
          disabled={isDisabled}
        />
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
};

export default DatePicker;
