export default function ApiTable({ title, rows, columns, onEdit, onDelete, onCustomAction, customActions = [], actionsLabel = 'Actions' }) {
  const hasActions = Boolean(onEdit || onDelete || (customActions && customActions.length > 0));

  return (
    <div className="glass overflow-hidden rounded-3xl">
      <div className="border-b border-white/10 px-4 py-4 sm:px-6">
        <h4 className="text-lg font-bold text-white">{title}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium uppercase tracking-[0.18em]">
                  {column.label}
                </th>
              ))}
              {hasActions && (
                <th className="px-4 py-3 font-medium uppercase tracking-[0.18em]">
                  {actionsLabel}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-400" colSpan={columns.length + (hasActions ? 1 : 0)}>
                  No data yet.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-white/5">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-slate-200">
                      {column.render ? column.render(row) : row[column.key] ?? '-'}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-4 py-3 text-slate-200">
                      <div className="flex flex-wrap gap-2">
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(row)}
                            className="rounded-full border border-sfBlue/40 bg-sfBlue/10 px-3 py-1 text-xs font-semibold text-sky-200 transition hover:bg-sfBlue/25"
                          >
                            Edit
                          </button>
                        )}
                        {customActions.map((action) => (
                          <button
                            key={action.id}
                            type="button"
                            onClick={() => action.onClick(row)}
                            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${action.className || 'border-sfRed/40 bg-sfRed/10 text-rose-200 hover:bg-sfRed/25'}`}
                          >
                            {action.label}
                          </button>
                        ))}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(row)}
                            className="rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/25"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}