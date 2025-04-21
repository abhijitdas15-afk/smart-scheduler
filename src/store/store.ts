import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { createScheduleSlice, ScheduleState } from './slices/scheduleSlice';
import { createConstraintSlice, ConstraintState } from './slices/constraintSlice';
import { createFacultySlice, FacultyState } from './slices/facultySlice';
import { createSubjectSlice, SubjectState } from './slices/subjectSlice';
import { createClassroomSlice, ClassroomState } from './slices/classroomSlice';

// Define the overall app state type
export type AppState = ScheduleState & 
  ConstraintState &
  FacultyState &
  SubjectState &
  ClassroomState;

// Create the store with all slices
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (...a) => ({
        // Combine all the slices
        ...createScheduleSlice(...a),
        
        // The following slices will be implemented later
        ...createConstraintSlice(...a),
        ...createFacultySlice(...a),
        ...createSubjectSlice(...a),
        ...createClassroomSlice(...a),
      }),
      {
        name: 'smart-scheduler-storage',
        // Only persist specific parts of the state
        partialize: (state) => ({
          savedSchedules: state.savedSchedules,
          constraints: state.constraints,
          faculties: state.faculties,
          subjects: state.subjects,
          classrooms: state.classrooms,
        }),
      }
    )
  )
);

// Export type helpers for accessing specific slices
export type ScheduleStore = Pick<AppState, keyof ScheduleState>;
export type ConstraintStore = Pick<AppState, keyof ConstraintState>;
export type FacultyStore = Pick<AppState, keyof FacultyState>;
export type SubjectStore = Pick<AppState, keyof SubjectState>;
export type ClassroomStore = Pick<AppState, keyof ClassroomState>; 