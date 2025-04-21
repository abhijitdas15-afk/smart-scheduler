import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { AppState } from '../store';

// Types
export interface Constraint {
  id: string;
  name: string;
  description: string;
  type: 'faculty' | 'classroom' | 'subject' | 'time';
  priority: 'low' | 'medium' | 'high' | 'critical';
  entityId?: string; // ID of faculty, classroom, or subject this constraint applies to
  timeRestriction?: {
    days?: string[];
    startTime?: string;
    endTime?: string;
  };
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConstraintState {
  constraints: Constraint[];
  
  // Actions
  addConstraint: (constraint: Omit<Constraint, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateConstraint: (id: string, updates: Partial<Omit<Constraint, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  removeConstraint: (id: string) => void;
  toggleConstraint: (id: string) => void;
  getConstraintsForEntity: (entityType: Constraint['type'], entityId?: string) => Constraint[];
}

export const createConstraintSlice: StateCreator<
  AppState,
  [],
  [],
  ConstraintState
> = (set, get) => ({
  constraints: [],
  
  addConstraint: (constraintData) => {
    const newConstraint: Constraint = {
      ...constraintData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set((state: AppState) => ({
      constraints: [...state.constraints, newConstraint]
    }));
  },
  
  updateConstraint: (id, updates) => {
    set((state: AppState) => ({
      constraints: state.constraints.map((constraint: Constraint) => 
        constraint.id === id 
          ? { 
              ...constraint, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } 
          : constraint
      )
    }));
  },
  
  removeConstraint: (id) => {
    set((state: AppState) => ({
      constraints: state.constraints.filter((constraint: Constraint) => constraint.id !== id)
    }));
  },
  
  toggleConstraint: (id) => {
    set((state: AppState) => ({
      constraints: state.constraints.map((constraint: Constraint) => 
        constraint.id === id 
          ? { ...constraint, enabled: !constraint.enabled, updatedAt: new Date().toISOString() } 
          : constraint
      )
    }));
  },
  
  getConstraintsForEntity: (entityType, entityId) => {
    const { constraints } = get();
    return constraints.filter((constraint: Constraint) => {
      // Filter by type
      if (constraint.type !== entityType) return false;
      
      // If entityId is provided, filter by that too
      if (entityId && constraint.entityId && constraint.entityId !== entityId) return false;
      
      // If entityId is undefined, then return constraints that apply to all entities of this type
      if (entityId && !constraint.entityId) return true;
      
      return true;
    });
  }
}); 