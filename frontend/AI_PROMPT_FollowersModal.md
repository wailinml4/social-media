# AI Prompt: Followers/Followees Modal Component

## Overview
Create an immersive, Apple-inspired modal component that displays a user's followers, followees, or friends when clicking on the stat cards in the profile page. The modal should be consistent with existing modals in the app (EditProfileModal, PostModal) and use GSAP animations with Tailwind CSS.

## Design Requirements

### Visual Style
- **Apple-inspired minimalistic design** with:
  - Clean, uncluttered interface
  - Subtle glassmorphism effects (backdrop-blur, semi-transparent backgrounds)
  - Rounded corners (rounded-3xl for modal container)
  - Fine borders (border-white/10)
  - Smooth shadows (shadow-[0_0_50px_rgba(0,0,0,0.5)])
  - Dark theme matching the app's aesthetic (#050505 background)

### Modal Structure
```
┌─────────────────────────────────────┐
│  Header: "Followers" / "Following"  │  ← Close button (X)
├─────────────────────────────────────┤
│  Search bar (optional)              │
├─────────────────────────────────────┤
│  List of users with:                │
│  - Avatar (circular, 48px)         │
│  - Name (bold, white)               │
│  - Username/handle (dimmed)        │
│  - Follow/Unfollow button           │
├─────────────────────────────────────┤
│  Footer: "Load more" button         │
└─────────────────────────────────────┘
```

### User List Item Design
Each user item should include:
- Circular avatar (48x48px) with border
- User name (font-semibold, text-white)
- Optional username/handle (text-sm, text-gray-400)
- Follow/Unfollow button (small, rounded-full)
- Hover effect: subtle background change (hover:bg-white/5)

## Technical Requirements

### Component Structure
```jsx
const FollowersModal = ({ type, userId, isOpen, onClose }) => {
  // type: 'followers' | 'following' | 'friends'
  // userId: the user whose followers/followees to show
  // isOpen: modal open state
  // onClose: close callback
}
```

### GSAP Animations
Use the existing `useModalAnimation` hook from `../../animations/useModalAnimation.js`:
- Open animation: scale from 0.95 to 1, fade in, slight y-offset
- Close animation: scale to 0.96, fade out, slight y-offset
- Duration: 0.38s open, 0.18s close
- Easing: power3.out for open, power2.inOut for close

### State Management
- Add to ModalContext.jsx:
  ```jsx
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [followersModalType, setFollowersModalType] = useState('followers'); // 'followers' | 'following' | 'friends'
  const [followersModalUserId, setFollowersModalUserId] = useState(null);
  ```

### API Integration
Use existing services from `followService.js`:
- `getFollowers(userId, offset, limit)` - fetch followers
- `getFollowees(userId, offset, limit)` - fetch followees
- Implement pagination with offset/limit parameters

### Responsive Design
- Mobile: Full height (h-[100dvh]), slide up from bottom
- Desktop: Centered modal, max-width 540px, max-height 85vh
- Scrollable content area with custom scrollbar styling

## Implementation Details

### 1. Update ModalContext
Add state and functions for the followers modal:
```jsx
const openFollowersModal = (type, userId) => {
  setFollowersModalType(type);
  setFollowersModalUserId(userId);
  setIsFollowersModalOpen(true);
};

const closeFollowersModal = () => {
  setIsFollowersModalOpen(false);
};
```

### 2. Create FollowersModal Component
File: `src/components/profile/FollowersModal.jsx`

Key features:
- Accept `type` prop ('followers', 'following', 'friends')
- Accept `userId` prop
- Use `useModalAnimation` hook
- Fetch data on mount and when type/userId changes
- Implement infinite scroll or "Load more" button
- Show loading skeleton while fetching
- Show empty state when no users

### 3. Update ProfileStats
Add onClick handlers to stat cards:
```jsx
const handleClick = (key) => {
  if (key === 'followers') {
    openFollowersModal('followers', user._id);
  } else if (key === 'following') {
    openFollowersModal('following', user._id);
  } else if (key === 'friends') {
    openFollowersModal('friends', user._id);
  }
};
```

### 4. Add Modal to App
Render FollowersModal in App.jsx or appropriate layout component, conditionally based on `isFollowersModalOpen`.

## Animation Details

### Entry Animation
- Overlay: fade in from opacity 0 to 1 (0.24s, power2.out)
- Modal: scale from 0.95 to 1, y from 10 to 0, opacity 0 to 1 (0.38s, power3.out)

### Exit Animation
- Modal: scale to 0.96, y to 8, opacity to 0 (0.18s, power2.inOut)
- Overlay: fade to opacity 0 (0.18s, power2.out)

### List Item Animation
- Staggered fade-in for user list items
- Each item: y from 10 to 0, opacity 0 to 1
- Stagger: 0.05s between items
- Duration: 0.3s, ease: power2.out

## Consistency with Existing Modals

### Matching EditProfileModal Pattern
- Same overlay: `bg-black/40 backdrop-blur-xl`
- Same modal container: `border border-white/10 bg-[#050505]`
- Same header structure with close button
- Same footer with action buttons
- Same responsive behavior (mobile full-height, desktop centered)
- Same scrollbar styling (no-scrollbar class)

### Color Palette
- Background: `#050505`
- Text primary: `text-white`
- Text secondary: `text-gray-400` or `text-white/60`
- Borders: `border-white/10`
- Hover states: `hover:bg-white/5` or `hover:bg-white/10`
- Buttons: `bg-white text-black` for primary, `bg-white/5` for secondary

## Edge Cases
- Handle empty states (no followers/following)
- Handle loading states
- Handle error states
- Handle pagination (load more)
- Handle "friends" type (currently returns 0, may need backend implementation)
- Prevent modal from opening if userId is invalid

## Performance Considerations
- Use React.memo for user list items
- Implement virtual scrolling if list is very long
- Debounce search input if implemented
- Cancel pending requests on unmount
