export const currentUser = { id: 'u1', name: 'Wailin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wailin' };

export const mockChats = [
  {
    id: 'c1',
    user: { id: 'u2', name: 'Alice Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', online: true },
    lastMessage: 'Sounds good, see you then!',
    timestamp: '10:42 AM',
    unread: 2,
  },
  {
    id: 'c2',
    user: { id: 'u3', name: 'David Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', online: false },
    lastMessage: 'Can you send me the latest designs?',
    timestamp: 'Yesterday',
    unread: 0,
  },
  {
    id: 'c3',
    user: { id: 'u4', name: 'Emma Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', online: true },
    lastMessage: 'Just finished the new landing page!',
    timestamp: 'Tuesday',
    unread: 1,
  },
  {
    id: 'c4',
    user: { id: 'u5', name: 'Tech Insider', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech', online: false },
    lastMessage: 'Check out this new AI tool.',
    timestamp: 'Monday',
    unread: 0,
  }
];

export const mockMessages = {
  'c1': [
    { id: 'm1', senderId: 'u2', text: 'Hey, are we still on for tomorrow?', createdAt: '10:30 AM' },
    { id: 'm2', senderId: 'u1', text: 'Yes! Let\'s meet at the usual place.', createdAt: '10:35 AM' },
    { id: 'm3', senderId: 'u2', text: 'Sounds good, see you then!', createdAt: '10:42 AM' },
  ],
  'c2': [
    { id: 'm4', senderId: 'u3', text: 'Hey, how is the progress going?', createdAt: 'Yesterday' },
    { id: 'm5', senderId: 'u1', text: 'Almost done. Just polishing the UI.', createdAt: 'Yesterday' },
    { id: 'm6', senderId: 'u3', text: 'Can you send me the latest designs?', createdAt: 'Yesterday' },
  ],
  'c3': [
    { id: 'm7', senderId: 'u4', text: 'I started working on the GSAP animations.', createdAt: 'Tuesday' },
    { id: 'm8', senderId: 'u1', text: 'Awesome! Let me know if you need help.', createdAt: 'Tuesday' },
    { id: 'm9', senderId: 'u4', text: 'Just finished the new landing page!', createdAt: 'Tuesday' },
  ]
};
