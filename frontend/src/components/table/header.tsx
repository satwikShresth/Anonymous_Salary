import { flexRender, HeaderGroup } from '@tanstack/react-table';
import type { JobData } from '../../types/job';

interface TableHeaderProps {
  headerGroups: HeaderGroup<JobData>[];
}

export function TableHeader({ headerGroups }: TableHeaderProps) {
  return (
    <thead className="bg-gray-50">
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className={`px-6 py-2 text-left text-sm font-semibold text-gray-700 border-b border-gray-200`}
            >
              {header.isPlaceholder ? null : flexRender(
                header.column.columnDef.header,
                header.getContext()
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}

