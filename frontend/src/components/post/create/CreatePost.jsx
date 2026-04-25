import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';

import { BarChart2, Film, Image, Smile, X } from 'lucide-react';

import Button from '../../ui/Button';
import Avatar from '../../ui/Avatar';
import FileUploader from '../../ui/FileUploader';
import { useAuth } from '../../../context/AuthContext';
import { usePosts } from '../../../context/PostContext';
import { uploadImage } from '../../../services/uploadService';

const CreatePost = ({ className = 'hidden sm:flex' }) => {
  const [text, setText] = useState('');
  const [mediaItems, setMediaItems] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const { user } = useAuth();
  const { createNewPost, isCreatingPost } = usePosts();

  const handleMediaSelect = (files) => {
    setMediaItems(prev => [...prev, ...files]);
  };

  const handleRemoveMedia = (id) => {
    setMediaItems(prev => {
      const itemToRemove = prev.find(item => item.id === id);
      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.preview);
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const handlePost = async () => {
    if (!text.trim() && mediaItems.length === 0) return;
    
    try {
      setIsUploading(true);
      
      // Upload all media files
      const uploadedUrls = [];
      for (const item of mediaItems) {
        const url = await uploadImage(item.file);
        uploadedUrls.push(url);
      }

      await createNewPost({
        content: text,
        images: uploadedUrls,
      });

      setText('');
      setMediaItems([]);
      toast.success('Post created successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to create post');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`${className} px-4 py-4 border-b border-white/10 gap-4`}>
      <Avatar
        src={user?.profilePicture}
        alt="User"
        name={user?.fullName}
        size="lg"
      />
      <div className="flex-1 pt-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What is happening?!"
          className="w-full bg-transparent text-xl focus:outline-none placeholder-gray-500 mb-4 text-white resize-none min-h-[50px]"
          rows={1}
        />
        
        {mediaItems.length > 0 && (
          <FileUploader.MediaPreview
            items={mediaItems}
            onRemove={handleRemoveMedia}
          />
        )}
        
        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <div className="flex items-center gap-6 text-primary">
            <FileUploader
              accept="image/*"
              multiple
              onFilesChange={handleMediaSelect}
            >
              {({ handleClick }) => (
                <button
                  onClick={handleClick}
                  className="w-9 h-9 rounded-full hover:bg-primary/10 flex items-center justify-center cursor-pointer transition-colors"
                  title="Image"
                >
                  <Image className="w-5 h-5" />
                </button>
              )}
            </FileUploader>
            <FileUploader
              accept="video/*"
              multiple
              onFilesChange={handleMediaSelect}
            >
              {({ handleClick }) => (
                <button
                  onClick={handleClick}
                  className="w-9 h-9 rounded-full hover:bg-primary/10 flex items-center justify-center cursor-pointer transition-colors"
                  title="Video"
                >
                  <Film className="w-5 h-5" />
                </button>
              )}
            </FileUploader>
            <button className="w-9 h-9 rounded-full hover:bg-primary/10 flex items-center justify-center cursor-pointer transition-colors" title="Poll">
              <BarChart2 className="w-5 h-5" />
            </button>
            <button className="w-9 h-9 rounded-full hover:bg-primary/10 flex items-center justify-center cursor-pointer transition-colors" title="Emoji">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <Button
            onClick={handlePost}
            disabled={(!text.trim() && mediaItems.length === 0) || isCreatingPost || isUploading}
            className="px-6 shadow-[0_0_15px_rgba(10,132,255,0.2)]"
          >
            {isCreatingPost || isUploading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
