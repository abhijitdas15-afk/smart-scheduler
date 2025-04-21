import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { AppState } from '../store';
import { Classroom } from '@/types';

export interface ClassroomState {
  classrooms: Classroom[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadClassrooms: () => Promise<void>;
  addClassroom: (classroom: Omit<Classroom, 'id'>) => void;
  updateClassroom: (id: string, updates: Partial<Omit<Classroom, 'id'>>) => void;
  removeClassroom: (id: string) => void;
}

export const createClassroomSlice: StateCreator<
  AppState,
  [],
  [],
  ClassroomState
> = (set, get) => ({
  classrooms: [],
  isLoading: false,
  error: null,
  
  loadClassrooms: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // For now, we will use static data since there's no API integration
      // In the future, we would replace this with an API call
      const classrooms: Classroom[] = [
        {
          id: uuidv4(),
          name: 'Room 101',
          building: 'Main Building',
          floor: 1,
          capacity: 30,
          resources: ['Projector', 'Whiteboard']
        },
        {
          id: uuidv4(),
          name: 'Room 102',
          building: 'Main Building',
          floor: 1,
          capacity: 25,
          resources: ['Whiteboard']
        },
        {
          id: uuidv4(),
          name: 'Lab 201',
          building: 'Science Block',
          floor: 2,
          capacity: 20,
          resources: ['Computers', 'Projector', 'Whiteboard']
        }
      ];
      
      set({ classrooms, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load classrooms'
      });
    }
  },
  
  addClassroom: (classroom) => {
    const newClassroom: Classroom = {
      ...classroom,
      id: uuidv4()
    };
    
    set((state: AppState) => ({
      classrooms: [...state.classrooms, newClassroom]
    }));
  },
  
  updateClassroom: (id, updates) => {
    set((state: AppState) => ({
      classrooms: state.classrooms.map(classroom => 
        classroom.id === id ? { ...classroom, ...updates } : classroom
      )
    }));
  },
  
  removeClassroom: (id) => {
    set((state: AppState) => ({
      classrooms: state.classrooms.filter(classroom => classroom.id !== id)
    }));
  }
}); 