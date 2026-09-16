-- Early Years School Management Platform - PostgreSQL Database Schema
-- Phase 1 & Phase 2 Schema (Transport & Finance omitted per user requirement)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. ORGANIZATIONS / SCHOOLS & CAMPUSES
-- ============================================================================

CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    logo_url TEXT,
    tagline VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Ethiopia',
    phone VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'Africa/Addis_Ababa',
    currency VARCHAR(10) DEFAULT 'ETB',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    is_main BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, code)
);

CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g., '2026 - 2027'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- Infant, Toddler, Nursery, KG1, KG2
    slug VARCHAR(100) NOT NULL,
    age_group_min_months INT NOT NULL,
    age_group_max_months INT NOT NULL,
    description TEXT,
    color_code VARCHAR(30) DEFAULT '#4A6B53',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, slug)
);

CREATE TABLE IF NOT EXISTS classrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    campus_id UUID REFERENCES campuses(id) ON DELETE SET NULL,
    program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL, -- Sunshine, Rainbow, Butterfly, Little Explorers
    room_number VARCHAR(50),
    capacity INT NOT NULL DEFAULT 20,
    color_accent VARCHAR(30) DEFAULT '#E8EFE9',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. ROLES & PERMISSIONS (RBAC)
-- ============================================================================

CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY, -- 'super_admin', 'school_admin', 'teacher', 'parent', 'admissions'
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(100) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

-- ============================================================================
-- 3. USERS & AUTHENTICATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    title VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'suspended'
    last_login_at TIMESTAMPTZ,
    reset_token VARCHAR(255),
    reset_token_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    user_agent TEXT,
    ip_address VARCHAR(45),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. PHASE 2: PARENTS & GUARDIANS
-- ============================================================================

CREATE TABLE IF NOT EXISTS parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- optional link to portal user
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    alt_phone VARCHAR(50),
    address TEXT,
    occupation VARCHAR(100),
    employer VARCHAR(100),
    portal_pin VARCHAR(20) DEFAULT '1234',
    portal_code VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- ============================================================================
-- 5. PHASE 2: CHILDREN (Central Entity of Platform)
-- ============================================================================

