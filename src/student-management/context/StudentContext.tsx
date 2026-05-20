import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Student,
  AttendanceRecord,
  DailyReport,
  Message,
  Invoice,
  InvoiceStatus,
  DEFAULT_STUDENTS,
  DEFAULT_ATTENDANCE,
  DEFAULT_DAILY_REPORTS,
  DEFAULT_MESSAGES,
  DEFAULT_INVOICES,
} from '../data/studentData';

const STORAGE_KEY = 'sunnyseeeds_student_data';

interface StoredData {
  students: Student[];
  attendance: AttendanceRecord[];
  dailyReports: DailyReport[];
  messages: Message[];
  invoices: Invoice[];
}

interface StudentContextValue {
  students: Student[];
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;

  attendance: AttendanceRecord[];
  markAttendance: (record: AttendanceRecord) => void;
  updateAttendance: (record: AttendanceRecord) => void;

  dailyReports: DailyReport[];
  addDailyReport: (report: DailyReport) => void;

  messages: Message[];
  sendMessage: (message: Message) => void;
  markMessageRead: (id: string) => void;

  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  recordPayment: (id: string, paidDate: string) => void;

  getStudentAttendance: (studentId: string, month: string) => AttendanceRecord[];
  getTodayAttendance: () => AttendanceRecord[];
  getStudentMessages: (studentId: string) => Message[];
  getStudentInvoices: (studentId: string) => Invoice[];
}

const StudentContext = createContext<StudentContextValue | null>(null);

function loadData(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as StoredData;
    }
  } catch {
    // fall through to defaults
  }
  return {
    students: DEFAULT_STUDENTS,
    attendance: DEFAULT_ATTENDANCE,
    dailyReports: DEFAULT_DAILY_REPORTS,
    messages: DEFAULT_MESSAGES,
    invoices: DEFAULT_INVOICES,
  };
}

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<StoredData>(loadData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const update = (partial: Partial<StoredData>) =>
    setData(prev => ({ ...prev, ...partial }));

  const addStudent = (student: Student) =>
    update({ students: [...data.students, student] });

  const updateStudent = (student: Student) =>
    update({ students: data.students.map(s => (s.id === student.id ? student : s)) });

  const deleteStudent = (id: string) =>
    update({ students: data.students.filter(s => s.id !== id) });

  const markAttendance = (record: AttendanceRecord) => {
    const exists = data.attendance.find(
      a => a.studentId === record.studentId && a.date === record.date
    );
    if (exists) {
      update({ attendance: data.attendance.map(a => (a.id === exists.id ? { ...record, id: exists.id } : a)) });
    } else {
      update({ attendance: [...data.attendance, record] });
    }
  };

  const updateAttendance = (record: AttendanceRecord) =>
    update({ attendance: data.attendance.map(a => (a.id === record.id ? record : a)) });

  const addDailyReport = (report: DailyReport) =>
    update({ dailyReports: [...data.dailyReports, report] });

  const sendMessage = (message: Message) =>
    update({ messages: [...data.messages, message] });

  const markMessageRead = (id: string) =>
    update({ messages: data.messages.map(m => (m.id === id ? { ...m, read: true } : m)) });

  const addInvoice = (invoice: Invoice) =>
    update({ invoices: [...data.invoices, invoice] });

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) =>
    update({ invoices: data.invoices.map(inv => (inv.id === id ? { ...inv, status } : inv)) });

  const recordPayment = (id: string, paidDate: string) =>
    update({
      invoices: data.invoices.map(inv =>
        inv.id === id ? { ...inv, status: 'paid' as InvoiceStatus, paidDate } : inv
      ),
    });

  const getStudentAttendance = (studentId: string, month: string): AttendanceRecord[] =>
    data.attendance.filter(a => a.studentId === studentId && a.date.startsWith(month));

  const getTodayAttendance = (): AttendanceRecord[] => {
    const today = new Date().toISOString().slice(0, 10);
    return data.attendance.filter(a => a.date === today);
  };

  const getStudentMessages = (studentId: string): Message[] =>
    data.messages.filter(m => m.studentId === studentId);

  const getStudentInvoices = (studentId: string): Invoice[] =>
    data.invoices.filter(inv => inv.studentId === studentId);

  return (
    <StudentContext.Provider
      value={{
        ...data,
        addStudent,
        updateStudent,
        deleteStudent,
        markAttendance,
        updateAttendance,
        addDailyReport,
        sendMessage,
        markMessageRead,
        addInvoice,
        updateInvoiceStatus,
        recordPayment,
        getStudentAttendance,
        getTodayAttendance,
        getStudentMessages,
        getStudentInvoices,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = (): StudentContextValue => {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error('useStudents must be used within StudentProvider');
  return ctx;
};
