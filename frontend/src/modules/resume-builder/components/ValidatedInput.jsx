import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const ValidatedInput = ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    className = "",
    startIcon: StartIcon
}) => {
    const hasValue = value && value.toString().length > 0;

    // Helper to ensure HTML5 input compliance
    const getSafeValue = (inputType, rawValue) => {
        if (!rawValue) return "";

        if (inputType === 'month') {
            const strVal = rawValue.toString().trim();

            // Case 1: "YYYY" -> "YYYY-01"
            if (/^\d{4}$/.test(strVal)) {
                return `${strVal}-01`;
            }

            // Case 2: "Mon YYYY" or "Month YYYY" (e.g., "Dec 2020", "Sept 2025")
            // Simple regex to catch Month Name + Year
            const match = strVal.match(/^([a-zA-Z]+)\s+(\d{4})$/);
            if (match) {
                const monthName = match[1];
                const year = match[2];
                const date = new Date(`${monthName} 1, ${year}`);
                if (!isNaN(date.getTime())) {
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    return `${year}-${month}`;
                }
            }
        }
        return rawValue;
    };

    return (
        <div className={className}>
            {label && <label className="text-sm font-semibold text-slate-700 mb-2 block">{label}</label>}
            <div className="relative group">
                {StartIcon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <StartIcon size={18} />
                    </div>
                )}

                <input
                    type={type}
                    value={getSafeValue(type, value)}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full ${StartIcon ? 'pl-11' : 'px-5'} pr-10 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium bg-slate-50/30 focus:bg-white`}
                />

                <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${hasValue ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                    <CheckCircle2 className="text-green-500 bg-white rounded-full" size={20} fill="white" />
                </div>
            </div>
        </div>
    );
};

export default ValidatedInput;
