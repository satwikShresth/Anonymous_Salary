import React from 'react';

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
        {icon}
        {label}
      </div>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  );
}