CREATE TABLE IF NOT EXISTS children (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
    classroom_id UUID REFERENCES classrooms(id) ON DELETE SET NULL,
    
    -- Basic Information (#7)
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    preferred_name VARCHAR(100),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL, -- 'Male', 'Female', 'Other'
    photo_url TEXT,
    admission_number VARCHAR(50) UNIQUE,
    admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    enrollment_status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'graduated', 'withdrawn'
    
    -- Care & Health Information (#7)
    allergies TEXT[] DEFAULT '{}',
    dietary_restrictions TEXT[] DEFAULT '{}',
    food_preferences TEXT,
    medical_notes TEXT,
    medication_instructions TEXT,
    nap_preferences TEXT,
    toilet_training_status VARCHAR(50) DEFAULT 'in_training', -- 'diapers', 'in_training', 'trained'
    other_care_instructions TEXT,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- Child <-> Parent/Guardian Relationship Mapping (#7)
CREATE TABLE IF NOT EXISTS child_guardians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    relationship VARCHAR(50) NOT NULL, -- 'Mother', 'Father', 'Grandparent', 'Guardian', 'Aunt', 'Uncle'
    is_primary BOOLEAN DEFAULT false,
    is_emergency_contact BOOLEAN DEFAULT true,
    emergency_priority INT DEFAULT 1,
    pickup_authorized BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(child_id, parent_id)
);

-- Authorized Pickups Security (#7 & #14)
CREATE TABLE IF NOT EXISTS authorized_pickups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    photo_url TEXT,
    id_card_number VARCHAR(100),
    authorization_status VARCHAR(50) DEFAULT 'approved', -- 'approved', 'revoked', 'temporary'
    notes TEXT,
    security_pin VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. AUDIT LOGGING
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 7. INDEXES FOR PERFORMANCE & AUDITING
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_schools_slug ON schools(slug);
CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_children_school_id ON children(school_id);
CREATE INDEX IF NOT EXISTS idx_children_classroom_id ON children(classroom_id);
CREATE INDEX IF NOT EXISTS idx_children_program_id ON children(program_id);
CREATE INDEX IF NOT EXISTS idx_children_status ON children(enrollment_status);
CREATE INDEX IF NOT EXISTS idx_parents_school_id ON parents(school_id);
CREATE INDEX IF NOT EXISTS idx_parents_user_id ON parents(user_id);
CREATE INDEX IF NOT EXISTS idx_child_guardians_child_id ON child_guardians(child_id);
CREATE INDEX IF NOT EXISTS idx_child_guardians_parent_id ON child_guardians(parent_id);
CREATE INDEX IF NOT EXISTS idx_authorized_pickups_child_id ON authorized_pickups(child_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_school_id ON audit_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Automatic updated_at triggers
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_children_updated_at ON children;
CREATE TRIGGER trg_children_updated_at BEFORE UPDATE ON children FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_parents_updated_at ON parents;
CREATE TRIGGER trg_parents_updated_at BEFORE UPDATE ON parents FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_authorized_pickups_updated_at ON authorized_pickups;
CREATE TRIGGER trg_authorized_pickups_updated_at BEFORE UPDATE ON authorized_pickups FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- 8. SIMPLIFIED EARLY YEARS TABLES
-- ============================================================================

-- Attendance & Arrival / Drop-off & Pickup
CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'present', -- 'present', 'absent', 'late', 'excused'
    arrival_time VARCHAR(20),
    dropped_off_by VARCHAR(150),
    dropped_off_relationship VARCHAR(100),
    departure_time VARCHAR(20),
    picked_up_by VARCHAR(150),
    picked_up_relationship VARCHAR(100),
    pickup_authorized BOOLEAN DEFAULT true,
    staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(child_id, date)
);

-- Meaningful Developmental Observations
CREATE TABLE IF NOT EXISTS development_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    area VARCHAR(100) NOT NULL, -- 'Cognitive', 'Language & Communication', 'Social & Emotional', 'Physical', 'Creative', 'Early Literacy'
    skill VARCHAR(150),
    observation TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'developing', -- 'emerging', 'developing', 'achieved'
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Monthly Progress Reports (Parent-Facing)
CREATE TABLE IF NOT EXISTS monthly_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    month VARCHAR(20) NOT NULL, -- 'September'
    year INT NOT NULL, -- 2026
    attendance_summary JSONB DEFAULT '{"present": 20, "absent": 2, "late": 1}'::jsonb,
    development_progress JSONB DEFAULT '{"cognitive": "Developing", "language": "Developing", "social_emotional": "Achieved", "physical": "Developing", "creative": "Achieved", "early_literacy": "Developing"}'::jsonb,
    teacher_summary TEXT,
    highlights TEXT[] DEFAULT '{}',
    status VARCHAR(30) DEFAULT 'published', -- 'draft', 'published'
    published_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(child_id, month, year)
);

-- Simplified Activities
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    classroom_id UUID REFERENCES classrooms(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    development_areas TEXT[] DEFAULT '{}',
    notes TEXT,
    photos TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Health & Safety: Incidents
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time VARCHAR(20),
    location VARCHAR(150) NOT NULL DEFAULT 'Playground',
    description TEXT NOT NULL,
    action_taken TEXT NOT NULL,
    parent_notified BOOLEAN DEFAULT true,
    staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attendance_child_date ON attendance_records(child_id, date);
CREATE INDEX IF NOT EXISTS idx_observations_child ON development_observations(child_id);
CREATE INDEX IF NOT EXISTS idx_monthly_reports_child ON monthly_reports(child_id, month, year);
CREATE INDEX IF NOT EXISTS idx_incidents_child ON incidents(child_id);
