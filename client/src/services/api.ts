import { User, DemoAccount, School, Campus, Program, Classroom, AuditLog } from '../types/index.js';

const API_BASE = '/api';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('ey_auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await res.json();

      if (res.status === 401) {
        if (endpoint !== '/auth/login') {
          localStorage.removeItem('ey_auth_token');
          localStorage.removeItem('ey_auth_user');
          window.dispatchEvent(new Event('auth_logout'));
        }
      }

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'REQUEST_FAILED',
          message: data.message || `Request failed with status ${res.status}`,
        };
      }

      return data;
    } catch (err: any) {
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: err.message || 'Network communication error',
      };
    }
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request<User>('/auth/me');
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getDemoAccounts() {
    return this.request<DemoAccount[]>('/auth/demo-accounts');
  }

  // Users
  async getUsers(params: { role?: string; status?: string; search?: string } = {}) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<any[]>(`/users${query ? `?${query}` : ''}`);
  }

  async createUser(userData: any) {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended') {
    return this.request<{ id: string; status: string }>(`/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteUser(userId: string) {
    return this.request(`/users/${userId}`, { method: 'DELETE' });
  }

  // Phase 2: Children & Parents API
  async getChildren(params: { classroom_id?: string; program_id?: string; status?: string; search?: string; has_allergy?: boolean } = {}) {
    const queryObj: Record<string, string> = {};
    if (params.classroom_id) queryObj.classroom_id = params.classroom_id;
    if (params.program_id) queryObj.program_id = params.program_id;
    if (params.status) queryObj.status = params.status;
    if (params.search) queryObj.search = params.search;
    if (params.has_allergy) queryObj.has_allergy = 'true';

    const query = new URLSearchParams(queryObj).toString();
    return this.request<any[]>(`/children${query ? `?${query}` : ''}`);
  }

  async getChild(childId: string) {
    return this.request<any>(`/children/${childId}`);
  }

  async createChild(childData: any) {
    return this.request<any>('/children', {
      method: 'POST',
      body: JSON.stringify(childData),
    });
  }

  async updateChild(childId: string, data: any) {
    return this.request<any>(`/children/${childId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async addAuthorizedPickup(childId: string, data: any) {
    return this.request<any>(`/children/${childId}/authorized-pickups`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePickupStatus(childId: string, pickupId: string, status: 'approved' | 'revoked') {
    return this.request<any>(`/children/${childId}/authorized-pickups/${pickupId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getParents(params: { search?: string } = {}) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<any[]>(`/parents${query ? `?${query}` : ''}`);
  }

  async getMyChildren() {
    return this.request<any[]>('/children/my');
  }

  // School & Organization
  async getCurrentSchool() {
    return this.request<{
      school: School;
      campuses: Campus[];
      programs: Program[];
      classrooms: Classroom[];
      current_academic_year: any;
    }>('/schools/current');
  }

  async updateSchool(data: Partial<School>) {
    return this.request<School>('/schools/current', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getPrograms() {
    return this.request<Program[]>('/schools/programs');
  }

  async getClassrooms() {
    return this.request<Classroom[]>('/schools/classrooms');
  }

  // Dashboard
  async getDashboardStats() {
    return this.request<any>('/dashboard/stats');
  }

  async getAuditLogs() {
    return this.request<AuditLog[]>('/dashboard/audit-logs');
  }

  // Roles & Permissions
  async getRolesAndPermissions() {
    return this.request<{
      roles: any[];
      permissions: any[];
      role_permissions: any[];
    }>('/roles');
  }

  // Parent Portal
  async portalLogin(identifier: string, pin: string) {
    const res = await fetch(`${API_BASE}/portal/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, pin }),
    });
    const data = await res.json();
    if (data.success && data.data?.token) {
      localStorage.setItem('ey_portal_token', data.data.token);
      localStorage.setItem('ey_portal_parent', JSON.stringify(data.data.parent));
      localStorage.setItem('ey_portal_school', JSON.stringify(data.data.school));
    }
    return data;
  }

  private getPortalToken(): string | null {
    return localStorage.getItem('ey_portal_token');
  }

  private async portalRequest<T>(endpoint: string): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
    const token = this.getPortalToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    try {
      const res = await fetch(`${API_BASE}/portal${endpoint}`, { headers });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  async getPortalMe() {
    return this.portalRequest<{ parent: any }>('/me');
  }

  async getPortalChildren() {
    return this.portalRequest<any[]>('/children');
  }

  async getPortalChildSummary(childId: string) {
    return this.portalRequest<any>(`/children/${childId}`);
  }

  portalLogout() {
    localStorage.removeItem('ey_portal_token');
    localStorage.removeItem('ey_portal_parent');
    localStorage.removeItem('ey_portal_school');
  }
}

export const api = new ApiClient();
