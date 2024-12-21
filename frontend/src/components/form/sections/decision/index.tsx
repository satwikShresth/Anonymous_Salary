import { CheckCircle2, FileText } from 'lucide-react';
import { RadioGroup } from '../../../ui/radio';
import type { JobData } from '../../../../types/job';
import { JobData } from '../../../../types/job';

interface DecisionSectionProps {
  formData: JobData;
  onChange: (data: Partial<JobData>) => void;
}

export function DecisionSection({ formData, onChange }: DecisionSectionProps) {
  return (
    <div className= "space-y-6" >
    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2" >
      <CheckCircle2 className="w-5 h-5 text-blue-600" />
        Decision Details(Optional)
          </h2>

          < div className = "grid grid-cols-1 lg:grid-cols-2 gap-6" >
            <RadioGroup
          label="Offer Status"
  options = { ['Offered', 'Qualified Alternative']}
  value = { formData.offerStatus }
  onChange = {(value) => onChange({ offerStatus: value as JobData['offerStatus'] })
}
type = "status"
optional
  />

  <RadioGroup
          label="Decision"
options = { ['Accepted', 'Ranked']}
value = { formData.decision }
onChange = {(value) => onChange({ decision: value as JobData['decision'] })}
type = "decision"
optional
  />

  <div className="lg:col-span-2 space-y-2" >
    <label className="block text-sm font-medium text-gray-700" >
      <div className="flex items-center gap-2" >
        <FileText className="w-4 h-4 text-gray-500" />
          Reason for Decision(Optional)
            </div>
            </label>
            < textarea
            value = { formData.decisionReason }
            onChange = {(e) => onChange({ decisionReason: e.target.value })}
className = "w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
rows = { 3}
placeholder = "Why did you make this decision?"
  />
  </div>

  < div className = "lg:col-span-2 space-y-2" >
    <label className="block text-sm font-medium text-gray-700" >
      <div className="flex items-center gap-2" >
        <FileText className="w-4 h-4 text-gray-500" />
          Other Notes(Optional)
            </div>
            </label>
            < textarea
value = { formData.otherNotes }
onChange = {(e) => onChange({ otherNotes: e.target.value })}
className = "w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
rows = { 3}
placeholder = "Any additional information you'd like to share..."
  />
  </div>
  </div>
  </div>
  );
}
