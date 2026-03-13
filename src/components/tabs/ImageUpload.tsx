import { useState, useRef, useCallback } from 'react';
import { createWorker } from 'tesseract.js';
import { cn } from '../../utils/cn';

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
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);

    setIsProcessing(true);
    setProgress(0);
    setExtractedText('');
    setEditedText('');
    setOcrDone(false);

    try {
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100));
        },
      });
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      const cleaned = text.trim();
      setExtractedText(cleaned);
      setEditedText(cleaned);
      setOcrDone(true);
      if (cleaned) onTextExtracted(cleaned);
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
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300',
            isDragging ? 'scale-[1.02]' : ''
          )}
          style={{
            borderColor: isDragging ? 'var(--accent)' : 'var(--border-color)',
            background: isDragging ? 'var(--accent-glow)' : 'var(--bg-subtle)',
          }}
        >
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <div className="flex flex-col items-center gap-4">
            <div
              className={cn('w-16 h-16 rounded-2xl flex items-center justify-center transition-all', isDragging && 'scale-110')}
              style={{ background: 'var(--accent-glow)' }}
            >
              <span className="text-3xl">📷</span>
            </div>
            <div>
              <p className="font-display text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                {isDragging ? 'Drop your image here' : 'Upload a math problem image'}
              </p>
              <p className="text-sm font-body" style={{ color: 'var(--text-muted)' }}>
                Drag & drop or click to browse • PNG, JPG, WEBP
              </p>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap justify-center">
              {['📐 Circle Geometry', '📏 Construction', '✏️ Written Problems'].map(tag => (
                <span key={tag} className="text-xs px-3 py-1.5 rounded-full font-body border"
                  style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image Preview + Results */}
      {image && (
        <div className="space-y-4">
          {/* Preview */}
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-subtle)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2">
                <span>📷</span>
                <span className="text-sm truncate max-w-[200px] font-body" style={{ color: 'var(--text-secondary)' }}>{fileName}</span>
              </div>
              <button onClick={clearImage} className="p-1 transition-colors hover:text-red-500" style={{ color: 'var(--text-muted)' }} title="Remove image">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 flex justify-center" style={{ background: 'var(--bg-subtle)' }}>
              <img src={image} alt="Uploaded math problem" className="max-h-[300px] rounded-lg object-contain" />
            </div>
          </div>

          {/* Processing */}
          {isProcessing && (
            <div className="rounded-2xl border p-5" style={{ background: 'var(--accent-glow)', borderColor: 'var(--border-accent)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--accent)' }} />
                <span className="font-medium font-body" style={{ color: 'var(--accent)' }}>Extracting text from image...</span>
              </div>
              <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: 'var(--bg-subtle)' }}>
                <div className="accent-gradient h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs mt-2 font-body" style={{ color: 'var(--text-muted)' }}>{progress}% complete</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-2xl border p-4" style={{ background: 'rgba(220,38,38,0.05)', borderColor: 'rgba(220,38,38,0.2)' }}>
              <p className="text-sm text-red-500 font-body">{error}</p>
            </div>
          )}

          {/* Extracted Text */}
          {ocrDone && (
            <div className="rounded-2xl border p-5 space-y-4" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-subtle)' }}>
              <div className="flex items-center gap-2">
                <span>{extractedText ? '✅' : '⚠️'}</span>
                <span className="font-medium font-display" style={{ color: 'var(--text-primary)' }}>
                  {extractedText ? 'Text Extracted' : 'No text detected'}
                </span>
              </div>
              <p className="text-xs font-body" style={{ color: 'var(--text-muted)' }}>
                {extractedText ? 'Edit the text below if needed, then click Solve' : 'Type the problem below or use the Geometry Tools tab.'}
              </p>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder="Type or edit the math problem here..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm resize-none font-body transition-all focus:outline-none"
                style={{
                  background: 'var(--bg-input)',
                  border: '1.5px solid var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 15px var(--glow-color)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => editedText.trim() && onSolveText(editedText)}
                  disabled={!editedText.trim()}
                  className={cn(
                    'flex-1 sm:flex-none px-6 py-3 rounded-xl font-display transition-all flex items-center justify-center gap-2',
                    !editedText.trim() && 'opacity-40 cursor-not-allowed'
                  )}
                  style={{
                    background: editedText.trim() ? 'var(--accent)' : 'var(--text-faint)',
                    color: editedText.trim() ? '#fff' : 'var(--text-muted)',
                    boxShadow: editedText.trim() ? '0 4px 15px var(--accent-glow-strong)' : 'none',
                  }}
                >
                  ✨ Solve This Problem
                </button>
                <button
                  onClick={clearImage}
                  className="px-6 py-3 rounded-xl font-body border transition-all"
                  style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
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
