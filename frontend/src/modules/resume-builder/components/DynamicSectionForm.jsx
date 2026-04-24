import React, { useState, useEffect } from "react";
import RichTextEditor from '@/modules/resume-builder/components/RichTextEditor';
import { Trash2, Plus, Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { parseAIResponse } from '@/shared/utils/aiParser';
import AIOptionsModal from '@/modules/resume-builder/components/AIOptionsModal';
import ValidatedInput from "@/modules/resume-builder/components/ValidatedInput";
import axios from 'axios';
import toast from 'react-hot-toast';
import { SortableList } from '@/modules/resume-builder/components/SortableList';
import { SortableItem } from '@/modules/resume-builder/components/SortableItem';
import { useDispatch, useSelector } from 'react-redux';
import { updateItem, addItem, deleteItem, reorderItems, selectSectionItems } from '@/modules/resume-builder/state/resumeSlice';

const fieldConfig = {
  experience: {
    company: { label: "Company Name", placeholder: "e.g. Google" },
    position: { label: "Job Title", placeholder: "e.g. Senior Software Engineer" },
    location: { label: "Location", placeholder: "e.g. New York, NY" },
    start_date: { label: "Start Date", type: "month" },
    end_date: { label: "End Date", type: "month" },
    is_current: { label: "I currently work here", type: "checkbox" },
    description: { label: "Description", type: "richtext" }
  },
  project: {
    name: { label: "Project Name", placeholder: "e.g. E-commerce Platform" },
    role: { label: "Your Role", placeholder: "e.g. Lead Developer" },
    tech: { label: "Technologies Used", placeholder: "e.g. React, Node.js, MongoDB" },
    link: { label: "Project Link", placeholder: "https://..." },
    description: { label: "Description", type: "richtext" }
  },
  education: {
    institution: { label: "Institution / University", placeholder: "e.g. Stanford University" },
    degree: { label: "Degree", placeholder: "e.g. Bachelor of Science" },
    field: { label: "Field of Study", placeholder: "e.g. Computer Science" },
    location: { label: "Location", placeholder: "e.g. London, UK" },
    graduation_date: { label: "Graduation Date", type: "month" },
    gpa: { label: "Percentage / GPA", placeholder: "e.g. 3.8/4.0" }
  },
  certifications: {
    name: { label: "Certification Name", placeholder: "e.g. AWS Certified Solutions Architect" },
    issuer: { label: "Issuing Organization", placeholder: "e.g. Amazon Web Services" },
    issue_date: { label: "Issue Date", type: "month" },
    credential_id: { label: "Credential ID", placeholder: "Optional" }
  },
  achievements: {
    title: { label: "Achievement Title", placeholder: "e.g. Hackathon Winner" },
    description: { label: "Description", type: "richtext" }
  },
  publications: {
    title: { label: "Publication Title", placeholder: "e.g. Advanced AI Algorithms" },
    publisher: { label: "Publisher", placeholder: "e.g. IEEE Journal" },
    year: { label: "Year", placeholder: "e.g. 2023" },
    link: { label: "Link", placeholder: "https://..." }
  },
  custom: {
    title: { label: "Item Title", placeholder: "e.g. Workshop on AI" },
    subtitle: { label: "Subtitle", placeholder: "e.g. Workshop Theme" },
    role: { label: "Role", placeholder: "e.g. Speaker" },
    location: { label: "Location", placeholder: "e.g. Remote / City" },
    start_date: { label: "Start Date", type: "month" },
    end_date: { label: "End Date", type: "month" },
    is_current: { label: "Ongoing / Present", type: "checkbox" },
    link: { label: "Link / URL", placeholder: "https://..." },
    description: { label: "Description", type: "richtext" }
  },
};

const DynamicSectionForm = ({ section, onChange, onTitleChange }) => {
  // REDUX INTEGRATION
  const dispatch = useDispatch();
  const reduxItems = useSelector(state => selectSectionItems(state, section.id));
  
  const [loadingState, setLoadingState] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  
  // AI Modal State
  const [aiOptions, setAiOptions] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [targetIndex, setTargetIndex] = useState(null);
  const [targetKey, setTargetKey] = useState(null);

  const backendURL = import.meta.env.VITE_BASE_URL;

  if (!section) return null;

  // Use Redux items if available, else legacy
  const data = (reduxItems && reduxItems.length > 0) ? reduxItems : (section.data || []);
  const type = section.type;
  const config = fieldConfig[type] || fieldConfig.custom;

  // Add IDs for DnD
  useEffect(() => {
    if (data.some(item => typeof item === 'object' && item !== null && (!item.id && !item._id))) {
      const activeData = data.map(item => {
        if (typeof item === 'object' && item !== null) {
          return { ...item, id: item.id || item._id || `temp-${Date.now()}-${Math.random()}` };
        }
        return item; // Primitives (skills/languages) handled differently
      });
      if (JSON.stringify(activeData) !== JSON.stringify(data)) {
        onChange(activeData);
      }
    }
  }, [data.length]);

  const updateItemHandler = (index, key, value) => {
    const item = data[index];
    if (item && item.id) {
       dispatch(updateItem({ id: item.id, field: key, value }));
    }
    
    // Legacy Propagate
    const updated = [...data];
    if (typeof updated[index] === 'object') {
      updated[index] = { ...updated[index], [key]: value };
    } else {
        updated[index] = value;
    }
    onChange(updated);
  };

  const handleItemChange = (index, key, value) => {
      updateItemHandler(index, key, value);
  };

  const addNewItem = () => {
    if (["skills", "languages", "interests"].includes(type)) {
      onChange([...data, ""]);
    } else {
      const newId = `cust-${Date.now()}`;
      const newItem = { id: newId };
      if (section.id) dispatch(addItem({ sectionId: section.id, item: newItem }));
      onChange([...data, newItem]);
      setExpandedId(newId);
    }
  };

  const removeItem = (index) => {
    const item = data[index];
    if (item && item.id && section.id) dispatch(deleteItem({ sectionId: section.id, itemId: item.id }));
    onChange(data.filter((_, i) => i !== index));
  };

  const handleDragChange = (newItems) => {
    if (section.id) {
        const ids = newItems.map(i => i.id);
        dispatch(reorderItems({ sectionId: section.id, newOrder: ids }));
    }
    onChange(newItems);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const enhanceDescription = async (index, key, text) => {
    if (!text) return toast.error("Please provide a description first.");

    const loaderKey = `${index}-${key}`;
    setLoadingState(prev => ({ ...prev, [loaderKey]: true }));

    try {
      const res = await axios.post(`${backendURL}/api/ai/enhance`,
        { text, type: section.type === "custom" ? "custom_section" : section.type },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Enforce Modal Boundary
        const rawOptions = res.data.options || res.data.enhancedText || res.data.text;
        const options = parseAIResponse(rawOptions);

        setAiOptions(options);
        setTargetIndex(index);
        setTargetKey(key);
        setShowModal(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to enhance text");
    } finally {
      setLoadingState(prev => ({ ...prev, [loaderKey]: false }));
    }
  };

  const handleOptionSelect = (option) => {
    if (targetIndex !== null && targetKey) {
        handleItemChange(targetIndex, targetKey, option);
        toast.success("Description updated with AI selection!");
    }
    setShowModal(false);
    setTargetIndex(null);
    setTargetKey(null);
  };

  // Special handling for simple list types (Skills, etc.)
  if (["skills", "languages", "interests"].includes(type)) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="border-b border-slate-100 pb-6">
          <h2 className="text-2xl font-bold text-slate-800">{section.title || type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          <p className="text-slate-500 mt-1">List your {type} here.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm hover:border-blue-300 transition-all">
              <input
                type="text"
                value={item || ""}
                onChange={(e) => {
                  const updated = [...data];
                  updated[index] = e.target.value;
                  onChange(updated);
                }}
                className="bg-transparent outline-none min-w-[100px] text-slate-700 font-medium"
                placeholder={`e.g. ${type === 'languages' ? 'English' : 'Java'}`}
              />
              <button onClick={() => removeItem(index)} className="text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={addNewItem}
            className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors font-medium"
          >
            <Plus size={18} /> Add
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Section Title Configuration (for Custom Sections) */}
      <div className="border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          {type === "custom" && onTitleChange ? (
            <input
              type="text"
              value={section.title || ""}
              onChange={(e) => onTitleChange(e.target.value)}
              className="bg-transparent border-b border-dashed border-slate-400 focus:border-blue-500 outline-none w-auto min-w-[200px]"
              placeholder="Custom Section Title"
            />
          ) : (
            section.title || type.charAt(0).toUpperCase() + type.slice(1)
          )}
        </h2>
        <p className="text-slate-500 mt-1">
          {type === "custom" ? "Define the content for this section." : `Add your ${type} details.`}
        </p>
      </div>

      {/* List of Items */}
      <div className="space-y-6">
        <SortableList
          items={data.map(item => ({ ...item, id: item.id || item._id || item.tempId || `temp-${Math.random()}` }))}
          onChange={handleDragChange}
          renderItem={(item, index) => {
            const titleField = Object.keys(config).find(k => k.includes('title') || k.includes('name') || k.includes('institution') || k.includes('company'));
            const subtitleField = Object.keys(config).find(k => k.includes('subtitle') || k.includes('role') || k.includes('degree') || k.includes('issuer') || k.includes('publisher'));

            const displayTitle = item[titleField] || "New Item";
            const displaySubtitle = item[subtitleField];

            return (
              <SortableItem key={item.id} id={item.id}>
                <div className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all hover:border-blue-200 hover:shadow-sm">
                  {/* Header / Summary View */}
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className={`p-4 flex justify-between items-center cursor-pointer ${expandedId === item.id ? 'bg-slate-50 border-b border-slate-100' : 'bg-white'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${expandedId === item.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-lg leading-tight">
                          {displayTitle}
                        </h4>
                        {displaySubtitle && (
                          <p className="text-slate-500 text-sm">{displaySubtitle}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                      {expandedId === item.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded Form */}
                  {expandedId === item.id && (
                    <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-200 grid gap-5">
                      {Object.entries(config).map(([key, field]) => {
                        if (field.type === "checkbox") {
                          return (
                            <label key={key} className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer w-fit select-none bg-white px-3 py-2 rounded-lg border border-slate-200">
                              <input
                                type="checkbox"
                                checked={item[key] || false}
                                onChange={(e) => handleItemChange(index, key, e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              {field.label}
                            </label>
                          );
                        }

                        if (field.type === "richtext") {
                          const isLoading = loadingState[`${index}-${key}`];
                          return (
                            <div key={key}>
                              <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-slate-700 block">{field.label}</label>
                                <button
                                  onClick={() => enhanceDescription(index, key, Array.isArray(item[key]) ? item[key].join('\n') : (item[key] || ""))}
                                  disabled={isLoading}
                                  className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 px-3 py-1.5 rounded-full hover:from-violet-200 hover:to-fuchsia-200 border border-violet-200 transition-all shadow-sm disabled:opacity-70"
                                >
                                  {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                  {isLoading ? "Enhancing..." : "Enhance with AI"}
                                </button>
                              </div>
                              <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all bg-white">
                                <RichTextEditor
                                  value={Array.isArray(item[key]) ? item[key].join('\n') : (item[key] || "")}
                                  onChange={(val) => handleItemChange(index, key, val)}
                                  placeholder={field.placeholder}
                                />
                              </div>
                            </div>
                          );
                        }

                        return (
                          <ValidatedInput
                            key={key}
                            label={field.label}
                            type={field.type || "text"}
                            value={item[key]}
                            onChange={(e) => handleItemChange(index, key, e.target.value)}
                            placeholder={field.placeholder}
                            className={field.type === "month" && key === "end_date" && item.is_current ? "opacity-50 pointer-events-none" : ""}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </SortableItem>
            )
          }}
        />
      </div>

      <button
        onClick={addNewItem}
        className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-semibold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={20} /> Add {type === 'custom' ? 'Item' : (type.charAt(0).toUpperCase() + type.slice(1))}
      </button>

      {/* AI Options Modal */}
      <AIOptionsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        originalText={
            targetIndex !== null && targetKey && data[targetIndex]
            ? (Array.isArray(data[targetIndex][targetKey]) 
                ? data[targetIndex][targetKey].join('\n') 
                : data[targetIndex][targetKey])
            : ""
        }
        options={aiOptions || []}
        onSelect={handleOptionSelect}
      />
    </div>
  );
};

export default DynamicSectionForm;
