// import {Plus, X } from 'lucide-react'
// import React, { useState } from 'react'
// import toast from 'react-hot-toast'

// const SkillsForm = ({ data, onChange }) => {

//   const [newSkill, setNewSkill] = useState("")

//   const addSkill = () => {
//     try {
//       if (newSkill.trim() && !data.includes(newSkill.trim())) {
//         onChange([...data, newSkill.trim()])
//         setNewSkill("")          // FIXED
//       } else {
//         toast.error("Skill already exists or is empty")
//       }
//     } catch (error) {
//       toast.error("Something went wrong")
//     }
//   }

//   const deleSkill = (indexToDelete) => {
//     try {
//       onChange(data.filter((_, index) => index !== indexToDelete))
//       toast.success('Skill deleted')
//     } catch (error) {
//       toast.error("Something went wrong")
//     }
//   }

//   const handlePressKey = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       addSkill();
//     }
//   }

//   return (
//     <div className='space-y-4'>
//       <h1 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
//         Skills Section
//       </h1>

//       <p className='text-sm text-gray-500'>
//         Add your technical abilities and personal strengths
//       </p>

//       <div className='flex flex-col gap-1'>
//         <label className='text-sm font-semibold'>Enter Your Skills</label>

//         <input
//           onChange={(e) => setNewSkill(e.target.value)}   // FIXED
//           value={newSkill}
//           type='text'
//           placeholder='e.g Frontend - HTML, CSS, JS, React'
//           className='w-full p-1 text-sm'
//           onKeyDown={handlePressKey}
//         />

//         <div className='flex item-center justify-center'>
//           <button
//             onClick={addSkill}
//             disabled={!newSkill.trim()}
//             className='flex items-center mt-2 gap-2 px-4 py-2 text-sm w-20 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
//           >
//             <Plus className="size-6" /> Add
//           </button>
//         </div>
//       </div>

//       {data.length > 0 && (
//         <div className='flex flex-wrap gap-2'>
//           {data.map((skill, index) => (
//             <span key={index} className='flex items-center justify-center cursor-pointer  px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'>
//               <button onClick={() => deleSkill(index)}>
//                 <X className='w-5 h-5 text-red-600' />
//               </button>

//               {skill}
//             </span>
//           ))}
//         </div>
//       )}

//     </div>
//   )
// }

// export default SkillsForm


import React, { useEffect } from "react";
import { Plus, X } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { updateItem, addItem, deleteItem, selectSectionItems } from '@/modules/resume-builder/state/resumeSlice';
import ValidatedInput from "@/modules/resume-builder/components/ValidatedInput";

