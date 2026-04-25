import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../ui/Avatar';

const PostAuthor = ({ author, time, onTimeClick, showDropdown = false, dropdownContent }) => {
  const authorName = author?.fullName || author?.name;
  const authorHandle = author?.email?.split('@')[0] || author?.handle;
  const authorId = author?._id || author?.authorId;

  return (
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-2 text-sm">
        <Link to={`/profile/${authorId}`} className="font-bold text-white hover:underline truncate">
          {authorName}
        </Link>
        <span className="text-text-dim truncate">@{authorHandle}</span>
        <span className="text-gray-600">·</span>
        <span onClick={onTimeClick} className="text-text-dim hover:underline cursor-pointer">{time}</span>
      </div>
      {showDropdown && dropdownContent}
    </div>
  );
};

export default PostAuthor;
