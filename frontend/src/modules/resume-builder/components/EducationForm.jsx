// import { GraduationCap, Plus, Trash2 } from 'lucide-react';
// import React from 'react'

// const EducationForm = ({ data, onChange }) => {

// const addEducation = () =>{
//     const newEducation = {
//         institution: "",
//         degree: "",
//         field: "",
//         graduation_date: "",
//         gpa: ""
//     };
//     onChange([...data, newEducation])
// }

// const removeEducation = (index)=>{
//     const updated = data.filter((_, i)=> i !== index);
//     onChange(updated)
// }

// const updateEducation = (index, field, value)=>{
//     const updated = [...data];
//     updated[index] = {...updated[index], [field]: value}
//     onChange(updated)
// }

//   return (
//     <div className='space-y-6'>
//       <div className='flex items-center justify-between'>
//         <div>
//             <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'> Education </h3>
//             <p className='text-sm text-gray-500'>Add your education details</p>
//         </div>
//         <button onClick={addEducation} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'>
//             <Plus className="size-4"/>
//             Add Education
//         </button>
//       </div>

//       {data.length === 0 ? (
//         <div className='text-center py-8 text-gray-500'>
//             <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
//             <p>No education added yet.</p>
//             <p className="text-sm">Click "Add Education" to get started.</p>
//         </div>
//       ): (
//         <div className='space-y-4'>
//             {data.map((education, index)=>(
//                 <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
//                     <div className='flex justify-between items-start'>
//                         <h4>Education #{index + 1}</h4>
//                         <button onClick={()=> removeEducation(index)} className='text-red-500 hover:text-red-700 transition-colors'>
//                             <Trash2 className="size-4"/>
//                         </button>
//                     </div>

//                     <div className='grid md:grid-cols-2 gap-3'>

//                         <input value={education.institution || ""} onChange={(e)=>updateEducation(index, "institution", e.target.value)} type="text" placeholder="Institution Name" className="px-3 py-2 text-sm"/>

//                         <input value={education.degree || ""} onChange={(e)=>updateEducation(index, "degree", e.target.value)} type="text" placeholder="Degree (e.g., Bachelor's, Master's)" className="px-3 py-2 text-sm"/>

//                         <input value={education.field || ""} onChange={(e)=>updateEducation(index, "field", e.target.value)} type="text" className="px-3 py-2 text-sm" placeholder="Field of Study"/>

//                         <input value={education.graduation_date || ""} onChange={(e)=>updateEducation(index, "graduation_date", e.target.value)} type="month" className="px-3 py-2 text-sm"/>
//                     </div>

//                     <input value={education.gpa || ""} onChange={(e)=>updateEducation(index, "gpa", e.target.value)} type="text" className="px-3 py-2 text-sm" placeholder="GPA (optional)"/>

//                 </div>
//             ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export default EducationForm


import { GraduationCap, Plus, Trash2, Calendar, BookOpen, ChevronDown, ChevronUp, Loader2, Sparkles } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AIOptionsModal from '@/modules/resume-builder/components/AIOptionsModal';
import { parseAIResponse } from '@/shared/utils/aiParser';
import { useSelector, useDispatch } from 'react-redux';
import { updateItem, addItem, deleteItem, reorderItems, selectSectionItems, selectActiveItemId } from '@/modules/resume-builder/state/resumeSlice';
import ValidatedInput from '@/modules/resume-builder/components/ValidatedInput';
import { SortableList } from '@/modules/resume-builder/components/SortableList';
import { SortableItem } from '@/modules/resume-builder/components/SortableItem';
import RichTextEditor from '@/modules/resume-builder/components/RichTextEditor';

