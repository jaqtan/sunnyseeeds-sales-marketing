import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { PROGRAMS, Program } from '../data/initialData';
import { ChevronDown, ChevronRight } from 'lucide-react';

const STAGES = [
  { key: 'leads', label: 'Stage 1: Lead Capture', color: '#f59e0b', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  { key: 'tours', label: 'Stage 2: Tour / Interview', color: '#6366f1', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
  { key: 'offers', label: 'Stage 3: Offer', color: '#ec4899', bgColor: 'bg-pink-50', borderColor: 'border-pink-200' },
  { key: 'enrollment', label: 'Stage 4: Enrollment', color: '#10b981', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
];

const EditableCell: React.FC<{
  value: number;
  onChange: (v: number) => void;
  highlight?: boolean;
}> = ({ value, onChange, highlight }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  if (editing) {
    return (
      <input
        autoFocus
        className="w-16 text-center border border-indigo-400 rounded px-1 text-sm"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => { onChange(Number(draft) || 0); setEditing(false); }}
        onKeyDown={e => { if (e.key === 'Enter') { onChange(Number(draft) || 0); setEditing(false); } }}
      />
    );
  }
  return (
    <button
      onClick={() => { setDraft(String(value)); setEditing(true); }}
      className={`w-16 text-center rounded px-1 text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors ${highlight ? 'text-indigo-700' : 'text-gray-700'}`}
    >
      {value}
    </button>
  );
};

const FunnelView: React.FC = () => {
  const { data, updateProgram, getTotals, getConversionRates } = useDashboard();
  const totals = getTotals();
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  const stageTotals = [
    totals.organicLeads + totals.paidLeads + totals.partnershipLeads,
    totals.toursCompleted,
    totals.offersSent,
    totals.enrollmentsCompleted,
  ];

  const stageTargets = [totals.targetLeads, totals.targetTours, totals.targetOffers, totals.targetEnrollments];

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Click any number to edit. Track leads through each stage of the enrollment funnel.</p>

      {/* Funnel Visual */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {STAGES.map((stage, i) => {
          const max = stageTotals[0] || 1;
          const pct = (stageTotals[i] / max) * 100;
          return (
            <div key={stage.key} className={`${stage.bgColor} ${stage.borderColor} border rounded-xl p-4 text-center`}>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{stage.label}</div>
              <div className="text-4xl font-bold mb-1" style={{ color: stage.color }}>{stageTotals[i]}</div>
              <div className="text-xs text-gray-400 mb-3">Target: {stageTargets[i]}</div>
              <div className="h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: stage.color }} />
              </div>
              <div className="text-xs text-gray-400 mt-1">{pct.toFixed(0)}% of leads</div>
            </div>
          );
        })}
      </div>

      {/* Program-level Detail Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-52">Metric</th>
                {PROGRAMS.map(p => (
                  <th key={p.key} className="text-center px-3 py-3 font-semibold" style={{ color: p.color }}>{p.label}</th>
                ))}
                <th className="text-center px-3 py-3 font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {/* Stage 1 */}
              <tr className="bg-amber-50">
                <td colSpan={6} className="px-4 py-2 text-xs font-bold text-amber-700 uppercase tracking-wide cursor-pointer hover:bg-amber-100"
                    onClick={() => setExpandedStage(expandedStage === 'leads' ? null : 'leads')}>
                  <span className="flex items-center gap-1">
                    {expandedStage === 'leads' ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                    Stage 1: Lead Capture
                  </span>
                </td>
              </tr>
              {expandedStage === 'leads' && (
                <>
                  <tr className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-600 pl-8">Organic Leads</td>
                    {PROGRAMS.map(p => (
                      <td key={p.key} className="text-center px-3 py-2">
                        <EditableCell value={data.programs[p.key].organicLeads} onChange={v => updateProgram(p.key, 'organicLeads', v)} />
                      </td>
                    ))}
                    <td className="text-center px-3 py-2 font-semibold text-gray-700">{totals.organicLeads}</td>
                  </tr>
                  <tr className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-600 pl-8">Paid Leads</td>
                    {PROGRAMS.map(p => (
                      <td key={p.key} className="text-center px-3 py-2">
                        <EditableCell value={data.programs[p.key].paidLeads} onChange={v => updateProgram(p.key, 'paidLeads', v)} />
                      </td>
                    ))}
                    <td className="text-center px-3 py-2 font-semibold text-gray-700">{totals.paidLeads}</td>
                  </tr>
                  <tr className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-600 pl-8">Partnership / Referral</td>
                    {PROGRAMS.map(p => (
                      <td key={p.key} className="text-center px-3 py-2">
                        <EditableCell value={data.programs[p.key].partnershipLeads} onChange={v => updateProgram(p.key, 'partnershipLeads', v)} />
                      </td>
                    ))}
                    <td className="text-center px-3 py-2 font-semibold text-gray-700">{totals.partnershipLeads}</td>
                  </tr>
                </>
              )}
              <tr className="border-b border-gray-50 hover:bg-gray-50 font-medium">
                <td className="px-4 py-2 text-gray-700">Total Leads</td>
                {PROGRAMS.map(p => {
                  const d = data.programs[p.key];
                  return <td key={p.key} className="text-center px-3 py-2 font-bold" style={{ color: p.color }}>{d.organicLeads + d.paidLeads + d.partnershipLeads}</td>;
                })}
                <td className="text-center px-3 py-2 font-bold text-gray-800">{stageTotals[0]}</td>
              </tr>
              <tr className="border-b border-gray-50 hover:bg-gray-50 bg-amber-50/50">
                <td className="px-4 py-2 text-gray-500 text-xs">Target Leads</td>
                {PROGRAMS.map(p => (
                  <td key={p.key} className="text-center px-3 py-2">
                    <EditableCell value={data.programs[p.key].targetLeads} onChange={v => updateProgram(p.key, 'targetLeads', v)} highlight />
                  </td>
                ))}
                <td className="text-center px-3 py-2 text-xs text-gray-500">{totals.targetLeads}</td>
              </tr>

              {/* Stage 2 */}
              <tr className="bg-indigo-50">
                <td colSpan={6} className="px-4 py-2 text-xs font-bold text-indigo-700 uppercase tracking-wide cursor-pointer hover:bg-indigo-100"
                    onClick={() => setExpandedStage(expandedStage === 'tours' ? null : 'tours')}>
                  <span className="flex items-center gap-1">
                    {expandedStage === 'tours' ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                    Stage 2: Tour / Interview
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-700">Tours Completed</td>
                {PROGRAMS.map(p => (
                  <td key={p.key} className="text-center px-3 py-2">
                    <EditableCell value={data.programs[p.key].toursCompleted} onChange={v => updateProgram(p.key, 'toursCompleted', v)} />
                  </td>
                ))}
                <td className="text-center px-3 py-2 font-bold text-gray-800">{totals.toursCompleted}</td>
              </tr>
              <tr className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-700">Interviews Conducted</td>
                {PROGRAMS.map(p => (
                  <td key={p.key} className="text-center px-3 py-2">
                    <EditableCell value={data.programs[p.key].interviewsConducted} onChange={v => updateProgram(p.key, 'interviewsConducted', v)} />
                  </td>
                ))}
                <td className="text-center px-3 py-2 font-bold text-gray-800">{totals.interviewsConducted}</td>
              </tr>
              <tr className="border-b border-gray-50 hover:bg-gray-50 bg-indigo-50/50">
                <td className="px-4 py-2 text-gray-500 text-xs">Target Tours</td>
                {PROGRAMS.map(p => (
                  <td key={p.key} className="text-center px-3 py-2">
                    <EditableCell value={data.programs[p.key].targetTours} onChange={v => updateProgram(p.key, 'targetTours', v)} highlight />
                  </td>
                ))}
                <td className="text-center px-3 py-2 text-xs text-gray-500">{totals.targetTours}</td>
              </tr>

              {/* Stage 3 */}
              <tr className="bg-pink-50">
                <td colSpan={6} className="px-4 py-2 text-xs font-bold text-pink-700 uppercase tracking-wide">Stage 3: Offer</td>
              </tr>
              <tr className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-700">Offer Letters Sent</td>
                {PROGRAMS.map(p => (
                  <td key={p.key} className="text-center px-3 py-2">
                    <EditableCell value={data.programs[p.key].offersSent} onChange={v => updateProgram(p.key, 'offersSent', v)} />
                  </td>
                ))}
                <td className="text-center px-3 py-2 font-bold text-gray-800">{totals.offersSent}</td>
              </tr>
              <tr className="border-b border-gray-50 hover:bg-gray-50 bg-pink-50/50">
                <td className="px-4 py-2 text-gray-500 text-xs">Target Offers</td>
                {PROGRAMS.map(p => (
                  <td key={p.key} className="text-center px-3 py-2">
                    <EditableCell value={data.programs[p.key].targetOffers} onChange={v => updateProgram(p.key, 'targetOffers', v)} highlight />
                  </td>
                ))}
                <td className="text-center px-3 py-2 text-xs text-gray-500">{totals.targetOffers}</td>
              </tr>

              {/* Stage 4 */}
              <tr className="bg-emerald-50">
                <td colSpan={6} className="px-4 py-2 text-xs font-bold text-emerald-700 uppercase tracking-wide">Stage 4: Enrollment</td>
              </tr>
              <tr className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-700 font-medium">Enrollments Completed</td>
                {PROGRAMS.map(p => (
                  <td key={p.key} className="text-center px-3 py-2">
                    <EditableCell value={data.programs[p.key].enrollmentsCompleted} onChange={v => updateProgram(p.key, 'enrollmentsCompleted', v)} />
                  </td>
                ))}
                <td className="text-center px-3 py-2 font-bold text-emerald-700 text-base">{totals.enrollmentsCompleted}</td>
              </tr>
              <tr className="hover:bg-gray-50 bg-emerald-50/50">
                <td className="px-4 py-2 text-gray-500 text-xs">Target Enrollments</td>
                {PROGRAMS.map(p => (
                  <td key={p.key} className="text-center px-3 py-2">
                    <EditableCell value={data.programs[p.key].targetEnrollments} onChange={v => updateProgram(p.key, 'targetEnrollments', v)} highlight />
                  </td>
                ))}
                <td className="text-center px-3 py-2 text-xs text-gray-500">{totals.targetEnrollments}</td>
              </tr>

              {/* Conversion Rates */}
              <tr className="bg-gray-50">
                <td colSpan={6} className="px-4 py-2 text-xs font-bold text-gray-600 uppercase tracking-wide">Overall Lead → Enrollment Rate</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-700 font-medium">Conversion %</td>
                {PROGRAMS.map(p => {
                  const rates = getConversionRates(p.key);
                  return (
                    <td key={p.key} className="text-center px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        rates.overall >= 20 ? 'bg-green-100 text-green-700' :
                        rates.overall >= 10 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-600'
                      }`}>{rates.overall.toFixed(1)}%</span>
                    </td>
                  );
                })}
                <td className="text-center px-3 py-2">
                  {(() => {
                    const t = getTotals();
                    const totalLeads = t.organicLeads + t.paidLeads + t.partnershipLeads;
                    const overall = totalLeads > 0 ? (t.enrollmentsCompleted / totalLeads) * 100 : 0;
                    return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{overall.toFixed(1)}%</span>;
                  })()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FunnelView;
