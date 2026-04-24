export const mockNotifications = [
  {
    id: 1,
    type: 'like',
    users: [
      { name: 'Alice Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
      { name: 'David Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' }
    ],
    text: 'liked your post',
    postPreview: 'Just launched my new open source project! It aims to simplify state management in React applications. 🚀',
    time: '2h'
  },
  {
    id: 2,
    type: 'follow',
    users: [
      { name: 'Emma Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' }
    ],
    text: 'followed you',
    time: '5h'
  },
  {
    id: 3,
    type: 'reply',
    users: [
      { name: 'Tech Insider', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech' }
    ],
    text: 'replied: "This is exactly what I was looking for. Great work!"',
    postPreview: 'CSS Tip: Use `clamp()` for fluid typography that scales perfectly across all screen sizes.',
    time: '12h'
  },
  {
    id: 4,
    type: 'mention',
    users: [
      { name: 'Frontend Daily', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frontend' }
    ],
    text: 'mentioned you in a post: "Check out this amazing portfolio by @yourhandle, truly inspiring work."',
    time: '1d'
  }
];
