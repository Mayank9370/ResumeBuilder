import React, { useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Enter text here...",
}) => {
  // Custom toolbar configuration
  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline"],
        [{ align: [] }, { align: "center" }, { align: "right" }, { align: "justify" }],
        [{ list: "bullet" }, { list: "ordered" }],
        ["clean"],
      ],
      clipboard: {
        matchVisual: false,
      },
    }),
    [],
  );

  // Formats we allow
  const formats = ["bold", "italic", "underline", "list", "bullet", "align"];

  // Convert plain text to HTML for backward compatibility
  const normalizeValue = (val) => {
    if (!val) return "";
    // If value doesn't contain HTML tags, wrap in <p> tag
    if (typeof val === "string" && !val.includes("<")) {
      return `<p>${val.replace(/\n/g, "<br>")}</p>`;
    }
    return val;
  };

  return (
    <>
      <style>{`
        .rich-text-editor .ql-container {
          font-family: inherit;
          font-size: 14px;
          min-height: 100px;
        }
        
        .rich-text-editor .ql-editor {
          min-height: 100px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          font-style: normal;
          color: #9ca3af;
        }
        
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: #f9fafb;
          border-color: #d1d5db;
        }
        
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: #d1d5db;
        }
        
        .rich-text-editor .ql-editor ul {
          padding-left: 1.5rem;
          list-style-type: disc;
        }

        .rich-text-editor .ql-editor ol {
          padding-left: 1.5rem;
          list-style-type: decimal;
        }
        
        .rich-text-editor .ql-editor p {
          margin-bottom: 0.5em;
        }
        
        .rich-text-editor .ql-stroke {
          stroke: #4b5563;
        }
        
        .rich-text-editor .ql-fill {
          fill: #4b5563;
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar button:focus .ql-stroke,
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #2563eb;
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-toolbar button:focus .ql-fill,
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #2563eb;
        }
      `}</style>
      <div className="rich-text-editor">
        <ReactQuill
          theme="snow"
          value={normalizeValue(value)}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="bg-white rounded-lg"
        />
      </div>
    </>
  );
};

export default RichTextEditor;
