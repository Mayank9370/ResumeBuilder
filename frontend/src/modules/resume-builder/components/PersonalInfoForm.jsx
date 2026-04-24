import React, { useState } from "react";
import ValidatedInput from "@/modules/resume-builder/components/ValidatedInput";
import { User, Briefcase, Phone, Mail, MapPin, Trash2, Camera, Edit2 } from "lucide-react";
import SocialIcon, { socialPlatforms } from "@/modules/resume-builder/components/SocialIcon";
import { useStableImage } from "@/shared/hooks/useStableImage";
import { useSelector, useDispatch } from "react-redux";
import { updateItem, selectSection, selectItem } from "@/modules/resume-builder/state/resumeSlice";
import ProfileImageEditorModal from "@/modules/resume-builder/components/ProfileImageEditorModal";
import { blobToFile } from "@/modules/resume-builder/utils/imageCropUtils";

const PersonalInfoForm = ({
  data: legacyData,
  onChange,
  removeBackground,
  setRemoveBackground,
}) => {
  // REDUX INTEGRATION:
  const dispatch = useDispatch();

  // Select data from Store (Single Source of Truth)
  const section = useSelector((state) => selectSection(state, "personal_info"));
  const itemId = section?.itemIds?.[0];
  const reduxItem = useSelector((state) =>
    itemId ? selectItem(state, itemId) : null,
  );

  const data = reduxItem || legacyData || {};
  
  if (!reduxItem) {
      console.warn('[PersonalInfoForm] ⚠️ Redux Item Missing. Using Legacy:', !!legacyData);
  }

  const update = (key, value) => {
    // 1. Instant Redux Update (Fast Preview)
    if (itemId) {
      dispatch(updateItem({ id: itemId, field: key, value }));
    }

    // 2. Legacy Parent Update (Slow Persistence)
    onChange({ ...data, [key]: value });
  };

  // CORE HARDENING: Use Stable Image Hook to prevent memory leaks
  const stableImageUrl = useStableImage(data?.image);

  // --- IMAGE CROP LOGIC START ---
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);

  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setTempImageSrc(reader.result?.toString() || "");
        setIsCropModalOpen(true);
        // Clear input so same file can be selected again if needed
        e.target.value = ""; 
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropConfirm = (croppedBlob) => {
    // Convert Blob to File to ensure consistent handling downstream
    const croppedFile = blobToFile(croppedBlob, "profile-pic-cropped.jpg");
    update("image", croppedFile);
    setIsCropModalOpen(false);
    setTempImageSrc(null);
  };

  const handleCropClose = () => {
    setIsCropModalOpen(false);
    setTempImageSrc(null);
  };
  // --- IMAGE CROP LOGIC END ---

  // Migration: If old fields exist but no socialLinks, auto-populate
  React.useEffect(() => {
    if (!data.socialLinks && (data.linkedin || data.website)) {
      const newLinks = [];
      if (data.linkedin)
        newLinks.push({
          platform: "LinkedIn",
          url: data.linkedin,
          id: Date.now(),
        });
      if (data.website)
        newLinks.push({
          platform: "Portfolio",
          url: data.website,
          id: Date.now() + 1,
        });

      onChange({
        ...data,
        socialLinks: newLinks,
        linkedin: "", // Clear legacy
        website: "", // Clear legacy
      });
    }
  }, []);

  const handleAddLink = () => {
    const updatedLinks = [
      ...(data.socialLinks || []),
      { platform: "LinkedIn", url: "", id: Date.now() },
    ];
    update("socialLinks", updatedLinks);
  };

  const handleRemoveLink = (index) => {
    const updatedLinks = [...(data.socialLinks || [])];
    updatedLinks.splice(index, 1);
    update("socialLinks", updatedLinks);
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...(data.socialLinks || [])];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    update("socialLinks", updatedLinks);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* CROP MODAL */}
      <ProfileImageEditorModal 
        isOpen={isCropModalOpen}
        onClose={handleCropClose}
        imageSrc={tempImageSrc}
        onConfirm={handleCropConfirm}
      />

      <div className="border-b border-slate-100 pb-6 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Contacts</h2>
        <p className="text-slate-500 mt-1">
          Add your up-to-date contact information so employers and recruiters
          can easily reach you.
        </p>
      </div>

      <div className="flex items-start gap-6">
        {/* Image Upload */}
        <div className="shrink-0 group relative">
          <div
            className={`w-28 h-28 rounded-2xl overflow-hidden border-2 ${data.image ? "border-blue-500" : "border-dashed border-slate-300"} bg-slate-50 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors shadow-sm relative`}
          >
            {stableImageUrl ? (
              <img
                src={stableImageUrl}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-slate-300" />
            )}
            
            {/* Hover Edit Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera size={24} />
            </div>

            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={handleFileSelect} 
            />
          </div>

          <div className="flex flex-col gap-2 mt-3 items-center">
            {data?.image && (
                <button
                    onClick={() => {
                        // Re-open cropping for CURRENT image if it's a blob/url we can read? 
                        // Actually easier to just require re-upload for now, or handle blob reading.
                        // For MVP: Re-trigger file input concept or just "Change Photo"
                        document.querySelector('input[type="file"]').click();
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                    <Edit2 size={12} /> Change Photo
                </button>
            )}

            {data?.image && (
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer hover:text-blue-600 justify-center">
                <input
                    type="checkbox"
                    checked={removeBackground}
                    onChange={(e) => setRemoveBackground(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Remove BG
                </label>
            )}
          </div>
        </div>

        {/* Name & Title */}
        <div className="grid md:grid-cols-2 gap-6 w-full">
          <ValidatedInput
            label="Full Name"
            value={data?.full_name}
            onChange={(e) => update("full_name", e.target.value)}
            placeholder="e.g. John Doe"
            startIcon={User}
          />
          <ValidatedInput
            label="Job Title"
            value={data?.profession}
            onChange={(e) => update("profession", e.target.value)}
            placeholder="e.g. Full Stack Developer"
            startIcon={Briefcase}
          />
        </div>
      </div>

      {/* Contact Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <ValidatedInput
          label="Phone"
          value={data?.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="e.g. +1 555-555-5555"
          type="tel"
          startIcon={Phone}
        />
        <ValidatedInput
          label="Email"
          value={data?.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="e.g. john.doe@example.com"
          type="email"
          startIcon={Mail}
        />
      </div>

      <div className="grid md:grid-cols-1 gap-6">
        <ValidatedInput
          label="Location"
          value={data?.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder="e.g. New York, USA"
          startIcon={MapPin}
        />
      </div>

      {/* Dynamic Social Links */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">
            Social Profiles
          </h3>
          <button
            onClick={handleAddLink}
            className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
          >
            + Add Link
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {data?.socialLinks?.map((link, index) => (
            <div
              key={link.id || index}
              className="flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div className="w-1/3 min-w-[140px]">
                <select
                  value={link.platform}
                  onChange={(e) =>
                    handleLinkChange(index, "platform", e.target.value)
                  }
                  className="w-full rounded-lg border-slate-200 text-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-3 bg-white"
                >
                  {socialPlatforms.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) =>
                    handleLinkChange(index, "url", e.target.value)
                  }
                  placeholder={`Link to ${link.platform}...`}
                  className="block w-full rounded-lg border-slate-200 text-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-3"
                />
                <div className="absolute right-3 top-2.5 text-slate-400 pointer-events-none">
                  <SocialIcon platform={link.platform} className="size-4" />
                </div>
              </div>
              <button
                onClick={() => handleRemoveLink(index)}
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          {(!data?.socialLinks || data.socialLinks.length === 0) && (
            <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <p className="text-sm text-slate-500">
                No social links added yet.
              </p>
              <button
                onClick={handleAddLink}
                className="mt-2 text-sm text-blue-600 font-medium hover:underline"
              >
                Add your LinkedIn, Github, or Portfolio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
