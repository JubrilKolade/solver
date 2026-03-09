import { useState, useRef, useCallback } from 'react';
import { createWorker } from 'tesseract.js';
import { cn } from '../utils/cn';

interface ImageUploadProps {
  onTextExtracted: (text: string) => void;
  onSolveText: (text: string) => void;
}

export function ImageUpload({ onTextExtracted, onSolveText }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [editedText, setEditedText] = useState('');
  const [ocrDone, setOcrDone] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processImage = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, etc.)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Please upload an image under 10MB.');
      return;
    }

    setError('');
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Run OCR
    setIsProcessing(true);
    setProgress(0);
    setExtractedText('');
    setEditedText('');
    setOcrDone(false);

    try {
      const worker = await createWorker('eng', 1, {
        logger: (m: { status: string; progress: number; }) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      const cleaned = text.trim();
      setExtractedText(cleaned);
      setEditedText(cleaned);
      setOcrDone(true);
      if (cleaned) {
        onTextExtracted(cleaned);
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setError('Could not process image text. You can still describe your problem below.');
      setOcrDone(true);
    } finally {
      setIsProcessing(false);
    }
  }, [onTextExtracted]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processImage(file);
  }, [processImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const clearImage = () => {
    setImage(null);
    setFileName('');
    setExtractedText('');
    setEditedText('');
    setOcrDone(false);
    setError('');
    setIsProcessing(false);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!image && (
        <div
          ref={dropRef}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300',
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]'
              : 'border-white/15 bg-white/[0.02] hover:border-indigo-500/50 hover:bg-white/[0.04]'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4">
            <div className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center transition-all',
              isDragging ? 'bg-indigo-500/30 scale-110' : 'bg-white/5'
            )}>
              <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium text-lg mb-1">
                {isDragging ? 'Drop your image here' : 'Upload a math problem image'}
              </p>
              <p className="text-gray-500 text-sm">
                Drag & drop or click to browse • PNG, JPG, WEBP
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
                📐 Circle Geometry
              </span>
              <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
                📏 Construction
              </span>
              <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
                ✏️ Written Problems
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview + Results */}
      {image && (
        <div className="space-y-4">
          {/* Preview */}
          <div className="relative bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <span className="text-sm text-gray-300 truncate max-w-[200px]">{fileName}</span>
              </div>
              <button
                onClick={clearImage}
                className="text-gray-500 hover:text-red-400 transition-colors p-1"
                title="Remove image"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 flex justify-center bg-black/20">
              <img
                src={image}
                alt="Uploaded math problem"
                className="max-h-[300px] rounded-lg object-contain"
              />
            </div>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="bg-indigo-500/10 rounded-2xl border border-indigo-500/20 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-5 h-5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                <span className="text-indigo-300 font-medium">Extracting text from image...</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{progress}% complete</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 rounded-2xl border border-red-500/20 p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Extracted Text */}
          {ocrDone && (
            <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-white">
                  {extractedText ? 'Text Extracted' : 'No text detected'}
                </span>
              </div>

              {extractedText ? (
                <p className="text-xs text-gray-500 mb-2">Edit the text below if needed, then click Solve</p>
              ) : (
                <p className="text-xs text-gray-500 mb-2">
                  This might be a diagram or hand-drawn problem. Type the problem below or use the Geometry Tools tab.
                </p>
              )}

              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder="Type or edit the math problem here..."
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm resize-none"
              />

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => editedText.trim() && onSolveText(editedText)}
                  disabled={!editedText.trim()}
                  className={cn(
                    'flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2',
                    editedText.trim()
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25'
                      : 'bg-gray-700 cursor-not-allowed opacity-50'
                  )}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Solve This Problem
                </button>
                <button
                  onClick={clearImage}
                  className="px-6 py-3 rounded-xl font-medium text-gray-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
                >
                  Upload New Image
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
