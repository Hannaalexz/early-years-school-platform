import { Response } from 'express';
import { z } from 'zod';
import { ChildrenService } from '../services/children.service.js';
import { AuthRequest } from '../types/index.js';

export const createChildSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, 'Last name is required'),
  preferred_name: z.string().optional(),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  photo_url: z.string().optional(),
  admission_number: z.string().optional(),
  admission_date: z.string().optional(),
  program_id: z.string().optional(),
  classroom_id: z.string().optional(),
  enrollment_status: z.enum(['active', 'inactive', 'graduated', 'withdrawn']).optional(),
  allergies: z.array(z.string()).optional(),
  dietary_restrictions: z.array(z.string()).optional(),
  food_preferences: z.string().optional(),
  medical_notes: z.string().optional(),
  medication_instructions: z.string().optional(),
  nap_preferences: z.string().optional(),
  toilet_training_status: z.enum(['diapers', 'in_training', 'trained']).optional(),
  other_care_instructions: z.string().optional(),
});

export const addPickupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  phone: z.string().min(1, 'Phone is required'),
  photo_url: z.string().optional(),
  id_card_number: z.string().optional(),
  notes: z.string().optional(),
  security_pin: z.string().optional(),
});

export class ChildrenController {
  static async listChildren(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;

      // If logged in as parent, return only their own children (#56 Security)
      if (user.role === 'parent') {
        const myChildren = await ChildrenService.getParentChildren(user.id);
        res.status(200).json({ success: true, data: myChildren });
        return;
      }

      const { classroom_id, program_id, status, search, has_allergy, limit, offset } = req.query;

      const children = await ChildrenService.listChildren({
        school_id: user.school_id,
        classroom_id: classroom_id as string,
        program_id: program_id as string,
        status: status as string,
        search: search as string,
        has_allergy: has_allergy === 'true',
        limit: limit ? parseInt(limit as string, 10) : 100,
        offset: offset ? parseInt(offset as string, 10) : 0,
      });

      res.status(200).json({ success: true, data: children });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'FETCH_CHILDREN_FAILED', message: error.message });
    }
  }

  static async getChild(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const childId = req.params.id as string;

      // Check parent isolation (#56 Security: Users cannot access unauthorized children)
      if (user.role === 'parent') {
        const allowed = await ChildrenService.checkParentAccessToChild(user.id, childId);
        if (!allowed) {
          res.status(403).json({
            success: false,
            error: 'FORBIDDEN_CHILD_ACCESS',
            message: 'Access denied. You can only access records for your own children.',
          });
          return;
        }
      }

      const child = await ChildrenService.getChildById(childId);
      if (!child) {
        res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Child record not found' });
        return;
      }

      // Check tenant isolation
      if (user.role !== 'super_admin' && child.school_id !== user.school_id) {
        res.status(403).json({ success: false, error: 'TENANT_MISMATCH', message: 'Unauthorized school access' });
        return;
      }

      res.status(200).json({ success: true, data: child });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'FETCH_CHILD_FAILED', message: error.message });
    }
  }

  static async createChild(req: AuthRequest, res: Response): Promise<void> {
    try {
      const school_id = req.user?.school_id;
      if (!school_id) {
        res.status(400).json({ success: false, error: 'NO_SCHOOL', message: 'School context required' });
        return;
      }

      const newChild = await ChildrenService.createChild(
        { ...req.body, school_id },
        req.user?.id
      );

      res.status(201).json({
        success: true,
        message: 'Child registered successfully',
        data: newChild,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: 'CREATE_CHILD_FAILED', message: error.message });
    }
  }

  static async updateChild(req: AuthRequest, res: Response): Promise<void> {
    try {
      const childId = req.params.id as string;
      const updated = await ChildrenService.updateChild(childId, req.body, req.user?.id);

      res.status(200).json({
        success: true,
        message: 'Child profile updated successfully',
        data: updated,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: 'UPDATE_CHILD_FAILED', message: error.message });
    }
  }

  static async addAuthorizedPickup(req: AuthRequest, res: Response): Promise<void> {
    try {
      const childId = req.params.id as string;
      const pickup = await ChildrenService.addAuthorizedPickup(childId, req.body, req.user?.id);

      res.status(201).json({
        success: true,
        message: 'Authorized pickup successfully registered',
        data: pickup,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: 'ADD_PICKUP_FAILED', message: error.message });
    }
  }

  static async updatePickupStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const pickupId = req.params.pickupId as string;
      const { status } = req.body;

      const updated = await ChildrenService.updatePickupStatus(pickupId, status, req.user?.id);

      res.status(200).json({
        success: true,
        message: `Pickup status set to ${status}`,
        data: updated,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: 'UPDATE_STATUS_FAILED', message: error.message });
    }
  }

  static async listParents(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { search } = req.query;
      const parents = await ChildrenService.listParents({
        school_id: req.user?.school_id,
        search: search as string,
      });

      res.status(200).json({ success: true, data: parents });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'FETCH_PARENTS_FAILED', message: error.message });
    }
  }

  static async getMyChildren(req: AuthRequest, res: Response): Promise<void> {
    try {
      const children = await ChildrenService.getParentChildren(req.user!.id);
      res.status(200).json({ success: true, data: children });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'FETCH_MY_CHILDREN_FAILED', message: error.message });
    }
  }
}
