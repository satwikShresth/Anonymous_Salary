import { CheckCircle2 } from 'lucide-react';

export function PreviewHeader() {
	return (
		<div className="flex items-center gap-3 text-green-600 mb-8">
			<CheckCircle2 className="w-6 h-6" />
			<h2 className="text-xl font-semibold">Review Your Information</h2>
		</div>
	);
}
