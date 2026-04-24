import React, { useState } from 'react';
import { X, Briefcase, GraduationCap, FolderGit2, Code, PenTool, Award, Heart, BookOpen, Globe, UserCheck, MessageSquare } from 'lucide-react';

const AddSectionModal = ({ isOpen, onClose, onAddSection }) => {
    if (!isOpen) return null;

    const sections = [
        // NATIVE TYPES
        {
            id: 'experience',
            label: 'Work Experience',
            desc: 'Job history and diverse roles',
            icon: Briefcase,
            color: 'text-blue-600',
            preview: (
                <div className="space-y-2 opacity-50">
                    <div className="h-1.5 w-1/3 bg-current rounded-full mb-1"></div>
                    <div className="h-1 w-1/4 bg-current rounded-full mb-2"></div>
                    <div className="h-1 w-3/4 bg-gray-300 rounded-full"></div>
                    <div className="h-1 w-2/3 bg-gray-300 rounded-full"></div>
                </div>
            )
        },
        {
            id: 'education',
            label: 'Education',
            desc: 'Schools and degrees',
            icon: GraduationCap,
            color: 'text-purple-600',
            preview: (
                <div className="space-y-2 opacity-50">
                    <div className="flex justify-between">
                        <div className="h-1.5 w-1/3 bg-current rounded-full"></div>
                        <div className="h-1.5 w-8 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="h-1 w-1/2 bg-gray-300 rounded-full"></div>
                </div>
            )
        },
        {
            id: 'project',
            label: 'Projects',
            desc: 'Technical projects and case studies',
            icon: FolderGit2,
            color: 'text-emerald-600',
            preview: (
                <div className="space-y-2 opacity-50">
                    <div className="h-1.5 w-1/3 bg-current rounded-full mb-1"></div>
                    <div className="flex gap-1">
                        <div className="h-1 w-8 bg-gray-300 rounded-full"></div>
                        <div className="h-1 w-8 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="h-1 w-full bg-gray-300 rounded-full"></div>
                </div>
            )
        },
        {
            id: 'skills',
            label: 'Skills',
            desc: 'Technical and soft skills',
            icon: Code,
            color: 'text-teal-600',
            preview: (
                <div className="flex flex-wrap gap-1 opacity-50 pt-1">
                    <div className="h-4 w-8 bg-current rounded-md"></div>
                    <div className="h-4 w-10 bg-current rounded-md opacity-60"></div>
                    <div className="h-4 w-6 bg-current rounded-md opacity-40"></div>
                    <div className="h-4 w-9 bg-current rounded-md opacity-80"></div>
                </div>
            )
        },
        // CUSTOM MAPPED TYPES
        {
            id: 'custom',
            subType: 'Volunteering',
            label: 'Volunteering',
            desc: 'Non-profit and community work',
            icon: Heart,
            color: 'text-rose-500',
            preview: (
                <div className="space-y-2 opacity-50">
                    <div className="h-1.5 w-1/2 bg-current rounded-full"></div>
                    <div className="h-1 w-full bg-gray-300 rounded-full"></div>
                </div>
            )
        },
        {
            id: 'custom',
            subType: 'Certifications',
            label: 'Certifications',
            desc: 'Professional certificates',
            icon: Award,
            color: 'text-orange-500',
            preview: (
                <div className="space-y-2 opacity-50">
                    <div className="flex gap-2 items-center">
                        <div className="w-4 h-4 rounded-full bg-current opacity-60"></div>
                        <div className="h-1.5 w-2/3 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="w-4 h-4 rounded-full bg-current opacity-60"></div>
                        <div className="h-1.5 w-1/2 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
            )
        },
        {
            id: 'custom',
            subType: 'Languages',
            label: 'Languages',
            desc: 'Languages you speak',
            icon: Globe,
            color: 'text-sky-500',
            preview: (
                <div className="space-y-2 opacity-50 pt-2">
                    <div className="flex justify-between items-center">
                        <div className="h-1.5 w-1/3 bg-gray-300 rounded-full"></div>
                        <div className="w-10 h-1 bg-current rounded-full"></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="h-1.5 w-1/4 bg-gray-300 rounded-full"></div>
                        <div className="w-16 h-1 bg-current rounded-full opacity-60"></div>
                    </div>
                </div>
            )
        },
        {
            id: 'custom',
            subType: 'Awards',
            label: 'Awards',
            desc: 'Honors and recognition',
            icon: Award,
            color: 'text-yellow-500',
            preview: (
                <div className="flex justify-center items-center h-full opacity-50">
                    <div className="w-10 h-10 border-2 border-current rounded-full flex items-center justify-center">
                        <div className="w-1 h-4 bg-current"></div>
                    </div>
                </div>
            )
        },
        {
            id: 'custom',
            subType: 'Interests',
            label: 'Interests',
            desc: 'Hobbies and passions',
            icon: BookOpen, // Or any other suitable icon
            color: 'text-pink-500',
            preview: (
                <div className="flex gap-2 justify-center opacity-50 pt-2">
                    <div className="w-6 h-6 rounded-full bg-current opacity-40"></div>
                    <div className="w-6 h-6 rounded-full bg-current opacity-60"></div>
                    <div className="w-6 h-6 rounded-full bg-current"></div>
                </div>
            )
        },
        {
            id: 'custom',
            subType: 'References',
            label: 'References',
            desc: 'People who vouch for you',
            icon: UserCheck,
            color: 'text-indigo-500',
            preview: (
                <div className="space-y-2 opacity-50">
                    <div className="h-1.5 w-1/3 bg-current rounded-full"></div>
                    <div className="h-1 w-1/2 bg-gray-300 rounded-full"></div>
                </div>
            )
        },
        {
            id: 'custom', // Generic fallback
            label: 'Custom Section',
            desc: 'Create your own section',
            icon: PenTool,
            color: 'text-slate-500',
            preview: (
                <div className="border border-dashed border-current rounded-lg h-12 w-full flex items-center justify-center opacity-50">
                    <span className="text-xs font-bold">+</span>
                </div>
            )
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100 bg-white z-10">
                    <div className="text-center w-full">
                        <h2 className="text-2xl font-bold text-slate-800">Add a new section</h2>
                        <p className="text-slate-500 mt-1">Click on a section to add it to your resume</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Grid Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {sections.map((section, idx) => (
                            <button
                                key={idx}
                                onClick={() => onAddSection(section.id, section.subType)}
                                className="group relative bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 text-left flex flex-col h-48"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors uppercase text-sm">
                                        {section.label}
                                    </h3>
                                    {section.icon && (
                                        <section.icon className={`w-5 h-5 ${section.color} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform`} />
                                    )}
                                </div>

                                <div className="flex-1 w-full border-t border-slate-100 my-2 pt-3 group-hover:border-blue-50 transition-colors">

                                    {/* Mini Preview Area */}
                                    <div className={`w-full h-full ${section.color}`}>
                                        {section.preview}
                                    </div>

                                </div>

                                <p className="text-xs text-slate-400 font-medium mt-auto pt-2">{section.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddSectionModal;
