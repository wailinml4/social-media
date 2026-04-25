import React from 'react';
import Input from '../ui/Input';

const ProfileForm = ({ fullName, bio, onFullNameChange, onBioChange }) => {
  return (
    <div className="mt-4 space-y-4">
      <Input
        label="Name"
        type="text"
        value={fullName}
        onChange={(e) => onFullNameChange(e.target.value)}
        placeholder="Your name"
      />

      <Input
        label="Bio"
        type="textarea"
        value={bio}
        onChange={(e) => onBioChange(e.target.value)}
        placeholder="Tell us about yourself"
        rows={3}
      />
    </div>
  );
};

export default ProfileForm;
