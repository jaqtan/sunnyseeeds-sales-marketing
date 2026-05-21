import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  FunnelChart, Funnel, LabelList, Cell,
  LineChart, Line,
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { PROGRAMS, MONTHLY_PROGRAMS } from '../data/initialData';

const COLORS = ['#f59e0b', '#10b981', '#6366f1', '#ec4899'];
const MONTHLY_COLORS = ['#f59e0b', '#f97316', '#10b981', '#6366f1', '#ec4899', '#14b8a6'];

const AnalyticsView: React.FC = () => {
  const { data, getConversionRates, getDropoffs, getTotals } = useDashboard();

  // Bar chart: Actual vs Target per program
  const barData = PROGRAMS.map((p, i) => {
    const d = data.programs[p.key];
    return {
      program: p.label,
      Leads: d.organicLeads + d.paidLeads + d.partnershipLeads,
      'Target Leads': d.targetLeads,
      Enrollments: d.enrollmentsCompleted,
      'Target Enrollments': d.targetEnrollments,
    };
  });

  // Funnel chart data
  const totals = getTotals();
  const funnelData = [
    { name: 'Total Leads', value: totals.organicLeads + totals.paidLeads + totals.partnershipLeads, fill: '#f59e0b' },
    { name: 'Tours', value: totals.toursCompleted, fill: '#6366f1' },
    { name: 'Interviews', value: totals.interviewsConducted, fill: '#ec4899' },
    { name: 'Offers', value: totals.offersSent, fill: '#8b5cf6' },
    { name: 'Enrollments', value: totals.enrollmentsCompleted, fill: '#10b981' },
  ];

  // Drop-off analysis
  const dropoffData = PROGRAMS.map((p) => {
    const d = getDropoffs(p.key);
    return {
      program: p.label,
      'Tour Drop-off %': parseFloat(d.tourToInterviewDropoff.toFixed(1)),
      'Interview Drop-off %': parseFloat(d.interviewToOfferDropoff.toFixed(1)),
      'Offer Drop-off %': parseFloat(d.offerToEnrollmentDropoff.toFixed(1)),
    };
  });

  // Monthly chart — 6 programs
  const monthlyData = data.monthly.map(m => {
    const row: Record<string, string | number> = { month: m.month.replace(' 2026', '') };
    MONTHLY_PROGRAMS.forEach(p => { row[p.label] = m[p.key] ?? 0; });
    return row;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads vs Enrollments */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Actual vs Target by Program</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="program" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Leads" fill="#f59e0b" radius={[3,3,0,0]} />
              <Bar dataKey="Target Leads" fill="#fde68a" radius={[3,3,0,0]} />
              <Bar dataKey="Enrollments" fill="#10b981" radius={[3,3,0,0]} />
              <Bar dataKey="Target Enrollments" fill="#a7f3d0" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Funnel */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Enrollment Funnel (All Programs)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <FunnelChart>
              <Tooltip />
              <Funnel dataKey="value" data={funnelData} isAnimationActive>
                <LabelList position="right" fill="#374151" stroke="none" dataKey="name" style={{ fontSize: 12 }} />
                {funnelData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        {/* Drop-off Analysis */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Drop-off Analysis by Program (%)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dropoffData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="program" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(v: any) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Tour Drop-off %" fill="#f59e0b" radius={[3,3,0,0]} />
              <Bar dataKey="Interview Drop-off %" fill="#6366f1" radius={[3,3,0,0]} />
              <Bar dataKey="Offer Drop-off %" fill="#ec4899" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Enrollment Trend */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Monthly Enrollment Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {MONTHLY_PROGRAMS.map((p, i) => (
                <Line key={p.key} type="monotone" dataKey={p.label} stroke={MONTHLY_COLORS[i]} strokeWidth={2} dot={{ r: 4 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion Rate Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700">Conversion Rate Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-500">Program</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500">Lead → Tour</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500">Tour → Interview</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500">Interview → Offer</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500">Offer → Enrollment</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500">Overall Rate</th>
              </tr>
            </thead>
            <tbody>
              {PROGRAMS.map((p) => {
                const r = getConversionRates(p.key);
                const fmt = (v: number) => v === 0 ? <span className="text-gray-300">—</span> : (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${v >= 70 ? 'bg-green-100 text-green-700' : v >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
                    {v.toFixed(1)}%
                  </span>
                );
                return (
                  <tr key={p.key} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium" style={{ color: p.color }}>{p.label}</td>
                    <td className="text-center px-4 py-3">{fmt(r.leadToTour)}</td>
                    <td className="text-center px-4 py-3">{fmt(r.tourToInterview)}</td>
                    <td className="text-center px-4 py-3">{fmt(r.interviewToOffer)}</td>
                    <td className="text-center px-4 py-3">{fmt(r.offerToEnrollment)}</td>
                    <td className="text-center px-4 py-3">{fmt(r.overall)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
