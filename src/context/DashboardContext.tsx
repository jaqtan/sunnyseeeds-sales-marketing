import React, { createContext, useContext, useState, useCallback } from 'react';
import { DashboardData, DEFAULT_DATA, Program, ProgramData, ForecastEntry, MonthlyProgram } from '../data/initialData';

interface DashboardContextType {
  data: DashboardData;
  updateProgram: (program: Program, field: keyof ProgramData, value: number) => void;
  updateMonthly: (index: number, program: MonthlyProgram, value: number | null) => void;
  updateForecast: (index: number, field: keyof ForecastEntry, value: number | null) => void;
  getTotals: () => ProgramData;
  getConversionRates: (program: Program) => {
    leadToTour: number;
    tourToInterview: number;
    interviewToOffer: number;
    offerToEnrollment: number;
    overall: number;
  };
  getDropoffs: (program: Program) => {
    notProceedingToTour: number;
    tourToInterviewDropoff: number;
    interviewToOfferDropoff: number;
    offerToEnrollmentDropoff: number;
  };
  getFunnelHealth: () => { score: number; status: 'excellent' | 'good' | 'warning' | 'critical' };
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DashboardData>(DEFAULT_DATA);

  const updateProgram = useCallback((program: Program, field: keyof ProgramData, value: number) => {
    setData(prev => ({
      ...prev,
      programs: {
        ...prev.programs,
        [program]: { ...prev.programs[program], [field]: value },
      },
    }));
  }, []);

  const updateMonthly = useCallback((index: number, program: MonthlyProgram, value: number | null) => {
    setData(prev => {
      const monthly = [...prev.monthly];
      monthly[index] = { ...monthly[index], [program]: value };
      return { ...prev, monthly };
    });
  }, []);

  const updateForecast = useCallback((index: number, field: keyof ForecastEntry, value: number | null) => {
    setData(prev => {
      const forecast = [...prev.forecast];
      forecast[index] = { ...forecast[index], [field]: value };
      return { ...prev, forecast };
    });
  }, []);

  const getTotals = useCallback((): ProgramData => {
    const programs = Object.values(data.programs);
    return {
      organicLeads: programs.reduce((s, p) => s + p.organicLeads, 0),
      paidLeads: programs.reduce((s, p) => s + p.paidLeads, 0),
      partnershipLeads: programs.reduce((s, p) => s + p.partnershipLeads, 0),
      targetLeads: programs.reduce((s, p) => s + p.targetLeads, 0),
      toursCompleted: programs.reduce((s, p) => s + p.toursCompleted, 0),
      targetTours: programs.reduce((s, p) => s + p.targetTours, 0),
      interviewsConducted: programs.reduce((s, p) => s + p.interviewsConducted, 0),
      targetInterviews: programs.reduce((s, p) => s + p.targetInterviews, 0),
      offersSent: programs.reduce((s, p) => s + p.offersSent, 0),
      targetOffers: programs.reduce((s, p) => s + p.targetOffers, 0),
      enrollmentsCompleted: programs.reduce((s, p) => s + p.enrollmentsCompleted, 0),
      targetEnrollments: programs.reduce((s, p) => s + p.targetEnrollments, 0),
    };
  }, [data.programs]);

  const getConversionRates = useCallback((program: Program) => {
    const p = data.programs[program];
    const totalLeads = p.organicLeads + p.paidLeads + p.partnershipLeads;
    const leadToTour = totalLeads > 0 ? (p.toursCompleted / totalLeads) * 100 : 0;
    const tourToInterview = p.toursCompleted > 0 ? (p.interviewsConducted / p.toursCompleted) * 100 : 0;
    const interviewToOffer = p.interviewsConducted > 0 ? (p.offersSent / p.interviewsConducted) * 100 : 0;
    const offerToEnrollment = p.offersSent > 0 ? (p.enrollmentsCompleted / p.offersSent) * 100 : 0;
    const overall = totalLeads > 0 ? (p.enrollmentsCompleted / totalLeads) * 100 : 0;
    return { leadToTour, tourToInterview, interviewToOffer, offerToEnrollment, overall };
  }, [data.programs]);

  const getDropoffs = useCallback((program: Program) => {
    const p = data.programs[program];
    const totalLeads = p.organicLeads + p.paidLeads + p.partnershipLeads;
    return {
      notProceedingToTour: totalLeads - p.toursCompleted,
      tourToInterviewDropoff: p.toursCompleted > 0 ? ((p.toursCompleted - p.interviewsConducted) / p.toursCompleted) * 100 : 0,
      interviewToOfferDropoff: p.interviewsConducted > 0 ? ((p.interviewsConducted - p.offersSent) / p.interviewsConducted) * 100 : 0,
      offerToEnrollmentDropoff: p.offersSent > 0 ? ((p.offersSent - p.enrollmentsCompleted) / p.offersSent) * 100 : 0,
    };
  }, [data.programs]);

  const getFunnelHealth = useCallback(() => {
    const totals = getTotals();
    const totalLeads = totals.organicLeads + totals.paidLeads + totals.partnershipLeads;
    const overall = totalLeads > 0 ? (totals.enrollmentsCompleted / totalLeads) * 100 : 0;
    const enrollmentVsTarget = totals.targetEnrollments > 0 ? (totals.enrollmentsCompleted / totals.targetEnrollments) * 100 : 0;
    const score = Math.round((overall + enrollmentVsTarget) / 2);
    const status: 'excellent' | 'good' | 'warning' | 'critical' = score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'warning' : 'critical';
    return { score, status };
  }, [getTotals]);

  return (
    <DashboardContext.Provider value={{
      data, updateProgram, updateMonthly, updateForecast,
      getTotals, getConversionRates, getDropoffs, getFunnelHealth,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used inside DashboardProvider');
  return ctx;
};
