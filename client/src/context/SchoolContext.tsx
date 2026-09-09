import React, { createContext, useContext, useState, useEffect } from 'react';
import { School, Campus, Program, Classroom, AcademicYear } from '../types/index.js';
import { api } from '../services/api.js';
import { useAuth } from './AuthContext.js';

interface SchoolContextType {
  school: School | null;
  campuses: Campus[];
  programs: Program[];
  classrooms: Classroom[];
  currentAcademicYear: AcademicYear | null;
  loading: boolean;
  refreshSchool: () => Promise<void>;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [school, setSchool] = useState<School | null>(null);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [currentAcademicYear, setCurrentAcademicYear] = useState<AcademicYear | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSchoolData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.getCurrentSchool();
      if (res.success && res.data) {
        setSchool(res.data.school);
        setCampuses(res.data.campuses || []);
        setPrograms(res.data.programs || []);
        setClassrooms(res.data.classrooms || []);
        setCurrentAcademicYear(res.data.current_academic_year || null);
      }
    } catch (err) {
      console.error('Failed to load school context data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolData();
  }, [user]);

  return (
    <SchoolContext.Provider
      value={{
        school,
        campuses,
        programs,
        classrooms,
        currentAcademicYear,
        loading,
        refreshSchool: fetchSchoolData,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const ctx = useContext(SchoolContext);
  if (!ctx) throw new Error('useSchool must be used within a SchoolProvider');
  return ctx;
};
