import React, { useEffect, useRef } from 'react';

const Dropdown = ({
  trigger,
  children,
  isOpen,
  onToggle,
  align = 'right',
  className = '',
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (isOpen) onToggle(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  const alignClasses = {
    right: 'right-0',
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div onClick={() => onToggle(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute ${alignClasses[align]} bottom-full mb-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden min-w-[140px] z-50`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
