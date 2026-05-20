import React, { useState, useMemo } from 'react';
import { Search, Plus, X, ChevronRight, User, Heart, Phone, FileText, Edit2, Trash2 } from 'lucide-react';
import { useStudents } from '../context/StudentContext';
import {
  Student,
  Program,
  PROGRAM_LABELS,
  PROGRAM_COLORS,
  EmergencyContact,
} from '../data/studentData';

// ── helpers ─────────────────────────────────────────────────────────────────

function calcAge(dob: string): string {
  const birth = new Date(dob);
  const now = new Date();
  const y = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  const age = m < 0 || (m === 0 && now.getDate() < birth.getDate()) ? y - 1 : y;
  return `${age} yrs`;
}

function initials(s: Student): string {
  return `${s.firstName[0]}${s.lastName[0]}`.toUpperCase();
}

const PROGRAMS: Program[] = ['preschool', 'storysparks', 'weekendPlayschool', 'primaryDaycare'];

const STATUS_STYLES: Record<Student['status'], string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  inactive: 'bg-gray-100 text-gray-500',
};

const EMPTY_STUDENT: Omit<Student, 'id'> = {
  firstName: '',
  lastName: '',
  dob: '',
  gender: 'female',
  program: 'preschool',
  enrollmentDate: '',
  status: 'active',
  allergies: [],
  medicalConditions: '',
  dietaryRequirements: '',
  medications: '',
  parentName: '',
  parentEmail: '',
  parentPhone: '',
  parentRelationship: 'Mother',
  emergencyContacts: [],
  notes: '',
};

// ── sub-components ───────────────────────────────────────────────────────────

const ProgramBadge: React.FC<{ program: Program }> = ({ program }) => (
  <span
    className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
    style={{ backgroundColor: PROGRAM_COLORS[program] }}
  >
    {PROGRAM_LABELS[program]}
  </span>
);

