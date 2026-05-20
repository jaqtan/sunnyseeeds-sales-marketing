export type Program = 'preschool' | 'storysparks' | 'weekendPlayschool' | 'primaryDaycare';

export const PROGRAM_LABELS: Record<Program, string> = {
  preschool: 'Preschool',
  storysparks: 'StorySparks',
  weekendPlayschool: 'Weekend Playschool',
  primaryDaycare: 'Primary Daycare',
};

export const PROGRAM_COLORS: Record<Program, string> = {
  preschool: '#f59e0b',
  storysparks: '#10b981',
  weekendPlayschool: '#6366f1',
  primaryDaycare: '#ec4899',
};

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  program: Program;
  enrollmentDate: string;
  status: 'active' | 'pending' | 'inactive';
  photo?: string;
  allergies: string[];
  medicalConditions: string;
  dietaryRequirements: string;
  medications: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  parentRelationship: string;
  emergencyContacts: EmergencyContact[];
  notes: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'holiday';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  note?: string;
}

export interface DailyReport {
  id: string;
  studentId: string;
  date: string;
  mood: 'happy' | 'okay' | 'sad';
  meals: {
    breakfast: 'all' | 'some' | 'none';
    lunch: 'all' | 'some' | 'none';
    snack: 'all' | 'some' | 'none';
  };
  napMinutes: number;
  activities: string[];
  notes: string;
  staffName: string;
}

export interface Message {
  id: string;
  studentId: string;
  from: 'staff' | 'parent';
  senderName: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  studentId: string;
  invoiceNumber: string;
  month: string;
  items: InvoiceItem[];
  total: number;
  status: InvoiceStatus;
  dueDate: string;
  paidDate?: string;
  notes?: string;
}

