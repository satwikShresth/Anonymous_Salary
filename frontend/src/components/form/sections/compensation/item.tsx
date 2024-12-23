import { DollarSign, X } from 'lucide-react';
import { Slider } from '../../../ui/slider';
import type { CompensationItem as CompensationItemType, CompensationRange, CompensationType } from '../../../../types/compensation';
import { compensationTypes } from '../../../../types/compensation';

interface CompensationItemProps {
	item: CompensationItemType;
	onChange: (item: CompensationItemType) => void;
	onRemove: () => void;
	isHourlyRate?: boolean;
	showError?: boolean;
}


const compensationRanges: Record<CompensationType, CompensationRange> = {
	Hourly: {
		min: 10,
		max: 120,
		step: 0.5,
		unit: '$/hr',
	},
	Stipend: {
		min: 100,
		max: 1000,
		step: 50,
		unit: '$/week',
	},
	Bonus: {
		min: 1000,
		max: 10000,
		step: 500,
		unit: '$'
	},
	Housing: {
		min: 500,
		max: 5000,
		step: 100,
		unit: '$/month',
	},
	Transportation: {
		min: 50,
		max: 500,
		step: 25,
		unit: '$/month',
	},
	Food: {
		min: 100,
		max: 1000,
		step: 50,
		unit: '$/month',
	},
	Other: {
		min: 0,
		max: 10000,
		step: 100,
		unit: '$'
	}
};

export function CompensationItem({
	item,
	onChange,
	onRemove,
	isHourlyRate,
	showError
}: CompensationItemProps) {
	const range = compensationRanges[item.type];

	const handleTypeChange = (newType: CompensationItemType['type']) => {
		const newRange = compensationRanges[newType];

		onChange({
			...item,
			type: newType,
			amount: (newRange.min + ((newRange.max - newRange.min) * 0.3))
		});
	};

	return (
		<div className={`p-4 border rounded-lg space-y-4 ${showError ? 'border-red-300 bg-red-50' : 'border-gray-200'
			}`}>
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium text-gray-700">
					{isHourlyRate ? 'Hourly Rate' : (
						<select
							value={item.type}
							onChange={(e) => handleTypeChange(e.target.value as CompensationItemType['type'])}
							className="bg-transparent border-none focus:ring-0 p-0 pr-8"
						>
							{compensationTypes.map((type) => (
								<option key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</select>
					)}
				</span>
				{!isHourlyRate && (
					<button
						type="button"
						onClick={onRemove}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<X className="w-4 h-4" />
					</button>
				)}
			</div>

			<div className="space-y-4">
				<div>
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center gap-2">
							<DollarSign className="w-4 h-4 text-gray-500" />
							<span className="text-sm font-medium text-gray-700">Amount</span>
						</div>
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								checked={item.isNotApplicable}
								onChange={(e) => onChange({
									...item,
									isNotApplicable: e.target.checked,
									amount: e.target.checked ? null : range.min
								})}
								className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span className="text-sm text-gray-600">N/A</span>
						</label>
					</div>
					{!item.isNotApplicable && (
						<Slider
							value={item.amount || range.min}
							onChange={(value) => onChange({ ...item, amount: value })}
							min={range.min}
							max={range.max}
							step={range.step}
							disabled={item.isNotApplicable}
							unit={range.unit}
							displayPrefix={range.suffix}
						/>
					)}
					{showError && (
						<p className="mt-1 text-sm text-red-600">
							Please enter a valid amount or mark as N/A
						</p>
					)}
				</div>

				<label className="block">
					<span className="text-sm font-medium text-gray-700">Description</span>
					<textarea
						value={item.description}
						onChange={(e) => onChange({ ...item, description: e.target.value })}
						className="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
						rows={2}
						placeholder="Add details about this compensation..."
					/>
				</label>
			</div>
		</div>
	);
}
