import React from 'react';

const TagInput = ({ value, onChange, placeholder = "@alex, @sam" }) => {
  return (
    <div className="mt-3 rounded-2xl border border-white/10 bg-surface px-3 py-2.5">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
      />
    </div>
  );
};

export default TagInput;
