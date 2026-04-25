import React from 'react';
import { Link } from 'react-router-dom';

const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  border = false,
  onClick,
  to,
  className = '',
  showOnlineStatus = false,
  isOnline = false,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-24 h-24 md:w-28 md:h-28',
  };

  const borderClasses = border ? 'border border-white/10' : '';
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  const avatarContent = (
    <div
      className={`${sizeClass} ${borderClasses} rounded-full overflow-hidden bg-white/10 flex-shrink-0 ${className}`}
      onClick={onClick}
    >
      {src ? (
        <img src={src} alt={alt || name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
          <span className="font-bold text-white">
            {name?.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      {showOnlineStatus && (
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#050505] ${
            isOnline ? 'bg-green-500' : 'bg-gray-500'
          }`}
        />
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block hover:opacity-80 transition-opacity">
        {avatarContent}
      </Link>
    );
  }

  return avatarContent;
};

export default Avatar;