const SkillsForm = ({ data: legacyData = {}, onChange, sectionId }) => {
  // REDUX INTEGRATION
  const dispatch = useDispatch();
  const reduxItems = useSelector(state => selectSectionItems(state, sectionId));
  
  // Parse Legacy Data (it might be Array or Object)
  const legacyItemsList = Array.isArray(legacyData) ? legacyData : (legacyData.items || []);
  const legacyBulletsList = (!Array.isArray(legacyData) && legacyData.bullets) ? legacyData.bullets : [];

  // Parse Redux Data
  // If Redux has items, we use them. We split them by `isBullet` flag.
  // Note: normalizer adds isTag/isBullet.
  // Fallback: If Redux is empty/loading, use legacy.
  
  let tags = legacyItemsList;
  let bullets = legacyBulletsList;

  if (reduxItems && reduxItems.length > 0) {
      // Filter with fallback: if no flags set, treat as tags by default
      tags = reduxItems.filter(i => i.isTag || (!i.isBullet && !i.isTag));
      bullets = reduxItems.filter(i => i.isBullet);
      
      // SAFETY: If filtering returns empty but reduxItems has data,
      // assume all items are tags (backward compatibility)
      if (tags.length === 0 && bullets.length === 0 && reduxItems.length > 0) {
          console.warn('[SkillsForm] No flags found, treating all items as tags');
          tags = reduxItems;
      }
  }

  // Helper to sync Legacy State (Reconstruct Object)
  // We need to pass the *current state of valid strings* to legacy onChange
  const syncLegacy = (newTags, newBullets) => {
      // Convert objects back to strings if legacy expects strings?
      // ResumePreview handles objects mostly, but let's stick to what SkillsForm did: 
      // It maintained the input (string or object).
      // Let's pass the raw objects/strings we have.
      
      // Extract strings for consistency if legacy expects strings?
      // ResumeBuilder init: { data: [] } or custom structure?
      // Let's pass the objects. ResumePreview handles them.
      onChange({ items: newTags, bullets: newBullets });
  }

  /* HANDLERS */
  
  // TAGS
  const updateTag = (index, value) => {
    // Redux
    const item = tags[index];
    // If item is object from Redux, it has ID.
    // If string (Legacy fallback), we can't Redux update easily without ID.
    if (item && item.id) {
       dispatch(updateItem({ id: item.id, field: 'name', value }));
       dispatch(updateItem({ id: item.id, field: 'content', value })); // Sync content too
    }
    
    // Legacy
    const newTags = [...tags];
    // Modifying the object/string locally for legacy prop
    if (typeof newTags[index] === 'object') {
        newTags[index] = { ...newTags[index], name: value, content: value };
    } else {
        newTags[index] = value;
    }
    syncLegacy(newTags, bullets);
  };

  const addTag = () => {
    const newItem = { id: `skill-${Date.now()}`, name: "", content: "", isTag: true };
    if (sectionId) dispatch(addItem({ sectionId, item: newItem }));
    // Legacy
    syncLegacy([...tags, newItem], bullets);
  };

  const removeTag = (index) => {
    const item = tags[index];
    if (item && item.id && sectionId) dispatch(deleteItem({ sectionId, itemId: item.id }));
    // Legacy
    syncLegacy(tags.filter((_, i) => i !== index), bullets);
  };

  // BULLETS
  const updateBullet = (index, value) => {
    const item = bullets[index];
    if (item && item.id) {
       dispatch(updateItem({ id: item.id, field: 'name', value }));
       dispatch(updateItem({ id: item.id, field: 'content', value }));
    }
    
    const newBullets = [...bullets];
    if (typeof newBullets[index] === 'object') {
        newBullets[index] = { ...newBullets[index], name: value, content: value };
    } else {
        newBullets[index] = value;
    }
    syncLegacy(tags, newBullets);
  };

  const addBullet = () => {
    const newItem = { id: `bull-${Date.now()}`, name: "", content: "", isBullet: true };
    if (sectionId) dispatch(addItem({ sectionId, item: newItem }));
    syncLegacy(tags, [...bullets, newItem]);
  };

  const removeBullet = (index) => {
    const item = bullets[index];
    if (item && item.id && sectionId) dispatch(deleteItem({ sectionId, itemId: item.id }));
    syncLegacy(tags, bullets.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Skills</h2>
        <p className="text-slate-500 mt-1">Highlight your technical strengths and core competencies.</p>
      </div>

      {/* SECTION 1: SKILL TAGS */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Skill Tags</h3>
        <p className="text-sm text-gray-500">Short, single skills (e.g. React, Python, Leadership).</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tags.map((skill, index) => (
            <div key={skill.id || index} className="relative group flex items-center gap-2">
              <ValidatedInput
                value={typeof skill === 'object' ? (skill.name || skill.content || "") : skill}
                onChange={(e) => updateTag(index, e.target.value)}
                placeholder="e.g. React.js"
                className="flex-1"
              />
              <button
                onClick={() => removeTag(index)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addTag}
          className="flex items-center gap-2 text-blue-600 font-semibold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-blue-100"
        >
          <Plus size={18} />
          Add Tag
        </button>
      </div>

      <div className="border-t border-slate-100"></div>

      {/* SECTION 2: CATEGORIZED / DETAILED SKILLS */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Detailed Skills (Bullet Points)</h3>

        {/* HINT */}
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100 space-y-1">
          <p className="font-semibold mb-1">Suggestion: You can group your skills by category like this:</p>
          <ul className="list-disc ml-5 space-y-0.5 opacity-80">
            <li>Programming: C, C++, Java, Python</li>
            <li>Frontend: HTML, CSS, JavaScript, React, Tailwind</li>
            <li>Backend: Node.js, Express.js, MongoDB</li>
            <li>Tools: Git, VS Code, Postman</li>
          </ul>
        </div>

        <div className="space-y-3">
          {bullets.map((bullet, index) => (
            <div key={bullet.id || index} className="flex items-center gap-2">
              <ValidatedInput
                value={typeof bullet === 'object' ? (bullet.name || bullet.content || "") : bullet}
                onChange={(e) => updateBullet(index, e.target.value)}
                placeholder="e.g. Frontend: HTML, CSS, React..."
                className="flex-1"
              />
              <button
                onClick={() => removeBullet(index)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addBullet}
          className="flex items-center gap-2 text-blue-600 font-semibold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-blue-100"
        >
          <Plus size={18} />
          Add Bullet Point
        </button>
      </div>

    </div>
  );
};

export default SkillsForm;
