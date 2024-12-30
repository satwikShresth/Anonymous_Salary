
	export const compensationTypes = [
		{ value: 'Hourly', label: 'Hourly' },
		{ value: 'Stipend', label: 'Stipend' },
		{ value: 'Bonus', label: 'Bonus' },
		{ value: 'Housing', label: 'Housing' },
		{ value: 'Transportation', label: 'Transportation' },
		{ value: 'Food', label: 'Food' },
		{ value: 'Other', label: 'Other' }
	];
	export const compensationRanges = {
		Hourly: {
			min: 10,
			max: 120,
			step: 0.5,
			unit: '$/hr'
		},
		Stipend: {
			min: 100,
			max: 1000,
			step: 50,
			unit: '$/week'
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
			unit: '$/month'
		},
		Transportation: {
			min: 50,
			max: 500,
			step: 25,
			unit: '$/month'
		},
		Food: {
			min: 100,
			max: 1000,
			step: 50,
			unit: '$/month'
		},
		Other: {
			min: 0,
			max: 10000,
			step: 100,
			unit: '$'
		}
	};
