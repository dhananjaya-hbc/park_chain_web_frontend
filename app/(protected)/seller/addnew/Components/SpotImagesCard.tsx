"use client";

import React, { useRef, useState } from 'react';
import { UploadCloud, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SpotImagesCardProps {
  imageFiles: File[]; // ✅ CHANGED
  setImageFiles: (files: File[]) => void; // ✅ CHANGED
}

export default function SpotImagesCard({ imageFiles, setImageFiles }: SpotImagesCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [startIndex, setStartIndex] = useState(0);

  // Handle file selection
  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    setImageFiles([...imageFiles, ...fileArray]); // ✅ CHANGED
  };

  // Remove image
  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index)); // ✅ CHANGED
  };

  // Slide controls
  const handleNext = () => {
    if (startIndex + 3 < imageFiles.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm min-h-[433px] flex flex-col">
      
      {/* Header */}
      <div className="-mx-6 -mt-6 mb-6 rounded-t-xl bg-[#F9FAFB80] px-6 py-4">
        <h2 className="text-sm font-bold text-gray-900 mb-1 leading-tight tracking-[0.7px]">
          Spot Images
        </h2>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        multiple
        hidden
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
        }}
      />

      {/* Upload Box */}
      <div
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className={`border border-[#C7CDD8] bg-[#F9FAFB4D] rounded-2xl px-6 relative cursor-pointer 
        focus-within:outline-none focus-within:ring-2 focus-within:ring-[#43a047]/30 
        focus-within:border-[#43a047] transition-all flex items-center justify-center
        ${imageFiles.length > 0 ? "h-[200px] mt-auto" : "h-[280px]"}`}
      >
        <div className="text-center">
          <div className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
            <UploadCloud className="w-6 h-6 text-[#9CA3AF]" />
          </div>
          <span className="text-base font-medium text-[#111827] block mb-1">
            Click to upload or drag
          </span>
          <span className="text-sm text-[#6B7280] block">
            SVG, PNG, JPG (max 5MB)
          </span>

          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="mt-3 !h-auto text-sm font-semibold text-[#2e7d32] bg-[#e8f5e9] hover:bg-[#c8e6c9] px-3 py-1.5 rounded-lg"
          >
            Browse File
          </Button>
        </div>
      </div>

      {/* Preview Section */}
      {imageFiles.length > 0 && (
        <div className="mt-4">

          {imageFiles.length === 1 && (
            <div className="relative h-24">
              <img src={URL.createObjectURL(imageFiles[0])} className="w-full h-full object-cover rounded-md"/>
              <button onClick={() => removeImage(0)} className="absolute -top-2 -right-2 bg-white border rounded-full p-1 shadow">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {imageFiles.length === 2 && (
            <div className="flex gap-3">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative w-1/2 h-24">
                  <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-md"/>
                  <button onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-white border rounded-full p-1 shadow">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {imageFiles.length === 3 && (
            <div className="grid grid-cols-3 gap-3">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative h-24">
                  <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-md"/>
                  <button onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-white border rounded-full p-1 shadow">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {imageFiles.length > 3 && (
            <div className="flex items-center gap-3 w-full">
              <button onClick={handlePrev} disabled={startIndex === 0} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#e8f5e9] text-[#2e7d32] disabled:opacity-40">
                <ChevronLeft size={20} />
              </button>

              <div className="grid grid-cols-3 gap-3 flex-1">
                {imageFiles.slice(startIndex, startIndex + 3).map((file, index) => (
                  <div key={index} className="relative h-24">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-md"/>
                    <button onClick={() => removeImage(startIndex + index)} className="absolute -top-2 -right-2 bg-white border rounded-full p-1 shadow">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={handleNext} disabled={startIndex + 3 >= imageFiles.length} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#e8f5e9] text-[#2e7d32] disabled:opacity-40">
                <ChevronRight size={20} />
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}