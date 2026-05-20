import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { PROGRAMS, Program, ForecastEntry } from '../data/initialData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EditableCell: React.FC<{ value: number | null; onChange: (v: number | null) => void; suffix?: string }> = ({ value, onChange, suffix = '' }) => {
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
      {value === null ? <span className="text-gray-300">—</span> : `${value}${suffix}`}
    </button>
  );
};

const COLORS = ['#f59e0b', '#10b981', '#6366f1', '#ec4899'];

const ForecastView: React.FC = () => {
  const { data, updateForecast } = useDashboard();

  const chartData = data.forecast.map(f => ({
    month: f.month,
    Preschool: f.preschool ?? 0,
    StorySparks: f.storysparks ?? 0,
    'Weekend Playschool': f.weekendPlayschool ?? 0,
    'Primary Daycare': f.primaryDaycare ?? 0,
  }));

  const rowTotals = data.forecast.map(f =>
    (f.preschool ?? 0) + (f.storysparks ?? 0) + (f.weekendPlayschool ?? 0) + (f.primaryDaycare ?? 0)
  );

  const progTotals = PROGRAMS.map(p => data.forecast.reduce((s, f) => s + (f[p.key as keyof ForecastEntry] as number ?? 0), 0));

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">6-month enrollment forecast with conversion rate assumptions. Click any cell to edit.</p>

      {/* Forecast Chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Projected Enrollments — 6 Month Forecast</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              {PROGRAMS.map((p, i) => (
                <linearGradient key={p.key} id={`grad-${p.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[i]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS[i]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {PROGRAMS.map((p, i) => (
              <Area key={p.key} type="monotone" dataKey={p.label} stroke={COLORS[i]} fill={`url(#grad-${p.key})`} strokeWidth={2} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Forecast Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700">Enrollment Forecast by Program</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Month</th>
                {PROGRAMS.map(p => (
                  <th key={p.key} className="text-center px-4 py-3 font-semibold" style={{ color: p.color }}>{p.label}</th>
                ))}
                <th className="text-center px-4 py-3 font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.forecast.map((f, i) => (
                <tr key={f.month} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">{f.month} 2026</td>
                  {PROGRAMS.map(p => (
                    <td key={p.key} className="text-center px-4 py-3">
                      <EditableCell value={f[p.key as keyof ForecastEntry] as number | null} onChange={v => updateForecast(i, p.key as keyof ForecastEntry, v)} />
                    </td>
                  ))}
                  <td className="text-center px-4 py-3 font-bold text-gray-800">
                    {rowTotals[i] > 0 ? rowTotals[i] : <span className="text-gray-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t-2 border-gray-200">
                <td className="px-4 py-3 font-bold text-gray-700">Total</td>
                {progTotals.map((t, i) => (
                  <td key={PROGRAMS[i].key} className="text-center px-4 py-3 font-bold" style={{ color: PROGRAMS[i].color }}>
                    {t > 0 ? t : <span className="text-gray-300">—</span>}
                  </td>
                ))}
                <td className="text-center px-4 py-3 font-bold text-gray-800 text-base">
                  {progTotals.reduce((a, b) => a + b, 0) || <span className="text-gray-300">—</span>}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Conversion Rate Assumptions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700">Conversion Rate Assumptions (%)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Rate</th>
                {data.forecast.map(f => (
                  <th key={f.month} className="text-center px-4 py-3 font-semibold text-gray-500">{f.month}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { field: 'leadToTour' as keyof ForecastEntry, label: 'Lead → Tour %' },
                { field: 'tourToInterview' as keyof ForecastEntry, label: 'Tour → Interview %' },
                { field: 'interviewToOffer' as keyof ForecastEntry, label: 'Interview → Offer %' },
                { field: 'offerToEnrollment' as keyof ForecastEntry, label: 'Offer → Enrollment %' },
              ].map(row => (
                <tr key={row.field} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{row.label}</td>
                  {data.forecast.map((f, i) => (
                    <td key={f.month} className="text-center px-4 py-3">
                      <EditableCell
                        value={f[row.field] as number | null}
                        onChange={v => updateForecast(i, row.field, v)}
                        suffix="%"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ForecastView;
