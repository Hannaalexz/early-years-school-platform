import { Request } from 'express';

export type UserRole = 
  | 'super_admin'
  | 'school_admin'
  | 'teacher'
  | 'parent'
  | 'finance'
  | 'admissions';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  school_id: string | null;
  role_id: UserRole;
  email: string;
  password_hash?: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  title?: string | null;
  status: UserStatus;
  last_login_at?: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  school_id: string | null;
  first_name: string;
  last_name: string;
  permissions: string[];
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export interface School {
  id: string;
  name: string;
  slug: string;
  code: string;
  logo_url?: string | null;
  tagline?: string | null;
  address?: string | null;
  city?: string | null;
  country: string;
  phone?: string | null;
  email: string;
  website?: string | null;
  timezone: string;
  currency: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Campus {
  id: string;
  school_id: string;
  name: string;
  code: string;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  is_main: boolean;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface Program {
  id: string;
  school_id: string;
  name: string;
  slug: string;
  age_group_min_months: number;
  age_group_max_months: number;
  description?: string | null;
  color_code: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface Classroom {
  id: string;
  school_id: string;
  campus_id?: string | null;
  program_id?: string | null;
  name: string;
  room_number?: string | null;
  capacity: number;
  color_accent: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuditLogEntry {
  id: string;
  school_id?: string | null;
  user_id?: string | null;
  user_email?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  old_values?: any;
  new_values?: any;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: Record<string, any>;
}
