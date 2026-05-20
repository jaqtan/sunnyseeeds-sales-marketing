import React, { useState } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { PROGRAMS } from './data/initialData';
import KPICard from './components/KPICard';
import FunnelView from './components/FunnelView';
import AnalyticsView from './components/AnalyticsView';
import MonthlyView from './components/MonthlyView';
import ForecastView from './components/ForecastView';
import WorkflowView from './components/WorkflowView';
import StudentManagement from './student-management/StudentManagement';
import { Users, BarChart2, Calendar, TrendingUp, CheckSquare, Sun, GraduationCap } from 'lucide-react';

type Tab = 'funnel' | 'analytics' | 'monthly' | 'forecast' | 'workflow';
type Section = 'sales' | 'students';

const TAB_CONFIG: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'funnel', label: 'Sales Funnel', icon: <Users size={16} /> },
  { key: 'analytics', label: 'Analytics', icon: <BarChart2 size={16} /> },
  { key: 'monthly', label: 'Monthly Tracking', icon: <Calendar size={16} /> },
  { key: 'forecast', label: '6-Month Forecast', icon: <TrendingUp size={16} /> },
  { key: 'workflow', label: 'Workflow', icon: <CheckSquare size={16} /> },
];

const HEALTH_COLORS = {
  excellent: { bg: 'bg-green-100', text: 'text-green-700', label: 'Excellent' },
  good: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Good' },
  warning: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Needs Attention' },
  critical: { bg: 'bg-red-100', text: 'text-red-600', label: 'Critical' },
};

const DashboardApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('funnel');
  const { data, getTotals, getFunnelHealth } = useDashboard();
  const totals = getTotals();
  const health = getFunnelHealth();
  const hc = HEALTH_COLORS[health.status];
  const totalLeads = totals.organicLeads + totals.paidLeads + totals.partnershipLeads;

  return (
    <div className="space-y-6">
      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Leads" value={totalLeads} target={totals.targetLeads} color="#f59e0b" icon={<Users size={18} />} />
        <KPICard title="Tours Completed" value={totals.toursCompleted} target={totals.targetTours} color="#6366f1" icon={<Calendar size={18} />} />
        <KPICard title="Offers Sent" value={totals.offersSent} target={totals.targetOffers} color="#ec4899" icon={<TrendingUp size={18} />} />
        <KPICard title="Enrollments" value={totals.enrollmentsCompleted} target={totals.targetEnrollments} color="#10b981" icon={<CheckSquare size={18} />} />
      </div>

      {/* Per-Program strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PROGRAMS.map(p => {
          const d = data.programs[p.key];
          const leads = d.organicLeads + d.paidLeads + d.partnershipLeads;
          return (
            <div key={p.key} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-xs font-semibold text-gray-600">{p.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs text-gray-400">Leads</div>
                  <div className="text-lg font-bold" style={{ color: p.color }}>{leads}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Enrolled</div>
                  <div className="text-lg font-bold text-gray-700">{d.enrollmentsCompleted}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Funnel health badge */}
      <div className="flex justify-end">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${hc.bg} ${hc.text}`}>
          Funnel Health: {hc.label}
        </span>
      </div>

      {/* Tab panel */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex gap-1 p-1.5 border-b border-gray-100 overflow-x-auto">
          {TAB_CONFIG.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === t.key
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
        <div className="p-5">
          {activeTab === 'funnel' && <FunnelView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'monthly' && <MonthlyView />}
          {activeTab === 'forecast' && <ForecastView />}
          {activeTab === 'workflow' && <WorkflowView />}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [section, setSection] = useState<Section>('sales');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center shadow-sm">
              <Sun size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">SunnySeeds Academy</h1>
              <p className="text-xs text-gray-400">
                {section === 'sales' ? 'Sales & Marketing Dashboard' : 'Student Management'}
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-400 hidden md:inline">
            {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        {/* Section toggle */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setSection('sales')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                section === 'sales'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <BarChart2 size={16} />
              Sales &amp; Marketing
            </button>
            <button
              onClick={() => setSection('students')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                section === 'students'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <GraduationCap size={16} />
              Student Management
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {section === 'sales' && (
          <DashboardProvider>
            <DashboardApp />
          </DashboardProvider>
        )}
        {section === 'students' && <StudentManagement />}
      </div>
    </div>
  );
};

export default App;
