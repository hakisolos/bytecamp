import React from "react";

interface LogoTextProps {
    size?: "sm" | "md" | "lg"; // optional prop if you want different sizes
}

const LogoText: React.FC<LogoTextProps> = ({ size = "md" }) => {
    const sizeClasses = {
        sm: "text-2xl sm:text-3xl",
        md: "text-3xl sm:text-4xl",
        lg: "text-5xl sm:text-6xl",
    };

    const barHeightClasses = {
        sm: "h-6 sm:h-8",
        md: "h-6 sm:h-8",
        lg: "h-8 sm:h-10",
    };

    return (
        <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
            <div className="flex gap-1">
                <div className={`w-2 ${barHeightClasses[size]} bg-blue-600 rounded-full`}></div>
                <div className={`w-2 ${barHeightClasses[size]} bg-blue-500 rounded-full`}></div>
                <div className={`w-2 ${barHeightClasses[size]} bg-blue-400 rounded-full`}></div>
            </div>
            <h1 className={`font-bold text-gray-900 ${sizeClasses[size]} logo-text`}>
                Byte<span className="text-blue-600">Camp</span>
            </h1>
        </div>
    );
};

export { LogoText };
