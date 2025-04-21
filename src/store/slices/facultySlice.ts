import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { AppState } from '../store';
import { Faculty, Availability, Preference } from '@/types';
import { fetchFaculty } from '@/integrations/tango-connect/apiClient';

export interface FacultyState {
  faculties: Faculty[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadFaculties: () => Promise<void>;
  addFaculty: (faculty: Omit<Faculty, 'id'>) => void;
  updateFaculty: (id: string, updates: Partial<Omit<Faculty, 'id'>>) => void;
  removeFaculty: (id: string) => void;
  addAvailability: (facultyId: string, availability: Omit<Availability, 'id'>) => void;
  removeAvailability: (facultyId: string, availabilityIndex: number) => void;
  addPreference: (facultyId: string, preference: Preference) => void;
  removePreference: (facultyId: string, subjectId: string) => void;
}

export const createFacultySlice: StateCreator<
  AppState,
  [],
  [],
  FacultyState
> = (set, get) => ({
  faculties: [],
  isLoading: false,
  error: null,
  
  loadFaculties: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const faculties = await fetchFaculty();
      set({ faculties, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load faculties'
      });
    }
  },
  
  addFaculty: (faculty) => {
    const newFaculty: Faculty = {
      ...faculty,
      id: uuidv4()
    };
    
    set((state: AppState) => ({
      faculties: [...state.faculties, newFaculty]
    }));
  },
  
  updateFaculty: (id, updates) => {
    set((state: AppState) => ({
      faculties: state.faculties.map(faculty => 
        faculty.id === id ? { ...faculty, ...updates } : faculty
      )
    }));
  },
  
  removeFaculty: (id) => {
    set((state: AppState) => ({
      faculties: state.faculties.filter(faculty => faculty.id !== id)
    }));
  },
  
  addAvailability: (facultyId, availability) => {
    set((state: AppState) => ({
      faculties: state.faculties.map(faculty => 
        faculty.id === facultyId 
          ? { 
              ...faculty, 
              availability: [...faculty.availability, availability] 
            } 
          : faculty
      )
    }));
  },
  
  removeAvailability: (facultyId, availabilityIndex) => {
    set((state: AppState) => ({
      faculties: state.faculties.map(faculty => 
        faculty.id === facultyId 
          ? { 
              ...faculty, 
              availability: faculty.availability.filter((_, index) => index !== availabilityIndex) 
            } 
          : faculty
      )
    }));
  },
  
  addPreference: (facultyId, preference) => {
    // Assuming Faculty has a preferences array
    set((state: AppState) => ({
      faculties: state.faculties.map(faculty => 
        faculty.id === facultyId 
          ? { 
              ...faculty, 
              preferences: [...(faculty.preferences || []), preference] 
            } 
          : faculty
      )
    }));
  },
  
  removePreference: (facultyId, subjectId) => {
    set((state: AppState) => ({
      faculties: state.faculties.map(faculty => 
        faculty.id === facultyId 
          ? { 
              ...faculty, 
              preferences: (faculty.preferences || []).filter(pref => pref.subjectId !== subjectId) 
            } 
          : faculty
      )
    }));
  }
}); 