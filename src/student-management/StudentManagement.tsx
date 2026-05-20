import React, { useState } from 'react';
import { Users, CalendarCheck, MessageSquare, Receipt } from 'lucide-react';
import { StudentProvider } from './context/StudentContext';
import StudentsView from './components/StudentsView';
import AttendanceView from './components/AttendanceView';
import ParentPortalView from './components/ParentPortalView';
import BillingView from './components/BillingView';

type SMTab = 'students' | 'attendance' | 'portal' | 'billing';

const TAB_CONFIG: { key: SMTab; label: string; icon: React.ReactNode }[] = [
  { key: 'students', label: 'Students', icon: <Users size={16} /> },
  { key: 'attendance', label: 'Attendance', icon: <CalendarCheck size={16} /> },
  { key: 'portal', label: 'Parent Portal', icon: <MessageSquare size={16} /> },
  { key: 'billing', label: 'Billing', icon: <Receipt size={16} /> },
];

const StudentManagementInner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SMTab>('students');

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      {/* Sub-tabs */}
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

      {/* Content */}
      <div className="p-5">
        {activeTab === 'students' && <StudentsView />}
        {activeTab === 'attendance' && <AttendanceView />}
        {activeTab === 'portal' && <ParentPortalView />}
        {activeTab === 'billing' && <BillingView />}
      </div>
    </div>
  );
};

const StudentManagement: React.FC = () => (
  <StudentProvider>
    <StudentManagementInner />
  </StudentProvider>
);

export default StudentManagement;
