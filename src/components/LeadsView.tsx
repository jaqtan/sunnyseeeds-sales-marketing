import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, RefreshCw, ExternalLink, AlertCircle, CheckCircle,
  Phone, Mail, Calendar, Tag, Filter, Download,
} from 'lucide-react';

// ---------- Types ----------
interface AirtableLead {
  id: string;
  fields: {
    'Child Name': string;
    'Child DOB'?: string;
    'Parent Name': string;
    'Parent Email': string;
    'Parent Phone'?: string;
    'Program Interest'?: string;
    'How did you hear about us?'?: string;
    'Message'?: string;
    'Status'?: LeadStatus;
    'Created'?: string;
  };
}

type LeadStatus = 'New' | 'Contacted' | 'Tour Scheduled' | 'Enrolled' | 'Declined';

const STATUS_OPTIONS: LeadStatus[] = ['New', 'Contacted', 'Tour Scheduled', 'Enrolled', 'Declined'];

const STATUS_STYLE: Record<LeadStatus, string> = {
  'New': 'bg-blue-100 text-blue-700',
  'Contacted': 'bg-amber-100 text-amber-700',
  'Tour Scheduled': 'bg-purple-100 text-purple-700',
  'Enrolled': 'bg-green-100 text-green-700',
  'Declined': 'bg-gray-100 text-gray-500',
};

// ---------- Config helper ----------
const getConfig = () => ({
  apiKey: process.env.REACT_APP_AIRTABLE_API_KEY || '',
  baseId: process.env.REACT_APP_AIRTABLE_BASE_ID || '',
  tableName: process.env.REACT_APP_AIRTABLE_TABLE_NAME || 'Leads',
  formUrl: process.env.REACT_APP_AIRTABLE_FORM_URL || '',
});

// ---------- Setup instructions shown when not configured ----------
const SetupInstructions: React.FC = () => (
  <div className="max-w-2xl mx-auto space-y-6">
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-3">
      <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
      <div>
        <p className="font-semibold text-amber-800">Airtable not connected yet</p>
        <p className="text-sm text-amber-700 mt-1">Follow the steps below to connect your Airtable base. It takes about 10 minutes.</p>
      </div>
    </div>

    {[
      {
        step: 1,
        title: 'Create your free Airtable account',
        detail: 'Go to airtable.com and sign up for free. No credit card needed.',
      },
      {
        step: 2,
        title: 'Create a new Base called "SunnySeeds Leads"',
        detail: 'Click "+ Add a base" → "Start from scratch". Name it SunnySeeds Leads.',
      },
      {
        step: 3,
        title: 'Set up your Leads table with these fields',
        detail: 'Rename the default table to "Leads". Add these fields:\n• Child Name — Single line text\n• Child DOB — Date\n• Parent Name — Single line text\n• Parent Email — Email\n• Parent Phone — Phone\n• Program Interest — Single select (Preschool 1, Preschool 2, StorySparks, Weekend Playschool, Primary Daycare, Fitness Program)\n• How did you hear about us? — Single select (Google Search, Social Media, Friend/Family Referral, School Event, Walk-in, Other)\n• Message — Long text\n• Status — Single select (New, Contacted, Tour Scheduled, Enrolled, Declined)\n• Created — Created time (auto)',
      },
      {
        step: 4,
        title: 'Create your Enquiry Form',
        detail: 'Click "+ Add a view" → "Form". Airtable creates a shareable form link. Click "Share form" to copy the link — this is what you give to parents.',
      },
      {
        step: 5,
        title: 'Get your API credentials',
        detail: 'Go to airtable.com/create/tokens → "Create token" → give it "data.records:read" and "data.records:write" scopes for your base. Copy the token.\n\nYour Base ID is in the URL when viewing your base: airtable.com/appXXXXXXXX — the part starting with "app" is your Base ID.',
      },
      {
        step: 6,
        title: 'Add your credentials to the app',
        detail: 'Create a file called .env in your project folder and add:\n\nREACT_APP_AIRTABLE_API_KEY=your_token_here\nREACT_APP_AIRTABLE_BASE_ID=appXXXXXXXX\nREACT_APP_AIRTABLE_FORM_URL=your_form_link_here\n\nThen restart the app with: npm start',
      },
    ].map(s => (
      <div key={s.step} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex gap-4">
        <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
          {s.step}
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-1">{s.title}</p>
          <p className="text-sm text-gray-500 whitespace-pre-line">{s.detail}</p>
        </div>
      </div>
    ))}
  </div>
);

