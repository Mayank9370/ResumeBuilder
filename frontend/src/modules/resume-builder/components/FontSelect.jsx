import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Search, Type } from 'lucide-react';

const FontSelect = ({ value, onChange, fonts }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search when opening
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const filteredFonts = fonts.filter(font => 
        font.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (fontValue) => {
        // Create synthetic event to match original select interface
        onChange({ target: { value: fontValue } });
        setIsOpen(false);
        setSearchTerm('');
    };

    const currentFont = fonts.find(f => f.value === value) || fonts[0];

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-left"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                        <Type size={16} />
                    </div>
                    <span className="truncate" style={{ fontFamily: currentFont?.value }}>
                        {currentFont?.name || value}
                    </span>
                </div>
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[400px]">
                    
                    {/* Search Bar */}
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50 sticky top-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search fonts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Groups / List */}
                    <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
                        {filteredFonts.length > 0 ? (
                            filteredFonts.map((font) => {
                                const isSelected = font.value === value;
                                return (
                                    <button
                                        key={font.value}
                                        onClick={() => handleSelect(font.value)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors group ${
                                            isSelected 
                                                ? 'bg-indigo-50 text-indigo-700' 
                                                : 'hover:bg-slate-50 text-slate-700'
                                        }`}
                                    >
                                        <div className="flex flex-col">
                                            <span 
                                                className="text-base leading-tight"
                                                style={{ fontFamily: font.value }}
                                            >
                                                {font.name}
                                            </span>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                                                {font.category || 'Font'}
                                            </span>
                                        </div>
                                        {isSelected && <Check size={16} className="text-indigo-600" />}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="p-4 text-center text-sm text-slate-500 italic">
                                No fonts found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FontSelect;
