export const mockComments = [
  {
    id: 101,
    postId: 1,
    user: {
      name: 'Emma Wilson',
      handle: 'emma_codes',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
    },
    text: 'This looks incredible! I love the glassmorphism aesthetic you went for. 😍',
    time: '45m',
    likes: 12,
    replies: [
      {
        id: 1011,
        user: {
          name: 'Alice Johnson',
          handle: 'alice_j',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
        },
        text: 'Thank you Emma! The glass effect was the hardest part to get right.',
        time: '30m'
      }
    ]
  },
  {
    id: 102,
    postId: 1,
    user: {
      name: 'Marcus Chen',
      handle: 'marcus_dev',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus'
    },
    text: 'Is this open source? I would love to contribute to the UI library.',
    time: '1h',
    likes: 8,
    replies: []
  },
  {
    id: 103,
    postId: 1,
    user: {
      name: 'Sarah Jenkins',
      handle: 'sarahj',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    text: 'The animations are so smooth. Are you using GSAP for everything?',
    time: '2h',
    likes: 24,
    replies: []
  },
  {
    id: 104,
    postId: 2,
    user: {
      name: 'Tech Insider',
      handle: 'techinsider',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech'
    },
    text: 'Glassmorphism is definitely here to stay. It works so well with dark mode.',
    time: '3h',
    likes: 45,
    replies: []
  }
];