// ---------- Main Component ----------
const LeadsView: React.FC = () => {
  const config = getConfig();
  const isConfigured = Boolean(config.apiKey && config.baseId);

  const [leads, setLeads] = useState<AirtableLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<LeadStatus | 'All'>('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    if (!isConfigured) return;
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}?sort[0][field]=Created&sort[0][direction]=desc`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${config.apiKey}` },
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error((msg as any)?.error?.message || `API error ${res.status}`);
      }
      const data = await res.json();
      setLeads(data.records || []);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [isConfigured, config.apiKey, config.baseId, config.tableName]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateStatus = async (id: string, status: LeadStatus) => {
    setUpdatingId(id);
    try {
      await fetch(`https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields: { Status: status } }),
      });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, fields: { ...l.fields, Status: status } } : l));
    } catch {
      setError('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const exportCSV = () => {
    const rows = [
      ['Child Name', 'Child DOB', 'Parent Name', 'Email', 'Phone', 'Program', 'Source', 'Status', 'Date'],
      ...filtered.map(l => [
        l.fields['Child Name'] || '',
        l.fields['Child DOB'] || '',
        l.fields['Parent Name'] || '',
        l.fields['Parent Email'] || '',
        l.fields['Parent Phone'] || '',
        l.fields['Program Interest'] || '',
        l.fields['How did you hear about us?'] || '',
        l.fields['Status'] || 'New',
        l.fields['Created'] ? new Date(l.fields['Created']).toLocaleDateString() : '',
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `sunnyseeeds-leads-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  if (!isConfigured) return <SetupInstructions />;

  const filtered = filter === 'All' ? leads : leads.filter(l => (l.fields['Status'] || 'New') === filter);

  const counts: Record<string, number> = { All: leads.length };
  STATUS_OPTIONS.forEach(s => { counts[s] = leads.filter(l => (l.fields['Status'] || 'New') === s).length; });

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Enquiry Leads</h2>
          <p className="text-sm text-gray-400">Live from Airtable — {leads.length} total enquiries</p>
        </div>
        <div className="flex items-center gap-2">
          {config.formUrl && (
            <a
              href={config.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors"
            >
              <ExternalLink size={14} />
              Share Form Link
            </a>
          )}
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Download size={14} />
            Export CSV
          </button>
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total', count: counts['All'], color: 'text-gray-800' },
          { label: 'New', count: counts['New'] || 0, color: 'text-blue-600' },
          { label: 'Contacted', count: counts['Contacted'] || 0, color: 'text-amber-600' },
          { label: 'Tour Scheduled', count: counts['Tour Scheduled'] || 0, color: 'text-purple-600' },
          { label: 'Enrolled', count: counts['Enrolled'] || 0, color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-2 text-sm text-red-700">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {(['All', ...STATUS_OPTIONS] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === s ? 'bg-amber-500 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {s} {counts[s] !== undefined ? `(${counts[s]})` : ''}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading && leads.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
            <RefreshCw size={18} className="animate-spin" />
            Loading leads from Airtable…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
            <Users size={32} className="opacity-30" />
            <p className="text-sm">No leads yet{filter !== 'All' ? ` with status "${filter}"` : ''}.</p>
            {config.formUrl && (
              <a href={config.formUrl} target="_blank" rel="noopener noreferrer" className="text-amber-500 text-sm hover:underline flex items-center gap-1">
                <ExternalLink size={12} /> Share your enquiry form to start collecting leads
              </a>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Child</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Parent</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Contact</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Program</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Source</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Date</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => {
                  const f = lead.fields;
                  const status: LeadStatus = (f['Status'] as LeadStatus) || 'New';
                  return (
                    <tr key={lead.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{f['Child Name']}</div>
                        {f['Child DOB'] && (
                          <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Calendar size={10} />
                            {new Date(f['Child DOB']).toLocaleDateString('en-AU')}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{f['Parent Name']}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-gray-600 text-xs">
                          <Mail size={11} />
                          <a href={`mailto:${f['Parent Email']}`} className="hover:text-amber-600">{f['Parent Email']}</a>
                        </div>
                        {f['Parent Phone'] && (
                          <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                            <Phone size={11} />
                            {f['Parent Phone']}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {f['Program Interest'] && (
                          <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                            <Tag size={10} />
                            {f['Program Interest']}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{f['How did you hear about us?'] || '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {f['Created'] ? new Date(f['Created']).toLocaleDateString('en-AU') : '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <select
                          value={status}
                          disabled={updatingId === lead.id}
                          onChange={e => updateStatus(lead.id, e.target.value as LeadStatus)}
                          className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer transition-opacity ${STATUS_STYLE[status]} ${updatingId === lead.id ? 'opacity-50' : ''}`}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsView;