const StatusBadge: React.FC<{ status: Student['status'] }> = ({ status }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[status]}`}>
    {status}
  </span>
);

// ── Drawer ───────────────────────────────────────────────────────────────────

type DrawerTab = 'profile' | 'health' | 'contacts' | 'notes';

const StudentDrawer: React.FC<{
  student: Student;
  onClose: () => void;
  onEdit: (s: Student) => void;
}> = ({ student, onClose, onEdit }) => {
  const [tab, setTab] = useState<DrawerTab>('profile');

  const tabs: { key: DrawerTab; label: string; icon: React.ReactNode }[] = [
    { key: 'profile', label: 'Profile', icon: <User size={14} /> },
    { key: 'health', label: 'Health', icon: <Heart size={14} /> },
    { key: 'contacts', label: 'Contacts', icon: <Phone size={14} /> },
    { key: 'notes', label: 'Notes', icon: <FileText size={14} /> },
  ];

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      {/* panel */}
      <div className="relative z-50 w-full max-w-[480px] h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* header */}
        <div className="flex items-center gap-4 p-5 border-b border-gray-100">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
            style={{ backgroundColor: PROGRAM_COLORS[student.program] }}
          >
            {initials(student)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900">{student.firstName} {student.lastName}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <ProgramBadge program={student.program} />
              <StatusBadge status={student.status} />
            </div>
            <p className="text-xs text-gray-400 mt-1">Enrolled {student.enrollmentDate}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onEdit(student)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              title="Edit student"
            >
              <Edit2 size={16} />
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* tabs */}
        <div className="flex border-b border-gray-100 px-4 gap-1 pt-2">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                tab === t.key
                  ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {tab === 'profile' && (
            <div className="space-y-4">
              <Section title="Personal Details">
                <Row label="Date of Birth" value={student.dob} />
                <Row label="Age" value={calcAge(student.dob)} />
                <Row label="Gender" value={student.gender} />
                <Row label="Program" value={PROGRAM_LABELS[student.program]} />
                <Row label="Enrollment Date" value={student.enrollmentDate} />
                <Row label="Status" value={<StatusBadge status={student.status} />} />
              </Section>
              <Section title="Parent / Guardian">
                <Row label="Name" value={student.parentName} />
                <Row label="Relationship" value={student.parentRelationship} />
                <Row label="Email" value={student.parentEmail} />
                <Row label="Phone" value={student.parentPhone} />
              </Section>
            </div>
          )}

          {tab === 'health' && (
            <div className="space-y-4">
              <Section title="Allergies">
                {student.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {student.allergies.map(a => (
                      <span key={a} className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-semibold">
                        {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No known allergies</p>
                )}
              </Section>
              <Section title="Medical Conditions">
                <p className="text-sm text-gray-700">{student.medicalConditions || 'None recorded'}</p>
              </Section>
              <Section title="Dietary Requirements">
                <p className="text-sm text-gray-700">{student.dietaryRequirements || 'No restrictions'}</p>
              </Section>
              <Section title="Medications">
                <p className="text-sm text-gray-700">{student.medications || 'None'}</p>
              </Section>
            </div>
          )}

          {tab === 'contacts' && (
            <div className="space-y-3">
              {student.emergencyContacts.length === 0 && (
                <p className="text-sm text-gray-400">No emergency contacts added.</p>
              )}
              {student.emergencyContacts.map((ec: EmergencyContact) => (
                <div key={ec.id} className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                  <div className="font-semibold text-gray-900 text-sm">{ec.name}</div>
                  <div className="text-xs text-gray-500">{ec.relationship}</div>
                  <div className="text-sm text-gray-700">{ec.phone}</div>
                  {ec.email && <div className="text-sm text-gray-500">{ec.email}</div>}
                </div>
              ))}
            </div>
          )}

          {tab === 'notes' && (
            <div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {student.notes || 'No notes recorded.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
    <div className="bg-gray-50 rounded-xl p-4 space-y-2">{children}</div>
  </div>
);

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-xs text-gray-500 shrink-0">{label}</span>
    <span className="text-sm text-gray-800 font-medium text-right">{value}</span>
  </div>
);

// ── Add/Edit Modal ───────────────────────────────────────────────────────────

const StudentModal: React.FC<{
  initial: Partial<Student>;
  onSave: (s: Student) => void;
  onClose: () => void;
}> = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState<Omit<Student, 'id'>>({
    ...EMPTY_STUDENT,
    ...initial,
  });
  const [allergyInput, setAllergyInput] = useState('');

  const set = <K extends keyof Omit<Student, 'id'>>(key: K, value: Omit<Student, 'id'>[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const addAllergy = () => {
    const trimmed = allergyInput.trim();
    if (trimmed && !form.allergies.includes(trimmed)) {
      set('allergies', [...form.allergies, trimmed]);
      setAllergyInput('');
    }
  };

  const removeAllergy = (a: string) => set('allergies', form.allergies.filter(x => x !== a));

  const handleSave = () => {
    if (!form.firstName || !form.lastName || !form.dob || !form.enrollmentDate) return;
    const id = (initial as Student).id ?? `stu-${Date.now()}`;
    onSave({ id, ...form });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {(initial as Student).id ? 'Edit Student' : 'Add Student'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <ModalSection title="Personal Details">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name *">
                <input
                  className="field-input"
                  value={form.firstName}
                  onChange={e => set('firstName', e.target.value)}
                  placeholder="First name"
                />
              </Field>
              <Field label="Last Name *">
                <input
                  className="field-input"
                  value={form.lastName}
                  onChange={e => set('lastName', e.target.value)}
                  placeholder="Last name"
                />
              </Field>
              <Field label="Date of Birth *">
                <input
                  type="date"
                  className="field-input"
                  value={form.dob}
                  onChange={e => set('dob', e.target.value)}
                />
              </Field>
              <Field label="Gender">
                <select className="field-input" value={form.gender} onChange={e => set('gender', e.target.value as Student['gender'])}>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field label="Program">
                <select className="field-input" value={form.program} onChange={e => set('program', e.target.value as Program)}>
                  {PROGRAMS.map(p => <option key={p} value={p}>{PROGRAM_LABELS[p]}</option>)}
                </select>
              </Field>
              <Field label="Enrollment Date *">
                <input
                  type="date"
                  className="field-input"
                  value={form.enrollmentDate}
                  onChange={e => set('enrollmentDate', e.target.value)}
                />
              </Field>
              <Field label="Status">
                <select className="field-input" value={form.status} onChange={e => set('status', e.target.value as Student['status'])}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </Field>
            </div>
          </ModalSection>

          <ModalSection title="Parent / Guardian">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Parent Name">
                <input className="field-input" value={form.parentName} onChange={e => set('parentName', e.target.value)} placeholder="Full name" />
              </Field>
              <Field label="Relationship">
                <input className="field-input" value={form.parentRelationship} onChange={e => set('parentRelationship', e.target.value)} placeholder="e.g. Mother" />
              </Field>
              <Field label="Email">
                <input type="email" className="field-input" value={form.parentEmail} onChange={e => set('parentEmail', e.target.value)} placeholder="email@example.com" />
              </Field>
              <Field label="Phone">
                <input className="field-input" value={form.parentPhone} onChange={e => set('parentPhone', e.target.value)} placeholder="+61 4xx xxx xxx" />
              </Field>
            </div>
          </ModalSection>

          <ModalSection title="Health Information">
            <div className="space-y-3">
              <Field label="Allergies">
                <div className="flex gap-2">
                  <input
                    className="field-input flex-1"
                    value={allergyInput}
                    onChange={e => setAllergyInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addAllergy()}
                    placeholder="Type an allergy and press Enter"
                  />
                  <button onClick={addAllergy} className="px-3 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.allergies.map(a => (
                    <span key={a} className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-semibold">
                      {a}
                      <button onClick={() => removeAllergy(a)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </Field>
              <Field label="Medical Conditions">
                <textarea className="field-input h-16 resize-none" value={form.medicalConditions} onChange={e => set('medicalConditions', e.target.value)} placeholder="Any medical conditions..." />
              </Field>
              <Field label="Dietary Requirements">
                <input className="field-input" value={form.dietaryRequirements} onChange={e => set('dietaryRequirements', e.target.value)} placeholder="e.g. Vegetarian, Nut-free" />
              </Field>
              <Field label="Medications">
                <input className="field-input" value={form.medications} onChange={e => set('medications', e.target.value)} placeholder="Current medications" />
              </Field>
            </div>
          </ModalSection>

          <ModalSection title="Notes">
            <textarea
              className="field-input h-20 w-full resize-none"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Additional notes about this student..."
            />
          </ModalSection>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 font-medium">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors"
          >
            {(initial as Student).id ? 'Save Changes' : 'Add Student'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ModalSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{title}</h3>
    {children}
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="col-span-1">
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    {children}
  </div>
);

// ── Main View ────────────────────────────────────────────────────────────────

const StudentsView: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const [search, setSearch] = useState('');
  const [programFilter, setProgramFilter] = useState<Program | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Student['status'] | 'all'>('all');
  const [drawerStudent, setDrawerStudent] = useState<Student | null>(null);
  const [modalState, setModalState] = useState<{ open: boolean; student?: Student }>({ open: false });

  const filtered = useMemo(() => {
    return students.filter(s => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.parentName.toLowerCase().includes(q);
      const matchProgram = programFilter === 'all' || s.program === programFilter;
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchSearch && matchProgram && matchStatus;
    });
  }, [students, search, programFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter(s => s.status === 'active').length;
    const pending = students.filter(s => s.status === 'pending').length;
    const byProgram = PROGRAMS.map(p => ({
      program: p,
      count: students.filter(s => s.program === p).length,
    }));
    return { total, active, pending, byProgram };
  }, [students]);

  const handleSave = (student: Student) => {
    if (students.find(s => s.id === student.id)) {
      updateStudent(student);
      if (drawerStudent?.id === student.id) setDrawerStudent(student);
    } else {
      addStudent(student);
    }
    setModalState({ open: false });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this student? This cannot be undone.')) {
      deleteStudent(id);
      if (drawerStudent?.id === id) setDrawerStudent(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Students" value={stats.total} color="#f59e0b" />
        <StatCard label="Active" value={stats.active} color="#10b981" />
        <StatCard label="Pending" value={stats.pending} color="#f59e0b" />
        {stats.byProgram.map(({ program, count }) => (
          <StatCard key={program} label={PROGRAM_LABELS[program]} value={count} color={PROGRAM_COLORS[program]} small />
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            placeholder="Search students or parents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
          value={programFilter}
          onChange={e => setProgramFilter(e.target.value as Program | 'all')}
        >
          <option value="all">All Programs</option>
          {PROGRAMS.map(p => <option key={p} value={p}>{PROGRAM_LABELS[p]}</option>)}
        </select>
        <select
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as Student['status'] | 'all')}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          onClick={() => setModalState({ open: true, student: undefined })}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors"
        >
          <Plus size={15} /> Add Student
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-400 text-sm">No students match your filters.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(student => (
            <div
              key={student.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setDrawerStudent(student)}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: PROGRAM_COLORS[student.program] }}
                >
                  {initials(student)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                      {student.firstName} {student.lastName}
                    </h3>
                    <StatusBadge status={student.status} />
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5 items-center">
                    <ProgramBadge program={student.program} />
                    <span className="text-xs text-gray-400">{calcAge(student.dob)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 truncate">Parent: {student.parentName}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                <button
                  onClick={e => { e.stopPropagation(); setDrawerStudent(student); }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs text-gray-600 font-medium transition-colors"
                >
                  <ChevronRight size={13} /> View
                </button>
                <button
                  onClick={e => { e.stopPropagation(); setModalState({ open: true, student }); }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 rounded-lg text-xs text-amber-700 font-medium transition-colors"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(student.id); }}
                  className="flex items-center justify-center px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-xs text-red-600 font-medium transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {drawerStudent && (
        <StudentDrawer
          student={drawerStudent}
          onClose={() => setDrawerStudent(null)}
          onEdit={s => { setModalState({ open: true, student: s }); }}
        />
      )}

      {modalState.open && (
        <StudentModal
          initial={modalState.student ?? {}}
          onSave={handleSave}
          onClose={() => setModalState({ open: false })}
        />
      )}

      <style>{`
        .field-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.625rem;
          font-size: 0.875rem;
          outline: none;
          transition: box-shadow 0.15s;
        }
        .field-input:focus {
          box-shadow: 0 0 0 2px #fcd34d;
        }
      `}</style>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number; color: string; small?: boolean }> = ({
  label,
  value,
  color,
  small,
}) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
    <div className="text-xs text-gray-500 font-medium truncate">{label}</div>
    <div className="text-2xl font-bold mt-1" style={{ color: small ? color : undefined }}>
      {value}
    </div>
    <div className="mt-1.5 h-1 rounded-full bg-gray-100">
      <div className="h-1 rounded-full" style={{ width: '60%', backgroundColor: color }} />
    </div>
  </div>
);

export default StudentsView;