const EducationForm = ({ data: legacyData = [], onChange, sectionId }) => {
  // REDUX INTEGRATION
  const dispatch = useDispatch();
  const reduxItems = useSelector(state => selectSectionItems(state, sectionId));
  const data = (reduxItems && reduxItems.length > 0) ? reduxItems : legacyData;
  const activeItemId = useSelector(selectActiveItemId);

  const [expandedId, setExpandedId] = useState(null);
  
  // AI Modal State
  const [loadingIndex, setLoadingIndex] = useState(null);
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
  }, [data.length]);

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

  const updateItemHandler = (index, field, value) => {
    const item = data[index];
    if (item && item.id) {
       dispatch(updateItem({ id: item.id, field, value }));
    }
    
    // Legacy Propagate
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addEducation = () => {
    const newId = `edu-${Date.now()}`;
    const newItem = {
        id: newId,
        institution: "",
        degree: "",
        field: "",
        start_date: "",
        end_date: "",
        is_current: false,
        gpa: ""
    };

    if (sectionId) dispatch(addItem({ sectionId, item: newItem }));
    onChange([...data, newItem]);
    setExpandedId(newId);
  };

  const removeEducation = (index) => {
    const item = data[index];
    if (item && item.id && sectionId) dispatch(deleteItem({ sectionId, itemId: item.id }));
    onChange(data.filter((_, i) => i !== index));
  };

  const updateEducation = (index, field, value) => {
      // Use the handler
      updateItemHandler(index, field, value);
  };

  const handleDragChange = (newItems) => {
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
        { text, type: "education" },
        { withCredentials: true }
      );

      if (res.data.success) {
        const rawOptions = res.data.options || res.data.enhancedText || res.data.text;
        const options = parseAIResponse(rawOptions);

        setAiOptions(options);
        setTargetIndex(index);
        setShowModal(true);
      }
    } catch (error) {
       console.error(error);
       toast.error("Failed to enhance text");
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleOptionSelect = (option) => {
    if (targetIndex !== null) {
      updateItemHandler(targetIndex, "description", option);
      toast.success("Description updated with AI selection!");
    }
    setShowModal(false);
    setTargetIndex(null);
  };

  return (
    <div className='space-y-8 animate-in fade-in duration-500'>
      <div className='border-b border-slate-100 pb-6'>
        <h3 className='text-2xl font-bold text-slate-800'>Education</h3>
        <p className='text-slate-500 mt-1'>Add your academic background and qualifications.</p>
      </div>

      <div className='space-y-6'>
        <SortableList
          items={data.map(item => ({ ...item, id: item.id || item._id || item.tempId }))}
          onChange={handleDragChange}
          renderItem={(education, index) => (
            <SortableItem key={education.id} id={education.id}>
              <div id={`form-item-${education.id}`} className='border border-slate-200 rounded-xl bg-white overflow-hidden transition-all hover:border-blue-200 hover:shadow-sm'>

                {/* Header / Summary View */}
                <div
                  onClick={() => toggleExpand(education.id)}
                  className={`p-4 flex justify-between items-center cursor-pointer ${expandedId === education.id ? 'bg-slate-50 border-b border-slate-100' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${expandedId === education.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-lg leading-tight">
                        {education.institution || "New Education"}
                      </h4>
                      {education.degree && (
                        <p className="text-slate-500 text-sm">{education.degree} {education.field ? `in ${education.field}` : ''}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); removeEducation(index); }}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                    {expandedId === education.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Form View */}
                {expandedId === education.id && (
                  <div className='p-6 bg-white animate-in slide-in-from-top-2 duration-200'>
                    <div className='grid md:grid-cols-2 gap-5 mb-5'>
                      <ValidatedInput
                        label="Institution/University"
                        placeholder='e.g. Stanford University'
                        value={education.institution}
                        onChange={(e) => updateEducation(index, "institution", e.target.value)}
                        startIcon={GraduationCap}
                      />

                      <ValidatedInput
                        label="Degree"
                        placeholder="e.g. Bachelor's of Science"
                        value={education.degree}
                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                        startIcon={BookOpen}
                      />

                      <ValidatedInput
                        label="Field of Study"
                        placeholder='e.g. Computer Science'
                        value={education.field}
                        onChange={(e) => updateEducation(index, "field", e.target.value)}
                      />

                      <ValidatedInput
                        label="Location"
                        placeholder='e.g. New York, NY'
                        value={education.location}
                        onChange={(e) => updateEducation(index, "location", e.target.value)}
                      />

                      {/* Dates Row */}
                      <ValidatedInput
                        label="Start Date"
                        type='month'
                        value={education.start_date}
                        onChange={(e) => updateEducation(index, "start_date", e.target.value)}
                        startIcon={Calendar}
                      />

                      <div className="space-y-2">
                        {!education.is_current ? (
                          <ValidatedInput
                            label="End Date"
                            type='month'
                            value={education.end_date}
                            onChange={(e) => updateEducation(index, "end_date", e.target.value)}
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
                            checked={education.is_current || false}
                            onChange={(e) => updateEducation(index, "is_current", e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          Currently Studying
                        </label>
                      </div>
                    </div>

                    <ValidatedInput
                      label="Percentage / CGPA (Optional)"
                      placeholder='e.g. 3.8/4.0 or 85%'
                      value={education.gpa}
                      onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                    />

                    {/* NEW: Description Field */}
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700">Additional Details / Achievements</label>
                        <button
                          onClick={() => enhanceDescription(index, education.description)}
                          disabled={loadingIndex === index}
                          className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 px-3 py-1.5 rounded-full hover:from-violet-200 hover:to-fuchsia-200 border border-violet-200 transition-all shadow-sm disabled:opacity-70"
                        >
                          {loadingIndex === index ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          {loadingIndex === index ? "Enhancing..." : "Enhance with AI"}
                        </button>
                      </div>
                      <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all bg-white">
                        <RichTextEditor
                          value={education.description || ""}
                          onChange={(value) => updateEducation(index, "description", value)}
                          placeholder="Describe academic achievements, societies, or key coursework..."
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

      {data.length === 0 && (
        <div className='text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200'>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300">
            <GraduationCap className="size-8" />
          </div>
          <p className="text-slate-500 font-medium">No education added yet</p>
        </div>
      )}

      <button
        onClick={addEducation}
        className='w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-semibold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2'
      >
        <Plus size={20} /> Add Education
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

export default EducationForm;
