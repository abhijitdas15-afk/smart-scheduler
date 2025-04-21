import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { AppState } from '../store';
import { Subject } from '@/types';
import { fetchSubjects, fetchSubjectDetails } from '@/integrations/tango-connect/apiClient';

export interface SubjectState {
  subjects: Subject[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadSubjects: () => Promise<void>;
  loadSubjectDetails: (subjectId: string) => Promise<Subject | null>;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<Omit<Subject, 'id'>>) => void;
  removeSubject: (id: string) => void;
}

export const createSubjectSlice: StateCreator<
  AppState,
  [],
  [],
  SubjectState
> = (set, get) => ({
  subjects: [],
  isLoading: false,
  error: null,
  
  loadSubjects: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const subjects = await fetchSubjects();
      set({ subjects, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load subjects'
      });
    }
  },
  
  loadSubjectDetails: async (subjectId) => {
    try {
      const subject = await fetchSubjectDetails(subjectId);
      
      // Update the subject in the store if it exists
      set((state) => ({
        subjects: state.subjects.map(s => 
          s.id === subjectId ? { ...s, ...subject } : s
        )
      }));
      
      return subject;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : `Failed to load details for subject ${subjectId}`
      });
      return null;
    }
  },
  
  addSubject: (subject) => {
    const newSubject: Subject = {
      ...subject,
      id: uuidv4()
    };
    
    set((state) => ({
      subjects: [...state.subjects, newSubject]
    }));
  },
  
  updateSubject: (id, updates) => {
    set((state) => ({
      subjects: state.subjects.map(subject => 
        subject.id === id ? { ...subject, ...updates } : subject
      )
    }));
  },
  
  removeSubject: (id) => {
    set((state) => ({
      subjects: state.subjects.filter(subject => subject.id !== id)
    }));
  }
}); 