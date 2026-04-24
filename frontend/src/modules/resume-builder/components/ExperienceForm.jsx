import { Loader2, Sparkles, Plus, Trash2, Calendar, Building2, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { parseAIResponse } from '@/shared/utils/aiParser';
import { useSelector, useDispatch } from 'react-redux';
import { updateItem, addItem, deleteItem, reorderItems, selectSectionItems, selectActiveItemId } from '@/modules/resume-builder/state/resumeSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import RichTextEditor from '@/modules/resume-builder/components/RichTextEditor';
import ValidatedInput from '@/modules/resume-builder/components/ValidatedInput';
import { SortableList } from '@/modules/resume-builder/components/SortableList';
import { SortableItem } from '@/modules/resume-builder/components/SortableItem';
import AIOptionsModal from '@/modules/resume-builder/components/AIOptionsModal';

const ExperienceForm = ({ data: legacyData = [], onChange, sectionId }) => {
  // REDUX INTEGRATION
  const dispatch = useDispatch();
  const reduxItems = useSelector(state => selectSectionItems(state, sectionId));
  
  // Prefer Redux data if available (and section exists in Redux).
  // If reduxItems is empty array but legacyData has items, it might mean Hydration hasn't happened yet 
  // or user deleted everything. 
  // But since we use useResumeSync, hydration should be fast.
  // We'll trust Redux if it returns an array.
  // Exception: Init state.
  const data = (reduxItems && reduxItems.length > 0) ? reduxItems : legacyData;
  const activeItemId = useSelector(selectActiveItemId);

  const [loadingIndex, setLoadingIndex] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // AI Modal State
  const [aiOptions, setAiOptions] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [targetIndex, setTargetIndex] = useState(null);

  const backendURL = import.meta.env.VITE_BASE_URL;

  // Ensure items have IDs for DnD
  useEffect(() => {
    if (data.some(item => !item.id && !item._id)) {
      const activeData = data.map(item => ({
        ...item,
        id: item.id || item._id || `temp-${Date.now()}-${Math.random()}`
      }));
      // Avoid infinite loop if data reference changes, only update if IDs missing
      if (JSON.stringify(activeData) !== JSON.stringify(data)) {
        onChange(activeData);
      }
    }
  }, [data.length]); // Only check when length changes to avoid loops

  useEffect(() => {
    if (activeItemId && data.some(item => item.id === activeItemId || item._id === activeItemId)) {
      setExpandedId(activeItemId);
      setTimeout(() => {
        const el = document.getElementById(`form-item-${activeItemId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [activeItemId, data]);

  /* REDUX + LEGACY DUAL WRITE */
  
  // Guard for Single Writer Rule
  const isApplyingAi = React.useRef(false);

  /* REDUX + LEGACY DUAL WRITE */
  
  const updateItemHandler = (index, field, value) => {
    // GUARD: Prevent updates if Modal is open for this item AND we are not explicitly applying AI
    if (showModal && targetIndex === index && !isApplyingAi.current) {
        console.warn(`[Control Boundary] Blocked premature update for item ${index} while AI modal is open.`);
        return;
    }

    const item = data[index];
    if (item && item.id) {
       dispatch(updateItem({ id: item.id, field, value }));
    }
    
    // Legacy Propagate
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const add = () => {
    const newId = `exp-${Date.now()}`;
    const newItem = {
        id: newId,
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        description: "",
        is_current: false
    };

    // Redux
    if (sectionId) {
        dispatch(addItem({ sectionId, item: newItem }));
    }

    // Legacy
    onChange([...data, newItem]);
    setExpandedId(newId);
  };

  const remove = (index) => {
    const item = data[index];
    if (item && item.id && sectionId) {
        dispatch(deleteItem({ sectionId, itemId: item.id }));
    }
    onChange(data.filter((_, idx) => idx !== index));
  };

  const handleDragChange = (newItems) => {
    // Redux Reorder
    if (sectionId) {
        const ids = newItems.map(i => i.id);
        dispatch(reorderItems({ sectionId, newOrder: ids }));
    }
    onChange(newItems);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const enhanceDescription = async (index, text) => {
    if (!text) return toast.error("Please provide a description first.");

    setLoadingIndex(index);
    try {
      const res = await axios.post(`${backendURL}/api/ai/enhance`,
        { text, type: "experience" },
        { withCredentials: true }
      );

      if (res.data.success) {
        // CORRECTION: Enforce Modal Boundary - Never auto-apply
        // Parse unstructured text into options array
        const rawOptions = res.data.options || res.data.enhancedText || res.data.text;
        const options = parseAIResponse(rawOptions);

        setAiOptions(options);
        setTargetIndex(index);
        setShowModal(true);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 403) {
        toast((t) => (
          <div className="flex flex-col gap-2">
            <span className="font-semibold">AI Limit Reached 🛑</span>
            <span className="text-sm">Upgrade to Premium for unlimited AI.</span>
            <button
              onClick={() => { toast.dismiss(t.id); window.location.href = "/pricing" }}
              className="bg-indigo-600 text-white px-3 py-1 text-xs rounded mt-1"
            >
              Upgrade Now
            </button>
          </div>
        ), { duration: 5000 });
      } else {
        toast.error("Failed to enhance text");
      }
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleOptionSelect = (option) => {
    if (targetIndex !== null) {
      // Allow update only through this transaction
      isApplyingAi.current = true;
      updateItemHandler(targetIndex, "description", option);
      isApplyingAi.current = false;
      
      toast.success("Description updated with AI selection!");
    }
    setShowModal(false);
    setTargetIndex(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-bold text-slate-800">Experience</h2>
        <p className="text-slate-500 mt-1">Detailed work history helps recruiters understand your background.</p>
      </div>

      <div className="space-y-4">
        <SortableList
          items={data.map(item => ({ ...item, id: item.id || item._id || item.tempId }))}
          onChange={handleDragChange}
          renderItem={(item, i) => (
            <SortableItem key={item.id} id={item.id}>
              <div id={`form-item-${item.id}`} className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all hover:border-blue-200 hover:shadow-sm">

                {/* Header / Summary View */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className={`p-4 flex justify-between items-center cursor-pointer ${expandedId === item.id ? 'bg-slate-50 border-b border-slate-100' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${expandedId === item.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg leading-tight">
                        {item.position || "Untitled Position"}
                      </h3>
                      {item.company && (
                        <p className="text-slate-500 text-sm">{item.company}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); remove(i); }}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                    {expandedId === item.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Form View */}
                {expandedId === item.id && (
                  <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-200">
                    <div className="grid md:grid-cols-2 gap-5 mb-5">
                      <ValidatedInput
                        label="Position Title"
                        value={item.position}
                        onChange={(e) => updateItemHandler(i, "position", e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                        startIcon={Briefcase}
                      />
                      <ValidatedInput
                        label="Company Name"
                        value={item.company}
                        onChange={(e) => updateItemHandler(i, "company", e.target.value)}
                        placeholder="e.g. Google"
                        startIcon={Building2}
                      />
                      <ValidatedInput
                        label="Location"
                        value={item.location}
                        onChange={(e) => updateItemHandler(i, "location", e.target.value)}
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 mb-5">
                      <ValidatedInput
                        label="Start Date"
                        type="month"
                        value={item.start_date}
                        onChange={(e) => updateItemHandler(i, "start_date", e.target.value)}
                        startIcon={Calendar}
                      />
                      <div className="space-y-2">
                        {!item.is_current ? (
                          <ValidatedInput
                            label="End Date"
                            type="month"
                            value={item.end_date}
                            onChange={(e) => updateItemHandler(i, "end_date", e.target.value)}
                            startIcon={Calendar}
                          />
                        ) : (
                          <div className="h-[74px] border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 text-sm font-medium">
                            Present
                          </div>
                        )}
                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer w-fit ml-1">
                          <input
                            type="checkbox"
                            checked={item.is_current || false}
                            onChange={(e) => {
                                const isChecked = e.target.checked;
                                
                                // REDUX UPDATES (Dispatch separately)
                                // We dispatch both to ensure granular field updates in Redux store
                                dispatch(updateItem({ id: item.id, field: "is_current", value: isChecked }));
                                if (isChecked) {
                                  dispatch(updateItem({ id: item.id, field: "end_date", value: null }));
                                }

                                // LEGACY/LOCAL UPDATE (Atomic to prevent race condition)
                                const updated = [...data];
                                updated[i] = { 
                                  ...updated[i], 
                                  is_current: isChecked,
                                  end_date: isChecked ? null : updated[i].end_date // Clear end date if current
                                };
                                onChange(updated);
                            }}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          I currently work here
                        </label>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700">Description</label>
                        <button
                          onClick={() => enhanceDescription(i, item.description)}
                          disabled={loadingIndex === i}
                          className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 px-3 py-1.5 rounded-full hover:from-violet-200 hover:to-fuchsia-200 border border-violet-200 transition-all shadow-sm disabled:opacity-70"
                        >
                          {loadingIndex === i ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          {loadingIndex === i ? "Enhancing..." : "Enhance with AI"}
                        </button>
                      </div>
                      <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all bg-white">
                        <RichTextEditor
                          value={item.description || ""}
                          onChange={(value) => updateItemHandler(i, "description", value)}
                          placeholder="Describe your key responsibilities and achievements..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SortableItem>
          )}
        />
      </div>

      <button
        onClick={add}
        className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-semibold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={20} /> Add Work Experience
      </button>
      <AIOptionsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        originalText={targetIndex !== null && data[targetIndex] ? data[targetIndex].description : ""}
        options={aiOptions || []}
        onSelect={handleOptionSelect}
      />
    </div>
  );
};

export default ExperienceForm;
