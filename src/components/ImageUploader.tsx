"use client";

import { useState, useCallback } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import imageCompression from "browser-image-compression";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ImageUploaderProps {
  onUploadComplete: (urls: string[]) => void;
  maxFiles?: number;
  initialUrls?: string[];
}

export default function ImageUploader({ onUploadComplete, maxFiles = 5, initialUrls = [] }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(initialUrls);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = async (files: File[]) => {
    setError(null);
    
    // Filter only images
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError("Please select valid image files.");
      return;
    }
    
    if (uploadedUrls.length + imageFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    setIsUploading(true);
    
    const newUrls: string[] = [];

    try {
      for (const file of imageFiles) {
        // 1. Compress the image
        const options = {
          maxSizeMB: 0.3, // Compress to max 300KB
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        
        const compressedFile = await imageCompression(file, options);
        
        // 2. Upload to Supabase Storage
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`; // inside 'properties' bucket
        
        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, compressedFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("Supabase Upload Error:", uploadError);
          throw new Error("Failed to upload image. Make sure your bucket is named 'properties'.");
        }

        // 3. Get Public URL
        const { data } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        newUrls.push(data.publicUrl);
      }

      const allUrls = [...uploadedUrls, ...newUrls];
      setUploadedUrls(allUrls);
      onUploadComplete(allUrls);
      
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updatedUrls = uploadedUrls.filter((_, idx) => idx !== indexToRemove);
    setUploadedUrls(updatedUrls);
    onUploadComplete(updatedUrls);
  };

  return (
    <div className="w-full">
      {/* Dropzone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${
          isDragging 
            ? "border-amber-500 bg-amber-500/10" 
            : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/50"
        }`}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          disabled={isUploading || uploadedUrls.length >= maxFiles}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
          <div className="p-4 rounded-full bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8 text-zinc-500 dark:text-zinc-400" />
            )}
          </div>
          
          <div className="text-center">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {isUploading ? "Uploading & Compressing..." : "Click or drag images here"}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {uploadedUrls.length} / {maxFiles} uploaded (Max 5MB each)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>
      )}

      {/* Preview Gallery */}
      {uploadedUrls.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {uploadedUrls.map((url, idx) => (
            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <img 
                src={url} 
                alt={`Uploaded ${idx + 1}`} 
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-red-500 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
