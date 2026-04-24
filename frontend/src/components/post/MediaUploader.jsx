import React, { useRef } from 'react';

import { ImagePlus, Video, X } from 'lucide-react';

const MediaUploader = ({ mediaItems, onAddFiles, onRemoveMedia, isDragActive, onDragOver, onDragLeave, onDrop, fileInputRef }) => {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`mt-4 rounded-2xl border transition-all duration-200 ${
        isDragActive
          ? 'border-primary/60 bg-primary/10'
          : 'border-white/10 bg-surface'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => onAddFiles(e.target.files || [])}
      />

      {mediaItems.length === 0 ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors duration-200 hover:bg-white/[0.03]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/7 text-white/70">
            <Video className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/88">Add photos or videos</p>
            <p className="mt-0.5 text-xs text-white/38">Drag files here or choose from your library.</p>
          </div>
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-2 p-2">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-white/6"
            >
              {item.type === 'image' ? (
                <img
                  src={item.preview}
                  alt={item.file.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <video
                  src={item.preview}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                />
              )}

              <button
                type="button"
                onClick={() => onRemoveMedia(item.id)}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white/80 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-black/75 hover:text-white"
                aria-label={`Remove ${item.file.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
