import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, Calendar, MinusCircle } from 'lucide-react';
import { useStudents } from '../context/StudentContext';
import { AttendanceStatus, AttendanceRecord, PROGRAM_COLORS } from '../data/studentData';

// ── helpers ──────────────────────────────────────────────────────────────────

function toYMD(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function formatDate(ymd: string): string {
  return new Date(ymd + 'T00:00:00').toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
}

function getWeekDates(anchor: Date): string[] {
  const dow = anchor.getDay(); // 0=Sun
  const monday = addDays(anchor, -(dow === 0 ? 6 : dow - 1));
  return Array.from({ length: 7 }, (_, i) => toYMD(addDays(monday, i)));
}

// ── Status config ─────────────────────────────────────────────────────────────

interface StatusCfg {
  label: string;
  bg: string;
  text: string;
  dot: string;
  icon: React.ReactNode;
}

const STATUS_CFG: Record<AttendanceStatus, StatusCfg> = {
  present: { label: 'Present', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', icon: <CheckCircle size={13} /> },
  absent: { label: 'Absent', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', icon: <XCircle size={13} /> },
  late: { label: 'Late', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', icon: <Clock size={13} /> },
  excused: { label: 'Excused', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', icon: <Calendar size={13} /> },
  holiday: { label: 'Holiday', bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-400', icon: <MinusCircle size={13} /> },
};

const ALL_STATUSES: AttendanceStatus[] = ['present', 'absent', 'late', 'excused', 'holiday'];

function initials(first: string, last: string): string {
  return `${first[0]}${last[0]}`.toUpperCase();
}

// ── Attendance row ────────────────────────────────────────────────────────────

const AttendanceRow: React.FC<{
  studentId: string;
  firstName: string;
  lastName: string;
  program: string;
  record: AttendanceRecord | undefined;
  date: string;
  onUpdate: (r: AttendanceRecord) => void;
}> = ({ studentId, firstName, lastName, program, record, date, onUpdate }) => {
  const color = PROGRAM_COLORS[program as keyof typeof PROGRAM_COLORS] ?? '#f59e0b';

  const currentStatus: AttendanceStatus = record?.status ?? 'absent';

  const setStatus = (status: AttendanceStatus) => {
    onUpdate({
      id: record?.id ?? `att-${studentId}-${date}`,
      studentId,
      date,
      status,
      checkIn: record?.checkIn,
      checkOut: record?.checkOut,
      note: record?.note,
    });
  };

  const setField = (field: 'checkIn' | 'checkOut' | 'note', value: string) => {
    onUpdate({
      id: record?.id ?? `att-${studentId}-${date}`,
      studentId,
      date,
      status: currentStatus,
      checkIn: record?.checkIn,
      checkOut: record?.checkOut,
      note: record?.note,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ backgroundColor: color }}
        >
          {initials(firstName, lastName)}
        </div>
        {/* Name */}
        <div className="min-w-[120px]">
          <div className="text-sm font-semibold text-gray-900">{firstName} {lastName}</div>
          <div className="text-xs text-gray-400">{program}</div>
        </div>

        {/* Status buttons */}
        <div className="flex flex-wrap gap-1 flex-1">
          {ALL_STATUSES.map(s => {
            const cfg = STATUS_CFG[s];
            const active = currentStatus === s;
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  active ? `${cfg.bg} ${cfg.text}` : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                {cfg.icon} {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Times */}
        {(currentStatus === 'present' || currentStatus === 'late') && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400">In</span>
              <input
                type="time"
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-300"
                value={record?.checkIn ?? ''}
                onChange={e => setField('checkIn', e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400">Out</span>
              <input
                type="time"
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-300"
                value={record?.checkOut ?? ''}
                onChange={e => setField('checkOut', e.target.value)}
              />
            </div>
          </>
        )}

        {/* Note */}
        <input
          className="flex-1 min-w-[120px] text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder:text-gray-300"
          placeholder="Note..."
          value={record?.note ?? ''}
          onChange={e => setField('note', e.target.value)}
        />
      </div>
    </div>
  );
};

// ── Weekly dot ────────────────────────────────────────────────────────────────

const WeekDot: React.FC<{ status?: AttendanceStatus }> = ({ status }) => {
  if (!status) return <div className="w-4 h-4 rounded-full bg-gray-100 mx-auto" />;
  const cfg = STATUS_CFG[status];
  return (
    <div className={`w-4 h-4 rounded-full mx-auto ${cfg.dot}`} title={cfg.label} />
  );
};

// ── Main View ─────────────────────────────────────────────────────────────────

const AttendanceView: React.FC = () => {
  const { students, attendance, markAttendance } = useStudents();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const dateStr = toYMD(selectedDate);
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  const todayRecords = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    attendance.filter(a => a.date === dateStr).forEach(a => map.set(a.studentId, a));
    return map;
  }, [attendance, dateStr]);

  const weekRecords = useMemo(() => {
    const map = new Map<string, Map<string, AttendanceRecord>>();
    attendance
      .filter(a => weekDates.includes(a.date))
      .forEach(a => {
        if (!map.has(a.studentId)) map.set(a.studentId, new Map());
        map.get(a.studentId)!.set(a.date, a);
      });
    return map;
  }, [attendance, weekDates]);

  const summary = useMemo(() => {
    const vals = Array.from(todayRecords.values());
    const present = vals.filter(r => r.status === 'present').length;
    const late = vals.filter(r => r.status === 'late').length;
    const absent = vals.filter(r => r.status === 'absent').length;
    const excused = vals.filter(r => r.status === 'excused').length;
    return { present, late, absent, excused };
  }, [todayRecords]);

  // Monthly attendance % per student
  const monthStr = dateStr.slice(0, 7);
  const monthRecords = useMemo(() => {
    return attendance.filter(a => a.date.startsWith(monthStr));
  }, [attendance, monthStr]);

  const monthDays = useMemo(() => {
    const days = new Set<string>();
    monthRecords.forEach(r => days.add(r.date));
    return days.size;
  }, [monthRecords]);

  const handleUpdate = (record: AttendanceRecord) => {
    markAttendance(record);
  };

  return (
    <div className="space-y-6">
      {/* Date picker */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelectedDate(d => addDays(d, -1))}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1 text-center">
          <h2 className="text-base font-bold text-gray-900">{formatDate(dateStr)}</h2>
        </div>
        <button
          onClick={() => setSelectedDate(d => addDays(d, 1))}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
        <input
          type="date"
          value={dateStr}
          onChange={e => setSelectedDate(new Date(e.target.value + 'T00:00:00'))}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        <button
          onClick={() => setSelectedDate(new Date())}
          className="px-3 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors"
        >
          Today
        </button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Present', count: summary.present, cls: 'bg-green-50 text-green-700 border-green-100' },
          { label: 'Late', count: summary.late, cls: 'bg-amber-50 text-amber-700 border-amber-100' },
          { label: 'Absent', count: summary.absent, cls: 'bg-red-50 text-red-700 border-red-100' },
          { label: 'Excused', count: summary.excused, cls: 'bg-blue-50 text-blue-700 border-blue-100' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 text-center ${s.cls}`}>
            <div className="text-2xl font-bold">{s.count}</div>
            <div className="text-xs font-semibold mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Attendance grid */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3">Daily Attendance — {formatDate(dateStr)}</h3>
        <div className="space-y-2">
          {students.map(student => (
            <AttendanceRow
              key={student.id}
              studentId={student.id}
              firstName={student.firstName}
              lastName={student.lastName}
              program={student.program}
              record={todayRecords.get(student.id)}
              date={dateStr}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      </div>

      {/* Weekly summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">Weekly Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 w-40">Student</th>
                {weekDates.map(d => (
                  <th key={d} className={`px-2 py-3 text-xs font-semibold text-center ${d === dateStr ? 'text-amber-600' : 'text-gray-500'}`}>
                    {new Date(d + 'T00:00:00').toLocaleDateString('en-AU', { weekday: 'short' })}
                    <br />
                    <span className="font-normal text-gray-400">
                      {new Date(d + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => {
                const sMap = weekRecords.get(student.id);
                return (
                  <tr key={student.id} className={i % 2 === 0 ? 'bg-gray-50/50' : ''}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: PROGRAM_COLORS[student.program] }}
                        >
                          {initials(student.firstName, student.lastName)}
                        </div>
                        <span className="text-xs font-medium text-gray-700 truncate">
                          {student.firstName} {student.lastName}
                        </span>
                      </div>
                    </td>
                    {weekDates.map(d => (
                      <td key={d} className={`px-2 py-3 text-center ${d === dateStr ? 'bg-amber-50/40' : ''}`}>
                        <WeekDot status={sMap?.get(d)?.status} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Legend */}
        <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap gap-3">
          {ALL_STATUSES.map(s => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${STATUS_CFG[s].dot}`} />
              <span className="text-xs text-gray-500">{STATUS_CFG[s].label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-100" />
            <span className="text-xs text-gray-500">No record</span>
          </div>
        </div>
      </div>

      {/* Monthly summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">
            Monthly Attendance — {new Date(dateStr + 'T00:00:00').toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Student</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">Present</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">Absent</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">Late</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => {
                const recs = monthRecords.filter(r => r.studentId === student.id);
                const present = recs.filter(r => r.status === 'present' || r.status === 'late').length;
                const absent = recs.filter(r => r.status === 'absent').length;
                const late = recs.filter(r => r.status === 'late').length;
                const pct = monthDays > 0 ? Math.round((present / monthDays) * 100) : 0;
                return (
                  <tr key={student.id} className={i % 2 === 0 ? 'bg-gray-50/50' : ''}>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-gray-700">{student.firstName} {student.lastName}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-semibold text-green-700">{present}</td>
                    <td className="px-4 py-3 text-center text-xs font-semibold text-red-600">{absent}</td>
                    <td className="px-4 py-3 text-center text-xs font-semibold text-amber-700">{late}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-2 rounded-full"
                            style={{ width: `${pct}%`, backgroundColor: pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444' }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-700 w-8 text-right">{pct}%</span>
                      </div>
                    </td>
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

export default AttendanceView;
