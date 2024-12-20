import React from 'react';

interface PreviewItemProps {
	icon: React.ReactNode;
	label: string;
	value: string;
	multiline?: boolean;
}

export function PreviewItem({ icon, label, value, multiline }: PreviewItemProps) {
	return (
		<div className="space-y-1">
			<div className="flex items-center gap-2 text-gray-500 text-sm">
				{icon}
				{label}
			</div>
			<div className={`font-medium text-gray-900 ${multiline ? 'whitespace-pre-line' : ''}`}>
				{value}
			</div>
		</div>
	);
}
