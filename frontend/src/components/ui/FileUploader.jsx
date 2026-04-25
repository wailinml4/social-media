import React, { useRef, useState } from 'react';
import { X } from 'lucide-react';

const FileUploader = ({
  onFilesChange,
  accept = 'image/*,video/*',
  multiple = false,
  maxFiles = 10,
  className = '',
  children,
}) => {
  const fileInputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer?.files || []);
    if (files.length === 0) return;

    const processedFiles = files.map(file => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      file,
      type: file.type.startsWith('video') ? 'video' : 'image',
      preview: URL.createObjectURL(file),
    }));

    onFilesChange(processedFiles);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFileSelect(e);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={className}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
      {children({ isDragActive, handleClick })}
    </div>
  );
};

const MediaPreview = ({ items, onRemove }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => (
        <div key={item.id} className="relative rounded-xl overflow-hidden aspect-square">
          {item.type === 'video' ? (
            <video src={item.preview} controls className="w-full h-full object-cover" />
          ) : (
            <img src={item.preview} alt="Preview" className="w-full h-full object-cover" />
          )}
          <button
            onClick={() => onRemove(item.id)}
            className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ))}
    </div>
  );
};

FileUploader.MediaPreview = MediaPreview;

export default FileUploader;
