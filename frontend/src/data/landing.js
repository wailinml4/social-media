import { Globe, Heart, MessageCircle, Shield, Sparkles, Zap } from 'lucide-react';

export const landingMockPosts = [
  {
    name: "Elena Rodriguez",
    handle: "@elenar",
    time: "Just now",
    content: "Just launched my new design system! 🚀 It's fully open source and built with React and Tailwind CSS. The new Nexus interface is so clean.",
    likes: "1.2k",
    comments: "48"
  },
  {
    name: "Marcus Chen",
    handle: "@marcus_dev",
    time: "2h",
    content: "The serenity of morning coding sessions. Just a cup of coffee, lo-fi beats, and a clear mind. What are you building today? ☕️💻",
    likes: "856",
    comments: "124"
  },
  {
    name: "Sarah Jenkins",
    handle: "@sarahj",
    time: "5h",
    content: "Thinking about the future of AI in product design. It's not about replacing designers, it's about giving them superpowers. 🧠✨",
    likes: "2.4k",
    comments: "312",
    className: "opacity-70"
  }
];

export const testimonials = [
  { 
    name: "Alex Rivera", 
    role: "UI Designer", 
    text: "Nexus has completely changed how I share my work. The signal-to-noise ratio is incredible. It feels like the early days of social media, but better." 
  },
  { 
    name: "Sam Chen", 
    role: "Indie Developer", 
    text: "Finally, a platform that doesn't punish me for not posting every day. My audience sees my updates when they matter. The UI is absolutely gorgeous too." 
  },
  { 
    name: "Jordan Lee", 
    role: "Content Creator", 
    text: "The chronological feed option alone is worth it. But the sheer speed of the app and the quality of interactions keep me coming back." 
  }
];

export const landingFeatures = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built on cutting-edge edge infrastructure. Content loads instantly, anywhere in the world, giving your users a seamless experience."
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is yours. We use end-to-end encryption and never sell your personal information to advertisers. Ever."
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Our intelligent discovery algorithm connects your content with people who will actually love it, organically."
  },
  {
    icon: MessageCircle,
    title: "Rich Interactions",
    description: "Engage with your audience using threaded conversations, voice notes, and high-quality media sharing."
  },
  {
    icon: Heart,
    title: "Monetization",
    description: "Built-in tools to monetize your audience directly. Keep 100% of your earnings with our zero-fee platform."
  },
  {
    icon: Sparkles,
    title: "AI Enhanced",
    description: "Smart content suggestions, automated captions, and analytics powered by ethical AI models."
  }
];
