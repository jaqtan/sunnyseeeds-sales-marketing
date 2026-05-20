import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Send, MessageSquare } from 'lucide-react';
import { useStudents } from '../context/StudentContext';
import {
  Student,
  DailyReport,
  Message,
  PROGRAM_COLORS,
} from '../data/studentData';

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
  return new Date(ymd + 'T00:00:00').toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
function initials(s: Student): string {
  return `${s.firstName[0]}${s.lastName[0]}`.toUpperCase();
}

const ACTIVITY_OPTIONS = [
  'Story Time',
  'Art',
  'Outdoor Play',
  'Music',
  'Math Games',
  'Science',
  'Free Play',
  'Drama',
  'Dancing',
  'Sensory Play',
];

const MOOD_OPTIONS: { value: DailyReport['mood']; emoji: string; label: string }[] = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'sad', emoji: '😢', label: 'Sad' },
];

const MEAL_OPTIONS: Array<'all' | 'some' | 'none'> = ['all', 'some', 'none'];

// ── Report Form Modal ─────────────────────────────────────────────────────────

const ReportModal: React.FC<{
  student: Student;
  date: string;
  existing?: DailyReport;
  onSave: (r: DailyReport) => void;
  onClose: () => void;
}> = ({ student, date, existing, onSave, onClose }) => {
  const [mood, setMood] = useState<DailyReport['mood']>(existing?.mood ?? 'happy');
  const [meals, setMeals] = useState<DailyReport['meals']>(
    existing?.meals ?? { breakfast: 'all', lunch: 'all', snack: 'some' }
  );
  const [napMinutes, setNapMinutes] = useState(existing?.napMinutes ?? 30);
  const [activities, setActivities] = useState<string[]>(existing?.activities ?? []);
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [staffName, setStaffName] = useState(existing?.staffName ?? '');

  const toggleActivity = (a: string) =>
    setActivities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const handleSave = () => {
    onSave({
      id: existing?.id ?? `rpt-${Date.now()}`,
      studentId: student.id,
      date,
      mood,
      meals,
      napMinutes,
      activities,
      notes,
      staffName,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Daily Report</h2>
            <p className="text-xs text-gray-500">{student.firstName} {student.lastName} — {formatDate(date)}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Mood */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Today's Mood</label>
            <div className="flex gap-3">
              {MOOD_OPTIONS.map(m => (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-colors ${
                    mood === m.value ? 'border-amber-400 bg-amber-50' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-xs font-semibold text-gray-600">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Meals */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meals</label>
            <div className="grid grid-cols-3 gap-3">
              {(['breakfast', 'lunch', 'snack'] as const).map(meal => (
                <div key={meal}>
                  <div className="text-xs font-medium text-gray-600 capitalize mb-1">{meal}</div>
                  <div className="flex">
                    {MEAL_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setMeals(m => ({ ...m, [meal]: opt }))}
                        className={`flex-1 py-1.5 text-xs font-semibold capitalize transition-colors first:rounded-l-lg last:rounded-r-lg border ${
                          meals[meal] === opt
                            ? 'bg-amber-500 text-white border-amber-500 z-10'
                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nap */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Nap Duration — {napMinutes} min
            </label>
            <input
              type="range"
              min={0}
              max={120}
              step={5}
              value={napMinutes}
              onChange={e => setNapMinutes(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0 min</span><span>60 min</span><span>120 min</span>
            </div>
          </div>

          {/* Activities */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Activities</label>
            <div className="flex flex-wrap gap-2">
              {ACTIVITY_OPTIONS.map(a => (
                <button
                  key={a}
                  onClick={() => toggleActivity(a)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activities.includes(a)
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Notes</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none h-20"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any additional observations..."
            />
          </div>

          {/* Staff */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Staff Name</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={staffName}
              onChange={e => setStaffName(e.target.value)}
              placeholder="Your name"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 font-medium">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!staffName.trim()}
            className="px-5 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 disabled:opacity-50 transition-colors"
          >
            Save Report
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Report Card ───────────────────────────────────────────────────────────────

const ReportCard: React.FC<{ report: DailyReport; student: Student }> = ({ report, student }) => {
  const moodCfg = MOOD_OPTIONS.find(m => m.value === report.mood) ?? MOOD_OPTIONS[0];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: PROGRAM_COLORS[student.program] }}
        >
          {initials(student)}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-900">{student.firstName} {student.lastName}</div>
          <div className="text-xs text-gray-400">By {report.staffName}</div>
        </div>
        <span className="text-2xl">{moodCfg.emoji}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {(['breakfast', 'lunch', 'snack'] as const).map(meal => (
          <div key={meal} className="text-center bg-gray-50 rounded-lg p-2">
            <div className="text-xs text-gray-400 capitalize">{meal}</div>
            <div className="text-xs font-semibold text-gray-700 capitalize">{report.meals[meal]}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {report.activities.map(a => (
          <span key={a} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium">{a}</span>
        ))}
      </div>
      {report.napMinutes > 0 && (
        <div className="text-xs text-gray-500 mb-1">Nap: {report.napMinutes} min</div>
      )}
      {report.notes && (
        <p className="text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-2 mt-2">{report.notes}</p>
      )}
    </div>
  );
};

// ── Messages Panel ────────────────────────────────────────────────────────────

const MessagesPanel: React.FC = () => {
  const { students, messages, sendMessage, markMessageRead, getStudentMessages } = useStudents();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id ?? '');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const threadRef = useRef<HTMLDivElement>(null);

  const thread = useMemo(
    () => getStudentMessages(selectedStudentId).sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
    [getStudentMessages, selectedStudentId]
  );

  const unreadCounts = useMemo(() => {
    const map = new Map<string, number>();
    messages.filter(m => !m.read).forEach(m => {
      map.set(m.studentId, (map.get(m.studentId) ?? 0) + 1);
    });
    return map;
  }, [messages]);

  // Mark messages as read when viewing
  useEffect(() => {
    thread.filter(m => !m.read).forEach(m => markMessageRead(m.id));
  }, [selectedStudentId, thread, markMessageRead]);

  // Scroll to bottom
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [thread]);

  const handleSend = () => {
    if (!body.trim() || !subject.trim()) return;
    sendMessage({
      id: `msg-${Date.now()}`,
      studentId: selectedStudentId,
      from: 'staff',
      senderName: 'Staff',
      subject: subject.trim(),
      body: body.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    });
    setSubject('');
    setBody('');
  };

  return (
    <div className="flex gap-4 h-[600px]">
      {/* Student list */}
      <div className="w-56 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
          Students
        </div>
        <div className="flex-1 overflow-y-auto">
          {students.map(student => {
            const unread = unreadCounts.get(student.id) ?? 0;
            const selected = student.id === selectedStudentId;
            return (
              <button
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-3 border-b border-gray-50 transition-colors text-left ${
                  selected ? 'bg-amber-50' : 'hover:bg-gray-50'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: PROGRAM_COLORS[student.program] }}
                >
                  {initials(student)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900 truncate">{student.firstName} {student.lastName}</div>
                </div>
                {unread > 0 && (
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        {selectedStudentId ? (
          <>
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
              <MessageSquare size={16} className="text-amber-500" />
              <span className="text-sm font-bold text-gray-700">
                {students.find(s => s.id === selectedStudentId)?.firstName}{' '}
                {students.find(s => s.id === selectedStudentId)?.lastName}
              </span>
            </div>

            <div ref={threadRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {thread.length === 0 && (
                <div className="text-center text-gray-400 text-sm py-8">No messages yet.</div>
              )}
              {thread.map((msg: Message) => {
                const isStaff = msg.from === 'staff';
                return (
                  <div key={msg.id} className={`flex ${isStaff ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${isStaff ? 'bg-amber-100' : 'bg-gray-100'}`}>
                      <div className={`text-xs font-semibold mb-1 ${isStaff ? 'text-amber-800' : 'text-gray-600'}`}>
                        {msg.senderName} · {msg.subject}
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">{msg.body}</p>
                      <div className="text-xs text-gray-400 mt-1.5">
                        {new Date(msg.timestamp).toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Compose */}
            <div className="border-t border-gray-100 p-4 space-y-2">
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder:text-gray-300"
                placeholder="Subject..."
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
              <div className="flex gap-2">
                <textarea
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none h-16 placeholder:text-gray-300"
                  placeholder="Write a message..."
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSend(); }}
                />
                <button
                  onClick={handleSend}
                  disabled={!body.trim() || !subject.trim()}
                  className="px-4 py-2 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 disabled:opacity-40 transition-colors flex items-center gap-1.5 text-sm self-end"
                >
                  <Send size={14} /> Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select a student to view messages.
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main View ─────────────────────────────────────────────────────────────────

type PortalTab = 'reports' | 'messages';

const ParentPortalView: React.FC = () => {
  const { students, dailyReports, addDailyReport } = useStudents();
  const [tab, setTab] = useState<PortalTab>('reports');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [modalStudent, setModalStudent] = useState<Student | null>(null);

  const dateStr = toYMD(selectedDate);

  const reportsForDate = useMemo(
    () => dailyReports.filter(r => r.date === dateStr),
    [dailyReports, dateStr]
  );

  const reportByStudent = useMemo(() => {
    const map = new Map<string, DailyReport>();
    reportsForDate.forEach(r => map.set(r.studentId, r));
    return map;
  }, [reportsForDate]);

  const handleSaveReport = (report: DailyReport) => {
    addDailyReport(report);
    setModalStudent(null);
  };

  return (
    <div className="space-y-5">
      {/* Tab strip */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['reports', 'messages'] as PortalTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${
              tab === t ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'reports' ? 'Daily Reports' : 'Messages'}
          </button>
        ))}
      </div>

      {tab === 'reports' && (
        <div className="space-y-5">
          {/* Date picker */}
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedDate(d => addDays(d, -1))} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <ChevronLeft size={18} />
            </button>
            <div className="flex-1 text-center">
              <span className="text-sm font-bold text-gray-900">{formatDate(dateStr)}</span>
            </div>
            <button onClick={() => setSelectedDate(d => addDays(d, 1))} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <ChevronRight size={18} />
            </button>
            <input
              type="date"
              value={dateStr}
              onChange={e => setSelectedDate(new Date(e.target.value + 'T00:00:00'))}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          {/* Existing reports */}
          {reportsForDate.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Submitted Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportsForDate.map(report => {
                  const student = students.find(s => s.id === report.studentId);
                  if (!student) return null;
                  return <ReportCard key={report.id} report={report} student={student} />;
                })}
              </div>
            </div>
          )}

          {/* Student list for writing reports */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              {reportsForDate.length > 0 ? 'Remaining Students' : 'Write Reports'}
            </h3>
            <div className="space-y-2">
              {students
                .filter(s => !reportByStudent.has(s.id))
                .map(student => (
                  <div key={student.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: PROGRAM_COLORS[student.program] }}
                    >
                      {initials(student)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">{student.firstName} {student.lastName}</div>
                      <div className="text-xs text-gray-400 capitalize">{student.program}</div>
                    </div>
                    <button
                      onClick={() => setModalStudent(student)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Write Report
                    </button>
                  </div>
                ))}
              {students.filter(s => !reportByStudent.has(s.id)).length === 0 && (
                <div className="text-center py-6 text-gray-400 text-sm">All reports submitted for this date.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'messages' && <MessagesPanel />}

      {modalStudent && (
        <ReportModal
          student={modalStudent}
          date={dateStr}
          existing={reportByStudent.get(modalStudent.id)}
          onSave={handleSaveReport}
          onClose={() => setModalStudent(null)}
        />
      )}
    </div>
  );
};

export default ParentPortalView;
