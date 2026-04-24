import React from 'react';
import { Type, LayoutTemplate, ArrowLeft } from 'lucide-react';
import FontSelect from '@/modules/resume-builder/components/FontSelect';
import { FONTS, getFontClass } from '@/shared/utils/fontUtils';

const StyleSettingsPanel = ({ formatting, onChange, onBack }) => {

    const handleSpacingChange = (e) => {
        onChange({ ...formatting, spacing_scale: parseFloat(e.target.value) });
    };

    const handleSectionSpacingChange = (e) => {
        onChange({ ...formatting, section_spacing: parseFloat(e.target.value) });
    };

    const handleParagraphSpacingChange = (e) => {
        onChange({ ...formatting, paragraph_spacing: parseFloat(e.target.value) });
    };

    const handleHeaderSpacingChange = (e) => {
        onChange({ ...formatting, header_spacing: parseFloat(e.target.value) });
    };

    const handleHeadingScaleChange = (e) => {
        onChange({ ...formatting, heading_scale: parseFloat(e.target.value) });
    };

    const handleSubheadingScaleChange = (e) => {
        onChange({ ...formatting, subheading_scale: parseFloat(e.target.value) });
    };

    const handleBodyScaleChange = (e) => {
        onChange({ ...formatting, body_scale: parseFloat(e.target.value) });
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-left-4 duration-300">

            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                        title="Back to Content"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <LayoutTemplate className="w-5 h-5 text-indigo-600" />
                        Styling
                    </h2>
                </div>
            </div>

            {/* Scrollable Settings */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                {/* Font Selection */}
                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                        <Type className="w-4 h-4" /> Font Family
                    </label>
                    <FontSelect
                        value={getFontClass(formatting.font_family)}
                        onChange={(e) => onChange({ ...formatting, font_family: e.target.value })}
                        fonts={FONTS}
                    />
                    <p className="text-xs text-slate-500 italic">The selected font applies to your entire resume</p>
                </div>

                {/* Spacing Controls */}
                <div className="space-y-8 pt-4 border-t border-slate-100">

                    {/* Overall Spacing */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                                Overall Scale
                            </label>
                            <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">
                                {(formatting.spacing_scale || 1.0).toFixed(1)}x
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.05"
                            value={formatting.spacing_scale || 1.0}
                            onChange={handleSpacingChange}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700"
                        />
                        <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                            <span>Compact</span>
                            <span>Spacious</span>
                        </div>
                    </div>

                    {/* Section Spacing */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                                Section Spacing
                            </label>
                            <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">
                                {(formatting.section_spacing || 1.0).toFixed(1)}x
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0.2"
                            max="5.0"
                            step="0.1"
                            value={formatting.section_spacing || 1.0}
                            onChange={handleSectionSpacingChange}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700"
                        />
                        <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                            <span>Tight</span>
                            <span>Loose</span>
                        </div>
                    </div>

                    {/* Header Spacing */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                                Header Spacing
                            </label>
                            <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">
                                {(formatting.header_spacing || 2.0).toFixed(1)}x
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="5.0"
                            step="0.1"
                            value={formatting.header_spacing !== undefined ? formatting.header_spacing : 2.0}
                            onChange={handleHeaderSpacingChange}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700"
                        />
                        <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                            <span>Tight</span>
                            <span>Loose</span>
                        </div>
                    </div>

                    {/* Paragraph Spacing */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                                Paragraph Spacing
                            </label>
                            <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">
                                {(formatting.paragraph_spacing || 0.5).toFixed(1)}rem
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="3.0"
                            step="0.05"
                            value={formatting.paragraph_spacing !== undefined ? formatting.paragraph_spacing : 0.5}
                            onChange={handleParagraphSpacingChange}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700"
                        />
                        <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                            <span>Tight</span>
                            <span>Relaxed</span>
                        </div>
                    </div>

                    {/* Heading Size */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                                Heading Size
                            </label>
                            <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">
                                {(formatting.heading_scale || 1.0).toFixed(1)}x
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0.8"
                            max="2.0"
                            step="0.05"
                            value={formatting.heading_scale !== undefined ? formatting.heading_scale : 1.0}
                            onChange={handleHeadingScaleChange}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700"
                        />
                        <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                            <span>Small</span>
                            <span>Large</span>
                        </div>
                    </div>

                    {/* Subheading Size */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                                Subheading Size
                            </label>
                            <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">
                                {(formatting.subheading_scale || 1.0).toFixed(1)}x
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0.8"
                            max="1.5"
                            step="0.05"
                            value={formatting.subheading_scale !== undefined ? formatting.subheading_scale : 1.0}
                            onChange={handleSubheadingScaleChange}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700"
                        />
                        <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                            <span>Small</span>
                            <span>Large</span>
                        </div>
                    </div>

                    {/* Body Size */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                                Body Size
                            </label>
                            <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">
                                {(formatting.body_scale || 1.0).toFixed(1)}x
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0.8"
                            max="1.5"
                            step="0.05"
                            value={formatting.body_scale !== undefined ? formatting.body_scale : 1.0}
                            onChange={handleBodyScaleChange}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700"
                        />
                        <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                            <span>Small</span>
                            <span>Large</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StyleSettingsPanel;
