import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { PROGRAMS, Program } from '../data/initialData';

const EditableCell: React.FC<{ value: number | null; onChange: (v: number | null) => void }> = ({ value, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value === null ? '' : String(value));

  if (editing) {
    return (
      <input
        autoFocus
        className="w-16 text-center border border-indigo-400 rounded px-1 text-sm"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => {
          const n = draft === '' ? null : Number(draft);
          onChange(isNaN(n as number) ? null : n);
          setEditing(false);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            const n = draft === '' ? null : Number(draft);
            onChange(isNaN(n as number) ? null : n);
            setEditing(false);
          }
        }}
      />
    );
  }
  return (
    <button
      onClick={() => { setDraft(value === null ? '' : String(value)); setEditing(true); }}
      className="w-16 text-center rounded px-1 text-sm cursor-pointer hover:bg-gray-100 transition-colors text-gray-700 font-medium"
    >
      {value === null ? <span className="text-gray-300">—</span> : value}
    </button>
  );
};

const MonthlyView: React.FC = () => {
  const { data, updateMonthly } = useDashboard();

  const totals = PROGRAMS.map(p => {
    return data.monthly.reduce((sum, m) => sum + (m[p.key] ?? 0), 0);
  });

  const rowTotals = data.monthly.map(m =>
    (m.preschool ?? 0) + (m.storysparks ?? 0) + (m.weekendPlayschool ?? 0) + (m.primaryDaycare ?? 0)
  );

  const grandTotal = totals.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Track monthly enrollment completions per program. Click any cell to edit.</p>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Month</th>
                {PROGRAMS.map(p => (
                  <th key={p.key} className="text-center px-4 py-3 font-semibold" style={{ color: p.color }}>{p.label}</th>
                ))}
                <th className="text-center px-4 py-3 font-semibold text-gray-700">Monthly Total</th>
              </tr>
            </thead>
            <tbody>
              {data.monthly.map((m, i) => (
                <tr key={m.month} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">{m.month}</td>
                  {PROGRAMS.map(p => (
                    <td key={p.key} className="text-center px-4 py-3">
                      <EditableCell value={m[p.key]} onChange={v => updateMonthly(i, p.key as Program, v)} />
                    </td>
                  ))}
                  <td className="text-center px-4 py-3 font-bold text-gray-800">{rowTotals[i] || <span className="text-gray-300">—</span>}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t-2 border-gray-200">
                <td className="px-4 py-3 font-bold text-gray-700">6-Month Total</td>
                {totals.map((t, i) => (
                  <td key={PROGRAMS[i].key} className="text-center px-4 py-3 font-bold" style={{ color: PROGRAMS[i].color }}>{t || <span className="text-gray-300">—</span>}</td>
                ))}
                <td className="text-center px-4 py-3 font-bold text-gray-800 text-base">{grandTotal || <span className="text-gray-300">—</span>}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PROGRAMS.map((p, i) => (
          <div key={p.key} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="text-xs font-semibold text-gray-400 mb-1">{p.label}</div>
            <div className="text-2xl font-bold mb-1" style={{ color: p.color }}>{totals[i]}</div>
            <div className="text-xs text-gray-400">6-month enrollments</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyView;
