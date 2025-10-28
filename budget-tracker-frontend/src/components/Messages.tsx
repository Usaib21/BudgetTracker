

import React, { useEffect, useState } from "react";
import type { FC } from 'react';

type MessageType = "success" | "error" | "warning" | "info";

interface MessageProps {
    type: MessageType;
    message: string;
    description?: string;
    duration?: number; // Default is 3000 ms
    onClose?: () => void;
}

const Message: FC<MessageProps> = ({
    type,
    message,
    // description,
    duration = 3000,
    onClose,
}) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    const typeStyles: Record<
        MessageType,
        {
            border: string;
            text: string;
            bgIcon: string;
            iconColor: string;
            iconPath: React.ReactNode;
        }
    > = {
        success: {
            border: "border-success-500",
            text: "text-success-600 dark:text-success-500",
            bgIcon: "bg-success-50 dark:bg-success-500/[0.15]",
            iconColor: "text-success-600 dark:text-success-500",
            iconPath: (
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.55078 12C3.55078 7.33417 7.3332 3.55176 11.999 3.55176C16.6649 3.55176 20.4473 7.33417 20.4473 12C20.4473 16.6659 16.6649 20.4483 11.999 20.4483C7.3332 20.4483 3.55078 16.6659 3.55078 12ZM11.999 2.05176C6.50477 2.05176 2.05078 6.50574 2.05078 12C2.05078 17.4943 6.50477 21.9483 11.999 21.9483C17.4933 21.9483 21.9473 17.4943 21.9473 12C21.9473 6.50574 17.4933 2.05176 11.999 2.05176ZM15.5126 10.6333C15.8055 10.3405 15.8055 9.86558 15.5126 9.57269C15.2197 9.27979 14.7448 9.27979 14.4519 9.57269L11.1883 12.8364L9.54616 11.1942C9.25327 10.9014 8.7784 10.9014 8.4855 11.1942C8.19261 11.4871 8.19261 11.962 8.4855 12.2549L10.6579 14.4273C10.7986 14.568 10.9894 14.647 11.1883 14.647C11.3872 14.647 11.578 14.568 11.7186 14.4273L15.5126 10.6333Z"
                />
            ),
        },
        error: {
            border: "border-red-500",
            text: "text-red-600 dark:text-red-400",
            bgIcon: "bg-red-100 dark:bg-red-400/[0.15]",
            iconColor: "text-red-600 dark:text-red-400",
            iconPath: (
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6 18L18 6M6 6l12 12"
                />
            ),
        },
        warning: {
            border: "border-yellow-500",
            text: "text-yellow-600 dark:text-yellow-400",
            bgIcon: "bg-yellow-100 dark:bg-yellow-400/[0.15]",
            iconColor: "text-yellow-600 dark:text-yellow-400",
            iconPath: (
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
                />
            ),
        },
        info: {
            border: "border-blue-500",
            text: "text-blue-600 dark:text-blue-400",
            bgIcon: "bg-blue-100 dark:bg-blue-400/[0.15]",
            iconColor: "text-blue-600 dark:text-blue-400",
            iconPath: (
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm.75 16h-1.5v-6h1.5v6zm0-8h-1.5V8h1.5v2z" />
            ),
        },
    };

    const { border, text, bgIcon, iconColor, iconPath } = typeStyles[type];

    return (
        <div className="fixed right-5 top-[10%] z-50">
            <div className="border-t border-gray-100 p-4 dark:border-gray-800 sm:p-6">
                <div
                    className={`flex items-center justify-between gap-3 w-full sm:max-w-[340px] rounded-md border-b-4 bg-white p-3 shadow-theme-sm dark:bg-[#1E2634] ${border}`}
                >
                    <div className="flex items-center gap-4">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconColor} ${bgIcon}`}
                        >
                            <svg
                                className="fill-current"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {iconPath}
                            </svg>
                        </div>
                        <h4 className={`sm:text-base text-sm ${text}`}>{message}</h4>
                    </div>
                    <button
                        className="text-gray-400 hover:text-gray-800 dark:hover:text-white/90"
                        onClick={() => {
                            setVisible(false);
                            onClose?.();
                        }}
                    >
                        <svg
                            className="fill-current"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                                fill=""
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Message;
