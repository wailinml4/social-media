export default function formatStory(
  story: {
    _id: { toString: () => string }
    hasUnviewed?: boolean
    viewedBy?: { toString: () => string }[]
    author: { _id: { toString: () => string }; fullName: string; profilePicture?: string }
    slides: {
      _id: { toString: () => string }
      mediaUrl: string
      type: string
      caption: string
      duration: number
      timestamp: string
    }[]
    createdAt: string | Date
  },
  currentUserId: string,
) {
  const s = story
  const seen =
    s.hasUnviewed !== undefined
      ? !s.hasUnviewed
      : s.viewedBy?.some((viewerId: { toString: () => string }) => viewerId.toString() === currentUserId)
  return {
    id: s._id.toString(),
    user: {
      id: typeof s.author._id === 'string' ? s.author._id : s.author._id.toString(),
      name: s.author.fullName,
      avatar: s.author.profilePicture || '',
    },
    slides: s.slides.map(
      (slide: {
        _id: { toString: () => string }
        mediaUrl: string
        type: string
        caption: string
        duration: number
        timestamp: string
      }) => ({
        id: typeof slide._id === 'string' ? slide._id : slide._id.toString(),
        mediaUrl: slide.mediaUrl,
        type: slide.type,
        caption: slide.caption,
        duration: slide.duration,
        timestamp: slide.timestamp,
      }),
    ),
    seen,
    createdAt: s.createdAt,
  }
}
