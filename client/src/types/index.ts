export type UserRole = 
  | 'super_admin'
  | 'school_admin'
  | 'teacher'
  | 'parent'
  | 'finance'
  | 'admissions';

export interface User {
  id: string;
  school_id: string | null;
  role: UserRole;
  email: string;
  first_name: string;
  last_name: string;
  title?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  status?: string;
  permissions: string[];
}

export interface DemoAccount {
  id: string;
  email: string;
  role_id: UserRole;
  role_name: string;
  first_name: string;
  last_name: string;
  title: string;
  default_password: string;
}

export interface School {
  id: string;
  name: string;
  slug: string;
  code: string;
  tagline?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  currency?: string;
}

export interface Campus {
  id: string;
  school_id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  is_main: boolean;
}

export interface Program {
  id: string;
  name: string;
  slug: string;
  age_group_min_months: number;
  age_group_max_months: number;
  description?: string;
  color_code: string;
}

export interface Classroom {
  id: string;
  name: string;
  room_number?: string;
  capacity: number;
  program_name?: string;
  program_color?: string;
  campus_name?: string;
}

export interface AcademicYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface AuditLog {
  id: string;
  user_email?: string;
  action: string;
  entity_type: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  role_id?: string;
}
