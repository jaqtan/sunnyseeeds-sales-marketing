import React, { useState, useMemo } from 'react';
import { DollarSign, AlertCircle, CheckCircle, Clock, FileText, X } from 'lucide-react';
import { useStudents } from '../context/StudentContext';
import {
  Invoice,
  InvoiceStatus,
  InvoiceItem,
  Program,
  PROGRAM_LABELS,
  PROGRAM_COLORS,
} from '../data/studentData';

// ── helpers ──────────────────────────────────────────────────────────────────

function fmt(amount: number): string {
  return `$${amount.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ── Status config ─────────────────────────────────────────────────────────────

interface StatusCfg {
  label: string;
  bg: string;
  text: string;
  icon: React.ReactNode;
}

const STATUS_CFG: Record<InvoiceStatus, StatusCfg> = {
  draft: { label: 'Draft', bg: 'bg-gray-100', text: 'text-gray-600', icon: <FileText size={12} /> },
  sent: { label: 'Sent', bg: 'bg-blue-100', text: 'text-blue-700', icon: <Clock size={12} /> },
  paid: { label: 'Paid', bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={12} /> },
  overdue: { label: 'Overdue', bg: 'bg-red-100', text: 'text-red-700', icon: <AlertCircle size={12} /> },
};

const StatusBadge: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
  const cfg = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

// ── Program fee schedule ──────────────────────────────────────────────────────

const DEFAULT_FEES: Record<Program, number> = {
  preschool: 1200,
  storysparks: 950,
  weekendPlayschool: 480,
  primaryDaycare: 1450,
};

// ── Invoice Detail Modal ──────────────────────────────────────────────────────

const InvoiceModal: React.FC<{
  invoice: Invoice;
  studentName: string;
  program: Program;
  onClose: () => void;
  onMarkSent: () => void;
  onRecordPayment: (date: string) => void;
}> = ({ invoice, studentName, program, onClose, onMarkSent, onRecordPayment }) => {
  const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-bold text-gray-900">{invoice.invoiceNumber}</h2>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="text-sm text-gray-500">{studentName} · {PROGRAM_LABELS[program]}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <InfoPair label="Month" value={invoice.month} />
            <InfoPair label="Due Date" value={invoice.dueDate} />
            {invoice.paidDate && <InfoPair label="Paid Date" value={invoice.paidDate} />}
          </div>

          {/* Line items */}
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Items</div>
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              {invoice.items.map((item: InvoiceItem) => (
                <div key={item.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm text-gray-700">{item.description}</span>
                  <span className="text-sm font-semibold text-gray-900">{fmt(item.amount)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-100">
                <span className="text-sm font-bold text-gray-900">Total</span>
                <span className="text-base font-bold text-gray-900">{fmt(invoice.total)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="bg-amber-50 rounded-xl px-4 py-3 text-sm text-amber-800">
              {invoice.notes}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 px-6 pb-6">
          {invoice.status === 'draft' && (
            <button
              onClick={onMarkSent}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors"
            >
              Mark as Sent
            </button>
          )}
          {(invoice.status === 'sent' || invoice.status === 'overdue') && (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="date"
                value={payDate}
                onChange={e => setPayDate(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <button
                onClick={() => onRecordPayment(payDate)}
                className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
              >
                Record Payment
              </button>
            </div>
          )}
          <button
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            Download PDF
          </button>
          <button onClick={onClose} className="ml-auto px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoPair: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-xs text-gray-400 font-medium">{label}</div>
    <div className="text-sm text-gray-800 font-semibold mt-0.5">{value}</div>
  </div>
);

// ── Main View ─────────────────────────────────────────────────────────────────

const MONTHS = [
  'January 2026', 'February 2026', 'March 2026', 'April 2026',
  'May 2026', 'June 2026', 'July 2026', 'August 2026',
];

const BillingView: React.FC = () => {
  const { students, invoices, addInvoice, updateInvoiceStatus, recordPayment } = useStudents();
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [selectedMonth, setSelectedMonth] = useState('May 2026');
  const [fees, setFees] = useState<Record<Program, number>>(DEFAULT_FEES);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  const programs: Program[] = ['preschool', 'storysparks', 'weekendPlayschool', 'primaryDaycare'];

  const filtered = useMemo(() => {
    return invoices.filter(inv => statusFilter === 'all' || inv.status === statusFilter);
  }, [invoices, statusFilter]);

  const stats = useMemo(() => {
    const monthInvs = invoices.filter(inv => inv.month === selectedMonth);
    const totalBilled = monthInvs.reduce((s, i) => s + i.total, 0);
    const totalCollected = monthInvs.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
    const outstanding = totalBilled - totalCollected;
    const overdueCount = monthInvs.filter(i => i.status === 'overdue').length;
    return { totalBilled, totalCollected, outstanding, overdueCount };
  }, [invoices, selectedMonth]);

  const handleGenerateInvoices = () => {
    const existing = new Set(invoices.filter(i => i.month === selectedMonth).map(i => i.studentId));
    const activeStudents = students.filter(s => s.status === 'active' && !existing.has(s.id));
    const today = new Date().toISOString().slice(0, 10);
    // Due date: 7th of the invoice month
    const [monthName, year] = selectedMonth.split(' ');
    const monthIdx = new Date(`${monthName} 1, ${year}`).getMonth() + 1;
    const dueDate = `${year}-${String(monthIdx).padStart(2, '0')}-07`;

    activeStudents.forEach((student, i) => {
      const fee = fees[student.program];
      const count = invoices.filter(inv => inv.invoiceNumber.startsWith('SS-')).length + i + 1;
      addInvoice({
        id: `inv-gen-${Date.now()}-${i}`,
        studentId: student.id,
        invoiceNumber: `SS-${today.slice(0, 7).replace('-', '')}-${String(count).padStart(3, '0')}`,
        month: selectedMonth,
        items: [
          { id: `it-${Date.now()}-${i}-1`, description: `${PROGRAM_LABELS[student.program]} – Monthly Tuition`, amount: fee },
          { id: `it-${Date.now()}-${i}-2`, description: 'Materials & Resources Fee', amount: 45 },
        ],
        total: fee + 45,
        status: 'draft',
        dueDate,
      });
    });
  };

  const student = (id: string) => students.find(s => s.id === id);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Billed" value={fmt(stats.totalBilled)} color="#6366f1" />
        <StatCard label="Collected" value={fmt(stats.totalCollected)} color="#10b981" />
        <StatCard label="Outstanding" value={fmt(stats.outstanding)} color="#f59e0b" />
        <StatCard label="Overdue" value={String(stats.overdueCount)} color="#ef4444" />
      </div>

      {/* Fee schedule */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Fee Schedule</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {programs.map(p => (
            <div key={p} className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PROGRAM_COLORS[p] }} />
                <span className="text-xs font-semibold text-gray-600">{PROGRAM_LABELS[p]}</span>
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1.5 bg-gray-50 text-gray-500 text-sm rounded-l-lg border border-gray-200">$</span>
                <input
                  type="number"
                  value={fees[p]}
                  onChange={e => setFees(f => ({ ...f, [p]: Number(e.target.value) }))}
                  className="flex-1 border border-l-0 border-gray-200 rounded-r-lg px-2 py-1.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-300 w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate invoices */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
        >
          {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <button
          onClick={handleGenerateInvoices}
          className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors"
        >
          Generate Invoices for Active Students
        </button>
        <span className="text-xs text-gray-400">
          {invoices.filter(i => i.month === selectedMonth).length} invoice(s) exist for {selectedMonth}
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
              statusFilter === s ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {s === 'all' ? `All (${invoices.length})` : `${STATUS_CFG[s].label} (${invoices.filter(i => i.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Invoice table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Invoice #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Student</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Program</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Month</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Amount</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Due Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400 text-sm">No invoices found.</td>
                </tr>
              )}
              {filtered.map((inv, i) => {
                const stu = student(inv.studentId);
                if (!stu) return null;
                return (
                  <tr key={inv.id} className={`border-b border-gray-50 hover:bg-gray-50/60 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                    <td className="px-4 py-3 text-xs font-mono text-gray-700">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: PROGRAM_COLORS[stu.program] }}
                        >
                          {stu.firstName[0]}{stu.lastName[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{stu.firstName} {stu.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: PROGRAM_COLORS[stu.program] }}>
                        {PROGRAM_LABELS[stu.program]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{inv.month}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">{fmt(inv.total)}</td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{inv.dueDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 justify-center">
                        <button
                          onClick={() => setViewInvoice(inv)}
                          className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-medium transition-colors"
                        >
                          View
                        </button>
                        {inv.status === 'draft' && (
                          <button
                            onClick={() => updateInvoiceStatus(inv.id, 'sent')}
                            className="px-2.5 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors"
                          >
                            Send
                          </button>
                        )}
                        {(inv.status === 'sent' || inv.status === 'overdue') && (
                          <button
                            onClick={() => recordPayment(inv.id, new Date().toISOString().slice(0, 10))}
                            className="px-2.5 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-medium transition-colors"
                          >
                            Pay
                          </button>
                        )}
                        <button className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-medium transition-colors">
                          <DollarSign size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {viewInvoice && (() => {
        const stu = student(viewInvoice.studentId);
        if (!stu) return null;
        return (
          <InvoiceModal
            invoice={viewInvoice}
            studentName={`${stu.firstName} ${stu.lastName}`}
            program={stu.program}
            onClose={() => setViewInvoice(null)}
            onMarkSent={() => { updateInvoiceStatus(viewInvoice.id, 'sent'); setViewInvoice(null); }}
            onRecordPayment={date => { recordPayment(viewInvoice.id, date); setViewInvoice(null); }}
          />
        );
      })()}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
    <div className="text-xs text-gray-500 font-medium">{label}</div>
    <div className="text-xl font-bold mt-1" style={{ color }}>{value}</div>
  </div>
);

export default BillingView;
