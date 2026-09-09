export type Gender = 'Male' | 'Female' | 'Other';
export type EnrollmentStatus = 'active' | 'inactive' | 'graduated' | 'withdrawn';
export type ToiletTrainingStatus = 'diapers' | 'in_training' | 'trained';
export type PickupAuthorizationStatus = 'approved' | 'revoked' | 'temporary';

export interface Child {
  id: string;
  school_id: string;
  program_id: string | null;
  classroom_id: string | null;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  preferred_name?: string | null;
  date_of_birth: string;
  gender: Gender;
  photo_url?: string | null;
  admission_number?: string | null;
  admission_date: string;
  enrollment_status: EnrollmentStatus;

  // Care & Health Info
  allergies: string[];
  dietary_restrictions: string[];
  food_preferences?: string | null;
  medical_notes?: string | null;
  medication_instructions?: string | null;
  nap_preferences?: string | null;
  toilet_training_status: ToiletTrainingStatus;
  other_care_instructions?: string | null;

  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface Parent {
  id: string;
  school_id: string;
  user_id?: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  alt_phone?: string | null;
  address?: string | null;
  occupation?: string | null;
  employer?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ChildGuardian {
  id: string;
  child_id: string;
  parent_id: string;
  relationship: string;
  is_primary: boolean;
  is_emergency_contact: boolean;
  emergency_priority: number;
  pickup_authorized: boolean;
  // Joined fields
  parent_first_name?: string;
  parent_last_name?: string;
  parent_email?: string;
  parent_phone?: string;
  parent_address?: string;
}

export interface AuthorizedPickup {
  id: string;
  child_id: string;
  name: string;
  relationship: string;
  phone: string;
  photo_url?: string | null;
  id_card_number?: string | null;
  authorization_status: PickupAuthorizationStatus;
  notes?: string | null;
  security_pin?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ChildProfileDTO extends Child {
  program_name?: string;
  program_slug?: string;
  program_color?: string;
  classroom_name?: string;
  classroom_room_number?: string;
  guardians: ChildGuardian[];
  authorized_pickups: AuthorizedPickup[];
  calculated_age: {
    years: number;
    months: number;
    formatted: string;
  };
}
