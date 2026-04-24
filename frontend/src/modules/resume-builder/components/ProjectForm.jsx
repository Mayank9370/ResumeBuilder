import { Plus, Trash2, FolderGit2, Link as LinkIcon, Calendar, Briefcase, Code2, Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { parseAIResponse } from '@/shared/utils/aiParser';
import AIOptionsModal from '@/modules/resume-builder/components/AIOptionsModal';
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { updateItem, addItem, deleteItem, reorderItems, selectSectionItems, selectActiveItemId } from '@/modules/resume-builder/state/resumeSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import RichTextEditor from '@/modules/resume-builder/components/RichTextEditor';
import ValidatedInput from '@/modules/resume-builder/components/ValidatedInput';
import { SortableList } from '@/modules/resume-builder/components/SortableList';
import { SortableItem } from '@/modules/resume-builder/components/SortableItem';

const emptyProject = {
  name: "",
  type: "",
  role: "",
  tech: "",
  start_date: "",
  end_date: "",
  is_current: false,
  link: "",
  location: "",
  description: "",

};

const ProjectForm = ({ data: legacyData = [], onChange, sectionId }) => {
  // REDUX INTEGRATION
  const dispatch = useDispatch();
  const reduxItems = useSelector(state => selectSectionItems(state, sectionId));
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
      // Avoid infinite loop
      if (JSON.stringify(activeData) !== JSON.stringify(data)) {
        onChange(activeData);
      }
    }
  }, [data.length]); // Removed the block that forced an empty project

  useEffect(() => {
    console.log('ProjectForm useEffect fired - activeItemId:', activeItemId, 'items:', data.map(p => p.id));
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

  const enhanceDescription = async (index, text) => {
    if (!text) return toast.error("Please provide a description first.");

    setLoadingIndex(index);
    try {
      const res = await axios.post(`${backendURL}/api/ai/enhance`,
        { text, type: "project" },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Enforce Modal Boundary
        const rawOptions = res.data.options || res.data.enhancedText || res.data.text;
        const options = parseAIResponse(rawOptions);

        setAiOptions(options);
        setTargetIndex(index);
        setShowModal(true);
      }
    } catch (error) {
       // ... error handling
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

  const addProject = () => {
    const newId = `proj-${Date.now()}`;
    const newItem = { ...emptyProject, id: newId };
    
    if (sectionId) dispatch(addItem({ sectionId, item: newItem }));
    onChange([...data, newItem]);
    setExpandedId(newId);
  };

  const removeProject = (index) => {
    const item = data[index];
    if (item && item.id && sectionId) dispatch(deleteItem({ sectionId, itemId: item.id }));
    onChange(data.filter((_, i) => i !== index));
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

  const updateProject = (index, field, value) => {
      updateItemHandler(index, field, value);
  };



  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-bold text-slate-800">Projects</h2>
        <p className="text-slate-500 mt-1">Showcase your work, personal projects, or contributions.</p>
      </div>

      <div className="space-y-6">
        <SortableList
          items={data.map(item => {
              // Ensure ID exists for SortableList
              const stableId = item.id || item._id || item.tempId || `temp-${Math.random()}`;
              return { ...item, id: stableId };
          })}
          onChange={handleDragChange}
          renderItem={(project, index) => (
            <SortableItem key={project.id} id={project.id}>
              <div
                id={`form-item-${project.id}`}
                className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all hover:border-blue-200 hover:shadow-sm"
              >
                {/* Header / Summary View */}
                <div
                  onClick={() => toggleExpand(project.id)}
                  className={`p-4 flex justify-between items-center cursor-pointer ${expandedId === project.id ? 'bg-slate-50 border-b border-slate-100' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${expandedId === project.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-lg leading-tight">
                        {project.name || "New Project"}
                      </h4>
                      {project.type && (
                        <p className="text-slate-500 text-sm">{project.type}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); removeProject(index); }}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                    {expandedId === project.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Form */}
                {expandedId === project.id && (
                  <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-200">
                    <div className="grid md:grid-cols-2 gap-5 mb-5">
                      <ValidatedInput
                        label="Project Name"
                        value={project.name}
                        onChange={(e) => updateProject(index, "name", e.target.value)}
                        placeholder="e.g. E-Commerce Platform"
                        startIcon={FolderGit2}
                      />
                      <ValidatedInput
                        label="Project Type"
                        value={project.type}
                        onChange={(e) => updateProject(index, "type", e.target.value)}
                        placeholder="e.g. Personal, Freelance, Academic"
                        startIcon={Briefcase}
                      />
                      <ValidatedInput
                        label="Your Role"
                        value={project.role}
                        onChange={(e) => updateProject(index, "role", e.target.value)}
                        placeholder="e.g. Lead Developer"
                        startIcon={Briefcase}
                      />
                      <ValidatedInput
                        label="Tech Stack"
                        value={project.tech}
                        onChange={(e) => updateProject(index, "tech", e.target.value)}
                        placeholder="e.g. React, Node.js, MongoDB"
                        startIcon={Code2}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 mb-5">
                      <ValidatedInput
                        label="Start Date"
                        value={project.start_date}
                        type="date"
                        onChange={(e) => updateProject(index, "start_date", e.target.value)}
                        startIcon={Calendar}
                      />
                      <div className="space-y-2">
                        {!project.is_current ? (
                          <ValidatedInput
                            label="End Date"
                            value={project.end_date}
                            type="date"
                            onChange={(e) => updateProject(index, "end_date", e.target.value)}
                            startIcon={Calendar}
                          />
                        ) : (
                          <div className="h-[74px] border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 text-sm font-medium">
                            Present
                          </div>
                        )}
                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer w-fit ml-1 mt-2">
                          <input
                            type="checkbox"
                            checked={project.is_current || false}
                            onChange={(e) => {
                                const isChecked = e.target.checked;
                                updateProject(index, "is_current", isChecked);
                                if (isChecked) {
                                    updateProject(index, "end_date", ""); // Explicitly clear data
                                }
                            }}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          Ongoing Project
                        </label>
                      </div>
                    </div>

                    <div className="mb-5">
                      <ValidatedInput
                        label="Project Link"
                        value={project.link}
                        type="url"
                        onChange={(e) => updateProject(index, "link", e.target.value)}
                        placeholder="https://github.com/username/project"
                        startIcon={LinkIcon}
                      />
                      <ValidatedInput
                        label="Location"
                        value={project.location}
                        onChange={(e) => updateProject(index, "location", e.target.value)}
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>

                    {/* Summary */}
                    <div className="mb-5">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-semibold text-slate-700 block">Description</label>
                        <button
                          onClick={() => enhanceDescription(index, project.description)}
                          disabled={loadingIndex === index}
                          className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 px-3 py-1.5 rounded-full hover:from-violet-200 hover:to-fuchsia-200 border border-violet-200 transition-all shadow-sm disabled:opacity-70"
                        >
                          {loadingIndex === index ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          {loadingIndex === index ? "Enhancing..." : "Enhance with AI"}
                        </button>
                      </div>
                      <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all bg-white">
                        <RichTextEditor
                          value={project.description || ""}
                          onChange={(value) => updateProject(index, "description", value)}
                          placeholder="Briefly describe what this project does and your contribution..."
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
        onClick={addProject}
        className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-semibold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 mt-6"
      >
        <Plus size={20} /> Add Another Project
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

export default ProjectForm;