export const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'stu-001',
    firstName: 'Amelia',
    lastName: 'Thornton',
    dob: '2021-03-14',
    gender: 'female',
    program: 'preschool',
    enrollmentDate: '2024-01-15',
    status: 'active',
    allergies: ['Peanuts', 'Tree nuts'],
    medicalConditions: 'Mild asthma — has rescue inhaler on file',
    dietaryRequirements: 'Nut-free meals only',
    medications: 'Ventolin inhaler (as needed)',
    parentName: 'Sarah Thornton',
    parentEmail: 'sarah.thornton@email.com',
    parentPhone: '+61 412 345 678',
    parentRelationship: 'Mother',
    emergencyContacts: [
      { id: 'ec-001a', name: 'James Thornton', relationship: 'Father', phone: '+61 423 456 789', email: 'james.thornton@email.com' },
      { id: 'ec-001b', name: 'Dianne Fletcher', relationship: 'Grandmother', phone: '+61 398 765 432' },
    ],
    notes: 'Amelia loves painting and outdoor activities. She is very social and adapts well to group settings.',
  },
  {
    id: 'stu-002',
    firstName: 'Liam',
    lastName: 'Nguyen',
    dob: '2020-07-22',
    gender: 'male',
    program: 'preschool',
    enrollmentDate: '2023-08-01',
    status: 'active',
    allergies: [],
    medicalConditions: '',
    dietaryRequirements: 'Vegetarian',
    medications: '',
    parentName: 'Minh Nguyen',
    parentEmail: 'minh.nguyen@email.com',
    parentPhone: '+61 434 567 890',
    parentRelationship: 'Father',
    emergencyContacts: [
      { id: 'ec-002a', name: 'Lan Nguyen', relationship: 'Mother', phone: '+61 445 678 901', email: 'lan.nguyen@email.com' },
    ],
    notes: 'Liam is particularly fond of building blocks and story time. He is a quick learner.',
  },
  {
    id: 'stu-003',
    firstName: 'Isla',
    lastName: 'MacKenzie',
    dob: '2022-01-05',
    gender: 'female',
    program: 'storysparks',
    enrollmentDate: '2024-03-10',
    status: 'active',
    allergies: ['Dairy'],
    medicalConditions: 'Lactose intolerance',
    dietaryRequirements: 'Dairy-free alternatives required',
    medications: '',
    parentName: 'Fiona MacKenzie',
    parentEmail: 'fiona.mackenzie@email.com',
    parentPhone: '+61 456 789 012',
    parentRelationship: 'Mother',
    emergencyContacts: [
      { id: 'ec-003a', name: 'Angus MacKenzie', relationship: 'Father', phone: '+61 467 890 123' },
      { id: 'ec-003b', name: 'Helen Ross', relationship: 'Aunt', phone: '+61 478 901 234', email: 'helen.ross@email.com' },
    ],
    notes: 'Isla loves books and imaginative play. She is settling in wonderfully to the StorySparks program.',
  },
  {
    id: 'stu-004',
    firstName: 'Noah',
    lastName: 'Patel',
    dob: '2021-09-18',
    gender: 'male',
    program: 'storysparks',
    enrollmentDate: '2024-02-01',
    status: 'active',
    allergies: ['Eggs'],
    medicalConditions: '',
    dietaryRequirements: 'Egg-free meals',
    medications: '',
    parentName: 'Priya Patel',
    parentEmail: 'priya.patel@email.com',
    parentPhone: '+61 489 012 345',
    parentRelationship: 'Mother',
    emergencyContacts: [
      { id: 'ec-004a', name: 'Raj Patel', relationship: 'Father', phone: '+61 490 123 456', email: 'raj.patel@email.com' },
    ],
    notes: 'Noah is enthusiastic about music and science activities. He enjoys working collaboratively.',
  },
  {
    id: 'stu-005',
    firstName: 'Charlotte',
    lastName: 'Okonkwo',
    dob: '2020-11-30',
    gender: 'female',
    program: 'weekendPlayschool',
    enrollmentDate: '2024-04-06',
    status: 'active',
    allergies: [],
    medicalConditions: '',
    dietaryRequirements: '',
    medications: '',
    parentName: 'Adaeze Okonkwo',
    parentEmail: 'adaeze.okonkwo@email.com',
    parentPhone: '+61 401 234 567',
    parentRelationship: 'Mother',
    emergencyContacts: [
      { id: 'ec-005a', name: 'Emeka Okonkwo', relationship: 'Father', phone: '+61 412 345 670', email: 'emeka.okonkwo@email.com' },
      { id: 'ec-005b', name: 'Grace Eze', relationship: 'Aunt', phone: '+61 423 456 781' },
    ],
    notes: 'Charlotte is confident, creative, and loves art projects. She has excellent fine motor skills.',
  },
  {
    id: 'stu-006',
    firstName: 'Oliver',
    lastName: 'Johansson',
    dob: '2021-05-12',
    gender: 'male',
    program: 'weekendPlayschool',
    enrollmentDate: '2024-05-11',
    status: 'pending',
    allergies: ['Gluten'],
    medicalConditions: 'Coeliac disease — strict gluten-free diet required',
    dietaryRequirements: 'Strictly gluten-free',
    medications: '',
    parentName: 'Astrid Johansson',
    parentEmail: 'astrid.johansson@email.com',
    parentPhone: '+61 434 567 892',
    parentRelationship: 'Mother',
    emergencyContacts: [
      { id: 'ec-006a', name: 'Erik Johansson', relationship: 'Father', phone: '+61 445 678 903', email: 'erik.johansson@email.com' },
    ],
    notes: 'Oliver is awaiting full enrolment confirmation. Family has been briefed on gluten-free protocols.',
  },
  {
    id: 'stu-007',
    firstName: 'Mia',
    lastName: 'Ferreira',
    dob: '2019-08-25',
    gender: 'female',
    program: 'primaryDaycare',
    enrollmentDate: '2023-01-20',
    status: 'active',
    allergies: [],
    medicalConditions: '',
    dietaryRequirements: '',
    medications: '',
    parentName: 'Carlos Ferreira',
    parentEmail: 'carlos.ferreira@email.com',
    parentPhone: '+61 456 789 014',
    parentRelationship: 'Father',
    emergencyContacts: [
      { id: 'ec-007a', name: 'Ana Ferreira', relationship: 'Mother', phone: '+61 467 890 125', email: 'ana.ferreira@email.com' },
      { id: 'ec-007b', name: 'Teresa Gomes', relationship: 'Grandmother', phone: '+61 478 901 236' },
    ],
    notes: 'Mia is one of our longest-enrolled students. She is a natural leader and mentors younger children.',
  },
  {
    id: 'stu-008',
    firstName: 'Ethan',
    lastName: 'Williams',
    dob: '2020-02-14',
    gender: 'male',
    program: 'primaryDaycare',
    enrollmentDate: '2024-06-03',
    status: 'inactive',
    allergies: [],
    medicalConditions: '',
    dietaryRequirements: '',
    medications: '',
    parentName: 'Jessica Williams',
    parentEmail: 'jessica.williams@email.com',
    parentPhone: '+61 489 012 347',
    parentRelationship: 'Mother',
    emergencyContacts: [
      { id: 'ec-008a', name: 'Michael Williams', relationship: 'Father', phone: '+61 490 123 458', email: 'michael.williams@email.com' },
    ],
    notes: 'Ethan is currently on a leave of absence. Family has indicated potential return in Term 3.',
  },
];

