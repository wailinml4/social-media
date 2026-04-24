import React from 'react';

import Card from '../ui/Card';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <Card className="feature-card p-8 group hover:border-primary/50 transition-colors">
    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
    <p className="text-text-dim leading-relaxed">
      {description}
    </p>
  </Card>
);

export default FeatureCard;
