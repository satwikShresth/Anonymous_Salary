import { TablePagination } from '@mui/material';

interface TablePaginationBarProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TablePaginationBar({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: TablePaginationBarProps) {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={[5, 10, 25, 50]}
    />
  );
}
