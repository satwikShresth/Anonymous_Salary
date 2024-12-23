import { flexRender, Row } from '@tanstack/react-table';
import type { JobData } from '../../types/job';

interface TableBodyProps {
  rows: Row<JobData>[];
  densePadding: boolean;
}

export function TableBody({ rows, densePadding }: TableBodyProps) {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {rows.map((row) => (
        <tr key={row.id} className="hover:bg-blue-50 transition-colors duration-150">
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className={`px-6 ${densePadding ? 'py-2' : 'py-4'} text-sm text-gray-900`}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}