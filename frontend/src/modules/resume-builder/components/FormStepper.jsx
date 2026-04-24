import React from 'react';

const FormStepper = ({ steps, activeIndex, onStepClick }) => {
    return (
        <div className="w-full bg-white border-b border-gray-100 py-4 mb-8 sticky top-16 z-10 hidden md:block">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between relative">
                    {/* Progress Line Background */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-100 -z-10" />

                    {/* Progress Line Active */}
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-blue-500 -z-10 transition-all duration-300"
                        style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((step, index) => {
                        const isActive = index === activeIndex;
                        const isCompleted = index < activeIndex;

                        return (
                            <button
                                key={step.key}
                                onClick={() => onStepClick(index)}
                                className={`flex flex-col items-center gap-2 group focus:outline-none`}
                            >
                                <div
                                    className={`
                    w-4 h-4 rounded-full border-2 transition-all duration-300 relative
                    ${isActive || isCompleted ? 'border-blue-500 bg-white' : 'border-gray-300 bg-white'}
                  `}
                                >
                                    {/* Inner Dot for Active/Completed */}
                                    {(isActive || isCompleted) && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
                                    )}
                                </div>

                                <span className={`
                  text-sm font-medium transition-colors duration-300
                  ${isActive ? 'text-blue-600' : isCompleted ? 'text-gray-600' : 'text-gray-400'}
                `}>
                                    {step.label === "Personal Information" ? "Contacts" : step.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FormStepper;
