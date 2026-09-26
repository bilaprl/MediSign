// src/components/ui/FileDropzone.jsx
import React, { useCallback, useState } from "react";
import { UploadCloud, File, X } from "lucide-react";

export default function FileDropzone({
  accept,
  onFileSelect,
  selectedFile,
  className = "",
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onFileSelect(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect],
  );

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  if (selectedFile) {
    return (
      <div
        className={`p-4 rounded-2xl border-2 border-primary-100 bg-primary-50/50 flex items-center justify-between transition-all ${className}`}
      >
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="bg-white p-3 rounded-xl shadow-sm flex-shrink-0 text-primary-600">
            <File className="w-6 h-6" />
          </div>
          <div className="truncate">
            <p className="text-sm font-bold text-slate-800 truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-slate-500">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-full transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`
        relative w-full p-8 rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer
        ${
          isDragging
            ? "border-primary-500 bg-primary-50"
            : "border-slate-300 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-400"
        }
        ${className}
      `}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div
        className={`p-4 rounded-full mb-4 ${isDragging ? "bg-primary-100 text-primary-600" : "bg-white text-slate-400 shadow-sm"}`}
      >
        <UploadCloud className="w-8 h-8" />
      </div>
      <p className="text-sm font-bold text-slate-700 mb-1">
        Klik untuk mengunggah atau seret file ke sini
      </p>
      <p className="text-xs text-slate-500">
        Mendukung file dengan format {accept}
      </p>
    </div>
  );
}
