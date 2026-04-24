import React, { useState, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, GripVertical, Check } from "lucide-react";

// Sortable Item Component
const SortableSectionItem = ({ id, title }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`flex items-center gap-3 p-3 mb-2 bg-white border rounded-xl hover:border-blue-300 transition-all ${isDragging ? "shadow-lg scale-105 border-blue-500 bg-blue-50" : "border-slate-200"
                }`}
        >
            <GripVertical className="text-slate-400 cursor-grab active:cursor-grabbing" size={20} />
            <span className="font-semibold text-slate-700">{title}</span>
        </div>
    );
};

const ReorderSectionsModal = ({ isOpen, onClose, sections, order, onSave }) => {
    const [items, setItems] = useState(order);

    // Sync state when prop changes or modal opens
    useEffect(() => {
        if (isOpen) {
            setItems(order);
        }
    }, [isOpen, order]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSave = () => {
        onSave(items);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-800">Reorder Sections</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* List */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <p className="text-sm text-slate-500 mb-4">Drag and drop items to rearrange sections.</p>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={items} strategy={verticalListSortingStrategy}>
                            {items.map((id) => (
                                <SortableSectionItem
                                    key={id}
                                    id={id}
                                    title={sections[id]?.title || "Untitled Section"}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                    >
                        <Check size={18} />
                        Save Order
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ReorderSectionsModal;