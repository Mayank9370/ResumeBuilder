import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export const SortableItem = ({ id, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.8 : 1,
        position: 'relative',
    };

    return (
        <div ref={setNodeRef} style={style} className={isDragging ? 'shadow-2xl ring-2 ring-blue-500/20 rounded-xl bg-white' : ''}>
            <div className="flex items-start gap-2">
                <button
                    className="mt-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded cursor-grab active:cursor-grabbing transition-colors"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical size={20} />
                </button>
                <div className="flex-1 w-full min-w-0">
                    {children}
                </div>
            </div>
        </div>
    );
};
