import React from 'react'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { EditProfileInput } from '../../schemas/user.schema.js'
import ValidatedInput from '../ui/ValidatedInput.jsx'

interface ProfileFormProps {
  register: UseFormRegister<EditProfileInput>
  errors: FieldErrors<EditProfileInput>
}

const ProfileForm = ({ register, errors }: ProfileFormProps) => {
  return (
    <div className="mt-4 space-y-4">
      <ValidatedInput
        label="Full Name"
        type="text"
        placeholder="Your name"
        registration={register('fullName')}
        error={errors.fullName?.message}
      />

      <ValidatedInput
        label="Username"
        type="text"
        placeholder="@username"
        registration={register('username')}
        error={errors.username?.message}
      />

      <ValidatedInput
        label="Bio"
        type="textarea"
        placeholder="Tell us about yourself"
        registration={register('bio')}
        error={errors.bio?.message}
        rows={3}
      />

      <ValidatedInput
        label="Location"
        type="text"
        placeholder="City, Country"
        registration={register('location')}
        error={errors.location?.message}
      />
    </div>
  )
}

export default ProfileForm
