import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react'
import React, { useState } from 'react'
import { parseAIResponse } from '@/shared/utils/aiParser';
import { useSelector, useDispatch } from 'react-redux'
import { updateItem, selectSection, selectItem } from '@/modules/resume-builder/state/resumeSlice'
import axios from 'axios'
import toast from 'react-hot-toast'
import RichTextEditor from '@/modules/resume-builder/components/RichTextEditor';
import AIOptionsModal from '@/modules/resume-builder/components/AIOptionsModal';

const ProfessionalSummaryForm = ({ data: legacyData, onChange: legacyOnChange }) => {
  // REDUX INTEGRATION
  const dispatch = useDispatch();
  const section = useSelector(state => selectSection(state, 'professional_summary'));
  const itemId = section?.itemIds?.[0];
  const reduxItem = useSelector(state => itemId ? selectItem(state, itemId) : null);

  const data = reduxItem ? reduxItem.content : legacyData;

  const onChange = (value) => {
      // 1. Redux Update
      if (itemId) {
          dispatch(updateItem({ id: itemId, field: 'content', value }));
      }
      // 2. Legacy Update
      legacyOnChange(value);
  }
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiOptions, setAiOptions] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const backendURL = import.meta.env.VITE_BASE_URL;

  const generateSummary = async () => {
    try {
      if (!data) return toast.error("Please write something first to enhance.");

      setIsGenerating(true)
      const res = await axios.post(`${backendURL}/api/ai/enhance`,
        { text: data, type: "summary" },
        { withCredentials: true }
      );

      if (res.data.success) {
        // ✅ FIX: Force Selection Modal for ALL responses (User Control)
        // Parse unstructured text into options array
        const rawOptions = res.data.options || res.data.enhancedText || res.data.text;
        const options = parseAIResponse(rawOptions);

        setAiOptions(options);
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
        toast.error(error?.response?.data?.message || "Failed to enhance text");
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleOptionSelect = (option) => {
    onChange(option);
    setShowModal(false);
    toast.success("Summary updated with AI selection!");
  };

  return (
    <div className='space-y-4'>
      <div className="border-b border-slate-100 pb-6 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Professional Summary</h2>
        <p className="text-slate-500 mt-1">Write a short and engaging summary about yourself.</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-slate-700">Summary</label>
          <button
            onClick={generateSummary}
            disabled={isGenerating}
            className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700 px-3 py-1.5 rounded-full hover:from-violet-200 hover:to-fuchsia-200 border border-violet-200 transition-all shadow-sm disabled:opacity-70"
          >
            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {isGenerating ? "Generating..." : "Generate with AI"}
          </button>
        </div>

        <RichTextEditor
          value={data || ""}
          onChange={onChange}
          placeholder="Experienced Full Stack Developer with 5+ years..."
        />
        <div className={`mt-2 transition-all duration-300 ${data?.length > 10 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Summary added</span>
          </div>
        </div>
      </div>

      <AIOptionsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        originalText={data}
        options={aiOptions || []}
        onSelect={handleOptionSelect}
      />
    </div>
  )
}

export default ProfessionalSummaryForm;
