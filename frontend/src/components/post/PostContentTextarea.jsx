import React, { useEffect, useRef } from 'react';

const PostContentTextarea = ({ value, onChange, placeholder, minHeight = '96px' }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = '0px';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-3 min-h-[96px] w-full resize-none overflow-hidden bg-transparent text-[16px] leading-7 text-white outline-none placeholder:text-gray-600 sm:min-h-[110px]"
      style={{ minHeight }}
    />
  );
};

export default PostContentTextarea;
