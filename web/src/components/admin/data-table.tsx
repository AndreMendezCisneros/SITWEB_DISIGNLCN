export type DataColumn<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
};

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  empty = "Sin registros",
}: {
  columns: DataColumn<T>[];
  rows: T[];
  empty?: string;
}) {
  if (!rows.length) {
    return (
      <div className="cms-card px-6 py-12 text-center text-sm text-neutral-500">
        {empty}
      </div>
    );
  }

  return (
    <div className="cms-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/[0.04]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-neutral-500"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-black/[0.03] last:border-0 transition hover:bg-neutral-50/80"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5 align-middle">
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