function dateStr(daysAgo: number): string {
  const d = new Date('2026-05-20');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

const ACTIVE_IDS = ['stu-001', 'stu-002', 'stu-003', 'stu-004', 'stu-005', 'stu-007'];
const ALL_IDS = DEFAULT_STUDENTS.map(s => s.id);

const ATTENDANCE_STATUSES: AttendanceStatus[] = ['present', 'present', 'present', 'present', 'present', 'late', 'absent', 'excused'];

export const DEFAULT_ATTENDANCE: AttendanceRecord[] = (() => {
  const records: AttendanceRecord[] = [];
  let idx = 0;
  for (let day = 14; day >= 0; day--) {
    const date = dateStr(day);
    const dow = new Date(date).getDay();
    if (dow === 0 || dow === 6) continue;
    ALL_IDS.forEach((studentId, si) => {
      const status = ATTENDANCE_STATUSES[(si + day) % ATTENDANCE_STATUSES.length];
      records.push({
        id: `att-${idx++}`,
        studentId,
        date,
        status,
        checkIn: status === 'present' || status === 'late' ? (status === 'late' ? '09:45' : '08:30') : undefined,
        checkOut: status === 'present' || status === 'late' ? '15:30' : undefined,
        note: status === 'absent' ? 'Parent notified absence' : status === 'excused' ? 'Medical appointment' : undefined,
      });
    });
  }
  return records;
})();

const ACTIVITY_POOL = ['Story Time', 'Art', 'Outdoor Play', 'Music', 'Math Games', 'Science', 'Free Play'];

export const DEFAULT_DAILY_REPORTS: DailyReport[] = (() => {
  const reports: DailyReport[] = [];
  const moods: DailyReport['mood'][] = ['happy', 'happy', 'okay', 'happy', 'sad'];
  const mealOptions: Array<'all' | 'some' | 'none'> = ['all', 'some', 'none'];
  let idx = 0;
  for (let day = 4; day >= 0; day--) {
    const date = dateStr(day);
    ACTIVE_IDS.forEach((studentId, si) => {
      reports.push({
        id: `rpt-${idx++}`,
        studentId,
        date,
        mood: moods[(si + day) % moods.length],
        meals: {
          breakfast: mealOptions[(si) % 3],
          lunch: mealOptions[(si + 1) % 3],
          snack: mealOptions[(si + 2) % 3],
        },
        napMinutes: [0, 30, 45, 60, 90][(si + day) % 5],
        activities: ACTIVITY_POOL.slice((si + day) % 5, ((si + day) % 5) + 3),
        notes: day === 0 ? 'Great day — engaged all session.' : 'Settled well and participated actively.',
        staffName: ['Ms. Priya', 'Mr. David', 'Ms. Rachel'][(si + day) % 3],
      });
    });
  }
  return reports;
})();

export const DEFAULT_MESSAGES: Message[] = [
  { id: 'msg-001', studentId: 'stu-001', from: 'staff', senderName: 'Ms. Priya', subject: 'Weekly Update – Amelia', body: 'Amelia has had a wonderful week. She completed her first finger-painting and was very proud!', timestamp: '2026-05-19T09:00:00Z', read: true },
  { id: 'msg-002', studentId: 'stu-001', from: 'parent', senderName: 'Sarah Thornton', subject: 'Re: Weekly Update – Amelia', body: 'Thank you so much! She talked about it all weekend. Could you save the painting for us?', timestamp: '2026-05-19T18:30:00Z', read: true },
  { id: 'msg-003', studentId: 'stu-001', from: 'staff', senderName: 'Ms. Rachel', subject: 'Inhaler Reminder', body: 'Just a reminder that Amelia\'s Ventolin inhaler will expire next month. Please bring a replacement at your convenience.', timestamp: '2026-05-20T08:00:00Z', read: false },
  { id: 'msg-004', studentId: 'stu-002', from: 'staff', senderName: 'Mr. David', subject: 'Liam\'s Progress', body: 'Liam has been excelling in our literacy activities this week. He can now recognise 15 sight words!', timestamp: '2026-05-18T10:00:00Z', read: true },
  { id: 'msg-005', studentId: 'stu-002', from: 'parent', senderName: 'Minh Nguyen', subject: 'Re: Liam\'s Progress', body: 'That is fantastic news! He has been practising at home too. We are very proud.', timestamp: '2026-05-18T20:00:00Z', read: false },
  { id: 'msg-006', studentId: 'stu-003', from: 'staff', senderName: 'Ms. Priya', subject: 'Dairy-Free Snack Reminder', body: 'We wanted to confirm that all snacks provided this week were dairy-free per Isla\'s requirements.', timestamp: '2026-05-17T11:00:00Z', read: true },
  { id: 'msg-007', studentId: 'stu-003', from: 'parent', senderName: 'Fiona MacKenzie', subject: 'Re: Dairy-Free Snack Reminder', body: 'Thank you for being so attentive. It means the world to us!', timestamp: '2026-05-17T19:00:00Z', read: true },
  { id: 'msg-008', studentId: 'stu-004', from: 'staff', senderName: 'Mr. David', subject: 'Noah\'s Science Experiment', body: 'Noah led our volcano experiment today and explained it perfectly to his classmates. Excellent curiosity!', timestamp: '2026-05-19T14:00:00Z', read: false },
  { id: 'msg-009', studentId: 'stu-004', from: 'parent', senderName: 'Priya Patel', subject: 'Upcoming Holiday', body: 'We will be travelling from 28 May to 2 June. Please mark Noah as excused for those days.', timestamp: '2026-05-20T07:30:00Z', read: false },
  { id: 'msg-010', studentId: 'stu-005', from: 'staff', senderName: 'Ms. Rachel', subject: 'Charlotte\'s Artwork', body: 'Charlotte created a stunning collage this weekend. We have displayed it in our foyer — please have a look when you next drop in!', timestamp: '2026-05-18T13:00:00Z', read: true },
  { id: 'msg-011', studentId: 'stu-005', from: 'parent', senderName: 'Adaeze Okonkwo', subject: 'Birthday Party Invitation', body: 'Charlotte is turning 6 on the 28th — we would love to invite her classmates. Could you share a note with families?', timestamp: '2026-05-19T21:00:00Z', read: false },
  { id: 'msg-012', studentId: 'stu-006', from: 'staff', senderName: 'Ms. Priya', subject: 'Enrolment Confirmation Pending', body: 'Welcome to SunnySeeds! We are completing Oliver\'s enrolment and will confirm gluten-free arrangements shortly.', timestamp: '2026-05-15T09:00:00Z', read: true },
  { id: 'msg-013', studentId: 'stu-006', from: 'parent', senderName: 'Astrid Johansson', subject: 'Re: Enrolment Confirmation Pending', body: 'Thank you. We have sent through the medical documentation. Please let us know if you need anything else.', timestamp: '2026-05-15T17:00:00Z', read: true },
  { id: 'msg-014', studentId: 'stu-007', from: 'staff', senderName: 'Mr. David', subject: 'Mia\'s Leadership', body: 'Mia was a fantastic buddy to our newer students this week. Her patience and kindness are truly admirable.', timestamp: '2026-05-19T15:00:00Z', read: false },
  { id: 'msg-015', studentId: 'stu-007', from: 'parent', senderName: 'Carlos Ferreira', subject: 'After-Hours Pick-up', body: 'I may be 15 minutes late on Thursday. My wife Ana will be picking up instead — she is on the authorised list.', timestamp: '2026-05-20T06:45:00Z', read: false },
  { id: 'msg-016', studentId: 'stu-008', from: 'parent', senderName: 'Jessica Williams', subject: 'Return Date Update', body: 'We are hoping to have Ethan return from Term 3, Week 1. Can you confirm the re-enrolment process?', timestamp: '2026-05-14T10:00:00Z', read: true },
  { id: 'msg-017', studentId: 'stu-008', from: 'staff', senderName: 'Ms. Rachel', subject: 'Re: Return Date Update', body: 'We would love to have Ethan back! Please complete the re-enrolment form linked in our parent portal.', timestamp: '2026-05-14T14:00:00Z', read: true },
];

const PROGRAM_FEES: Record<Program, number> = {
  preschool: 1200,
  storysparks: 950,
  weekendPlayschool: 480,
  primaryDaycare: 1450,
};

export const DEFAULT_INVOICES: Invoice[] = DEFAULT_STUDENTS.map((student, i) => {
  const fee = PROGRAM_FEES[student.program];
  const statuses: InvoiceStatus[] = ['paid', 'paid', 'sent', 'paid', 'overdue', 'draft', 'paid', 'sent'];
  const status = statuses[i];
  return {
    id: `inv-${String(i + 1).padStart(3, '0')}`,
    studentId: student.id,
    invoiceNumber: `SS-2026-05-${String(i + 1).padStart(3, '0')}`,
    month: 'May 2026',
    items: [
      { id: `item-${i}-1`, description: `${PROGRAM_LABELS[student.program]} – Monthly Tuition`, amount: fee },
      { id: `item-${i}-2`, description: 'Materials & Resources Fee', amount: 45 },
    ],
    total: fee + 45,
    status,
    dueDate: '2026-05-07',
    paidDate: status === 'paid' ? `2026-05-0${i + 2}` : undefined,
    notes: status === 'overdue' ? 'Second reminder sent 14 May' : undefined,
  };
});
