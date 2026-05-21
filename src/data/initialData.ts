export type Program = 'preschool' | 'storysparks' | 'weekendPlayschool' | 'primaryDaycare';

export const PROGRAMS: { key: Program; label: string; color: string }[] = [
  { key: 'preschool', label: 'Preschool', color: '#f59e0b' },
  { key: 'storysparks', label: 'StorySparks', color: '#10b981' },
  { key: 'weekendPlayschool', label: 'Weekend Playschool', color: '#6366f1' },
  { key: 'primaryDaycare', label: 'Primary Daycare', color: '#ec4899' },
];

export interface ProgramData {
  organicLeads: number;
  paidLeads: number;
  partnershipLeads: number;
  targetLeads: number;
  toursCompleted: number;
  targetTours: number;
  interviewsConducted: number;
  targetInterviews: number;
  offersSent: number;
  targetOffers: number;
  enrollmentsCompleted: number;
  targetEnrollments: number;
}

export type MonthlyProgram = 'preschool1' | 'preschool2' | 'storysparks' | 'weekendPlayschool' | 'primaryDaycare' | 'fitnessProgram';

export const MONTHLY_PROGRAMS: { key: MonthlyProgram; label: string; color: string }[] = [
  { key: 'preschool1', label: 'Preschool 1', color: '#f59e0b' },
  { key: 'preschool2', label: 'Preschool 2', color: '#f97316' },
  { key: 'storysparks', label: 'StorySparks', color: '#10b981' },
  { key: 'weekendPlayschool', label: 'Weekend Playschool', color: '#6366f1' },
  { key: 'primaryDaycare', label: 'Primary Daycare', color: '#ec4899' },
  { key: 'fitnessProgram', label: 'Fitness Program', color: '#14b8a6' },
];

export interface MonthlyEntry {
  month: string;
  preschool1: number | null;
  preschool2: number | null;
  storysparks: number | null;
  weekendPlayschool: number | null;
  primaryDaycare: number | null;
  fitnessProgram: number | null;
}

export interface ForecastEntry {
  month: string;
  preschool: number | null;
  storysparks: number | null;
  weekendPlayschool: number | null;
  primaryDaycare: number | null;
  leadToTour: number | null;
  tourToInterview: number | null;
  interviewToOffer: number | null;
  offerToEnrollment: number | null;
}

export interface DashboardData {
  programs: Record<Program, ProgramData>;
  monthly: MonthlyEntry[];
  forecast: ForecastEntry[];
  lastUpdated: string;
}

const emptyProgram = (): ProgramData => ({
  organicLeads: 0,
  paidLeads: 0,
  partnershipLeads: 0,
  targetLeads: 0,
  toursCompleted: 0,
  targetTours: 0,
  interviewsConducted: 0,
  targetInterviews: 0,
  offersSent: 0,
  targetOffers: 0,
  enrollmentsCompleted: 0,
  targetEnrollments: 0,
});

export const DEFAULT_DATA: DashboardData = {
  programs: {
    preschool: { ...emptyProgram(), targetLeads: 40, targetTours: 30, targetInterviews: 20, targetOffers: 15, targetEnrollments: 12 },
    storysparks: { ...emptyProgram(), targetLeads: 25, targetTours: 20, targetInterviews: 14, targetOffers: 10, targetEnrollments: 8 },
    weekendPlayschool: { ...emptyProgram(), targetLeads: 20, targetTours: 15, targetInterviews: 10, targetOffers: 8, targetEnrollments: 6 },
    primaryDaycare: { ...emptyProgram(), targetLeads: 30, targetTours: 22, targetInterviews: 16, targetOffers: 12, targetEnrollments: 10 },
  },
  monthly: [
    { month: 'Jan 2026', preschool1: null, preschool2: null, storysparks: null, weekendPlayschool: null, primaryDaycare: null, fitnessProgram: null },
    { month: 'Feb 2026', preschool1: null, preschool2: null, storysparks: null, weekendPlayschool: null, primaryDaycare: null, fitnessProgram: null },
    { month: 'Mar 2026', preschool1: null, preschool2: null, storysparks: null, weekendPlayschool: null, primaryDaycare: null, fitnessProgram: null },
    { month: 'Apr 2026', preschool1: null, preschool2: null, storysparks: null, weekendPlayschool: null, primaryDaycare: null, fitnessProgram: null },
    { month: 'May 2026', preschool1: 0, preschool2: null, storysparks: null, weekendPlayschool: null, primaryDaycare: null, fitnessProgram: null },
    { month: 'Jun 2026', preschool1: null, preschool2: null, storysparks: null, weekendPlayschool: null, primaryDaycare: null, fitnessProgram: null },
  ],
  forecast: [
    { month: 'Jan', preschool: null, storysparks: null, weekendPlayschool: null, primaryDaycare: null, leadToTour: null, tourToInterview: null, interviewToOffer: null, offerToEnrollment: null },
    { month: 'Feb', preschool: null, storysparks: null, weekendPlayschool: null, primaryDaycare: null, leadToTour: null, tourToInterview: null, interviewToOffer: null, offerToEnrollment: null },
    { month: 'Mar', preschool: null, storysparks: null, weekendPlayschool: null, primaryDaycare: null, leadToTour: null, tourToInterview: null, interviewToOffer: null, offerToEnrollment: null },
    { month: 'Apr', preschool: null, storysparks: null, weekendPlayschool: null, primaryDaycare: null, leadToTour: null, tourToInterview: null, interviewToOffer: null, offerToEnrollment: null },
    { month: 'May', preschool: null, storysparks: null, weekendPlayschool: null, primaryDaycare: null, leadToTour: null, tourToInterview: null, interviewToOffer: null, offerToEnrollment: null },
    { month: 'Jun', preschool: null, storysparks: null, weekendPlayschool: null, primaryDaycare: null, leadToTour: null, tourToInterview: null, interviewToOffer: null, offerToEnrollment: null },
  ],
  lastUpdated: 'May 19, 2026',
};
