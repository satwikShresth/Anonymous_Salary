import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color: 'blue' | 'green' | 'purple';
}

export function Badge({ children, color }: BadgeProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}>
      {children}
    </span>
  );
}
