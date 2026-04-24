import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Lock, X } from "lucide-react";
import { reorderSections, selectAllSections } from "@/modules/resume-builder/state/resumeSlice";

// 🔒 Helper: Check if section is locked (backward compatible)
const isLocked = (section) => {
  if (!section) return false;
  // personal_info is always locked
  if (section.id === "personal_info") return true;
  // Support optional locked property for future extensions
  return section.locked === true;
};

/**
 * 🎯 PHASE 2 COMPONENT: Sortable Section Item
 * Individual draggable section in the reorder list
 */
const SortableSection = ({ section }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // 🔒 Check if section is locked using the global helper
  const locked = isLocked(section);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg ${
        locked
          ? "opacity-50 cursor-not-allowed"
          : "cursor-move hover:border-blue-400"
      }`}
    >
      {!locked && (
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
      )}
      {locked && <Lock className="w-5 h-5 text-gray-400" />}
      <div className="flex-1">
        <div className="font-medium text-gray-900">{section.title}</div>
        <div className="text-sm text-gray-500">{section.type}</div>
      </div>
      {locked && (
        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
          Fixed Position
        </span>
      )}
    </div>
  );
};

/**
 * 🎯 PHASE 2 COMPONENT: Section Reorder Modal
 * Drag-and-drop interface for reordering resume sections
 */
const SectionReorderModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const sections = useSelector(selectAllSections);
  const [localSections, setLocalSections] = useState(sections);

  // Reset local state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalSections(sections);
    }
  }, [isOpen, sections]);

  // 🔥 FIX 1: Filter out locked sections
  const reorderableSections = React.useMemo(() => {
    return sections.filter((s) => s && !isLocked(s));
  }, [sections]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Don't allow moving locked sections
    const activeSection = localSections.find(s => s.id === active.id);
    const overSection = localSections.find(s => s.id === over.id);
    
    if (isLocked(activeSection) || isLocked(overSection)) {
      console.warn("[SECTION REORDER] Cannot move locked sections");
      return;
    }

    setLocalSections((items) => {
      const oldIndex = items.findIndex((s) => s.id === active.id);
      const newIndex = items.findIndex((s) => s.id === over.id);

      // 🔥 FIX 2: Safety guards
      if (oldIndex === -1 || newIndex === -1) {
        console.warn("[SECTION REORDER] Invalid indices:", {
          oldIndex,
          newIndex,
        });
        return items;
      }

      // Prevent moving before personal_info (if it exists at index 0)
      if (newIndex === 0) return items;

      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleSave = () => {
    // 🔥 FIX 3: Validate sections before saving
    const validSections = localSections.filter((s) => s && s.id);

    if (validSections.length === 0) {
      console.error("[SECTION REORDER] No valid sections to save");
      return;
    }

    const newOrder = validSections.map((s) => s.id);

    // 🔥 FIX 4: Ensure personal_info is always first if it exists
    const personalInfoIndex = newOrder.indexOf("personal_info");
    if (personalInfoIndex > 0) {
      // Move personal_info to front
      newOrder.splice(personalInfoIndex, 1);
      newOrder.unshift("personal_info");
    }

    // 🎯 PHASE 2: Dispatch reorder action
    dispatch(reorderSections({ newOrder }));

    console.log("[SECTION REORDER] Saved new order:", newOrder);
    onClose();
  };

  const handleCancel = () => {
    setLocalSections(sections); // Reset to original
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Reorder Sections</h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="px-6 pt-4 pb-2 bg-blue-50 border-b border-blue-100">
          <p className="text-sm text-blue-800">
            <strong>Drag and drop</strong> sections to change their order on
            your resume. Personal Info must stay at the top and cannot be moved.
          </p>
        </div>

        {/* Sortable List */}
        <div className="flex-1 overflow-y-auto p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localSections}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {localSections.map((section) => (
                  <SortableSection key={section.id} section={section} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionReorderModal;
