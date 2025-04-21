import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { 
  Assignment, 
  Conflict,
  Schedule,
  ScheduleStats,
  TimeSlot,
  Day
} from '@/types';

export interface ScheduleState {
  // State
  currentSchedule: Schedule | null;
  savedSchedules: Schedule[];
  timeSlots: TimeSlot[];
  isGenerating: boolean;
  error: string | null;
  
  // Actions
  setCurrentSchedule: (schedule: Schedule) => void;
  addAssignment: (assignment: Assignment) => void;
  removeAssignment: (assignmentId: string) => void;
  updateAssignment: (assignmentId: string, updates: Partial<Assignment>) => void;
  generateSchedule: () => Promise<void>;
  saveSchedule: (name: string, description?: string) => Promise<void>;
  loadSchedule: (scheduleId: string) => Promise<void>;
  publishSchedule: (scheduleId: string) => Promise<void>;
}

export const createScheduleSlice: StateCreator<
  ScheduleState,
  [],
  [],
  ScheduleState
> = (set, get) => ({
  // Initial state
  currentSchedule: null,
  savedSchedules: [],
  timeSlots: generateDefaultTimeSlots(),
  isGenerating: false,
  error: null,
  
  // Set the current working schedule
  setCurrentSchedule: (schedule) => {
    set({ currentSchedule: schedule });
  },
  
  // Add a new assignment to the current schedule
  addAssignment: (assignment) => {
    const currentSchedule = get().currentSchedule;
    
    if (!currentSchedule) {
      // Create a new schedule if none exists
      const newSchedule: Schedule = {
        id: generateId(),
        name: 'New Schedule',
        assignments: [assignment],
        conflicts: detectConflicts([assignment]),
        stats: calculateStats([assignment]),
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: false
      };
      
      set({ currentSchedule: newSchedule });
    } else {
      // Add to existing schedule
      const updatedAssignments = [...currentSchedule.assignments, assignment];
      const updatedSchedule = {
        ...currentSchedule,
        assignments: updatedAssignments,
        conflicts: detectConflicts(updatedAssignments),
        stats: calculateStats(updatedAssignments),
        updatedAt: new Date()
      };
      
      set({ currentSchedule: updatedSchedule });
    }
  },
  
  // Remove an assignment from the current schedule
  removeAssignment: (assignmentId) => {
    const currentSchedule = get().currentSchedule;
    
    if (!currentSchedule) return;
    
    const updatedAssignments = currentSchedule.assignments.filter(
      a => a.id !== assignmentId
    );
    
    const updatedSchedule = {
      ...currentSchedule,
      assignments: updatedAssignments,
      conflicts: detectConflicts(updatedAssignments),
      stats: calculateStats(updatedAssignments),
      updatedAt: new Date()
    };
    
    set({ currentSchedule: updatedSchedule });
  },
  
  // Update an existing assignment
  updateAssignment: (assignmentId, updates) => {
    const currentSchedule = get().currentSchedule;
    
    if (!currentSchedule) return;
    
    const updatedAssignments = currentSchedule.assignments.map(a => 
      a.id === assignmentId ? { ...a, ...updates } : a
    );
    
    const updatedSchedule = {
      ...currentSchedule,
      assignments: updatedAssignments,
      conflicts: detectConflicts(updatedAssignments),
      stats: calculateStats(updatedAssignments),
      updatedAt: new Date()
    };
    
    set({ currentSchedule: updatedSchedule });
  },
  
  // Generate a new schedule based on constraints
  generateSchedule: async () => {
    set({ isGenerating: true, error: null });
    
    try {
      // This would call our scheduler algorithm service
      // For now, we'll just create a sample schedule
      const assignments = createSampleAssignments();
      
      const newSchedule: Schedule = {
        id: generateId(),
        name: 'Generated Schedule',
        assignments,
        conflicts: detectConflicts(assignments),
        stats: calculateStats(assignments),
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: false
      };
      
      set({ 
        currentSchedule: newSchedule,
        isGenerating: false
      });
    } catch (error) {
      set({ 
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Failed to generate schedule'
      });
    }
  },
  
  // Save the current schedule
  saveSchedule: async (name, description) => {
    const currentSchedule = get().currentSchedule;
    
    if (!currentSchedule) return;
    
    const savedSchedule = {
      ...currentSchedule,
      name,
      description,
      updatedAt: new Date()
    };
    
    // In a real app, we would save to an API here
    
    set(state => ({
      savedSchedules: [...state.savedSchedules, savedSchedule]
    }));
  },
  
  // Load a saved schedule
  loadSchedule: async (scheduleId) => {
    try {
      const savedSchedules = get().savedSchedules;
      const scheduleToLoad = savedSchedules.find(s => s.id === scheduleId);
      
      if (scheduleToLoad) {
        set({ currentSchedule: scheduleToLoad });
      } else {
        // In a real app, we would fetch from an API
        set({ error: 'Schedule not found' });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load schedule'
      });
    }
  },
  
  // Publish a schedule (make it official)
  publishSchedule: async (scheduleId) => {
    try {
      const currentSchedule = get().currentSchedule;
      
      if (!currentSchedule || currentSchedule.id !== scheduleId) {
        set({ error: 'Invalid schedule selected for publishing' });
        return;
      }
      
      // Check for conflicts
      if (currentSchedule.conflicts.length > 0) {
        set({ error: 'Cannot publish schedule with conflicts' });
        return;
      }
      
      const publishedSchedule = {
        ...currentSchedule,
        isPublished: true,
        updatedAt: new Date()
      };
      
      // In a real app, we would save to an API here
      
      set({ 
        currentSchedule: publishedSchedule,
        savedSchedules: get().savedSchedules.map(s => 
          s.id === scheduleId ? publishedSchedule : s
        )
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to publish schedule'
      });
    }
  }
});

// Helper functions

// Generate a unique ID
function generateId(): string {
  return uuidv4();
}

// Create sample time slots (Monday-Friday, 8 AM to 6 PM)
function generateDefaultTimeSlots(): TimeSlot[] {
  const days: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const slots: TimeSlot[] = [];
  
  for (const day of days) {
    // 8 AM to 6 PM in 1-hour slots
    for (let hour = 8; hour < 18; hour++) {
      const startHour = hour < 10 ? `0${hour}` : `${hour}`;
      const endHour = (hour + 1) < 10 ? `0${hour + 1}` : `${hour + 1}`;
      
      slots.push({
        id: `${day}-${startHour}00`,
        day,
        startTime: `${startHour}:00`,
        endTime: `${endHour}:00`
      });
    }
  }
  
  return slots;
}

// Detect conflicts in a set of assignments
function detectConflicts(assignments: Assignment[]): Conflict[] {
  const conflicts: Conflict[] = [];
  
  // Check for faculty double bookings
  const facultyBookings: Record<string, Record<string, Assignment[]>> = {};
  
  for (const assignment of assignments) {
    if (!facultyBookings[assignment.facultyId]) {
      facultyBookings[assignment.facultyId] = {};
    }
    
    if (!facultyBookings[assignment.facultyId][assignment.day]) {
      facultyBookings[assignment.facultyId][assignment.day] = [];
    }
    
    facultyBookings[assignment.facultyId][assignment.day].push(assignment);
  }
  
  // Check each faculty's bookings for overlaps
  for (const facultyId in facultyBookings) {
    for (const day in facultyBookings[facultyId]) {
      const dayBookings = facultyBookings[facultyId][day];
      
      if (dayBookings.length > 1) {
        // Sort by start time
        dayBookings.sort((a, b) => a.startTime.localeCompare(b.startTime));
        
        // Check for overlaps
        for (let i = 0; i < dayBookings.length - 1; i++) {
          const current = dayBookings[i];
          const next = dayBookings[i + 1];
          
          if (current.endTime > next.startTime) {
            conflicts.push({
              type: 'FacultyDoubleBooking',
              message: `Faculty ${current.facultyName || facultyId} is double-booked on ${day}`,
              assignments: [current, next],
              severity: 'High'
            });
          }
        }
      }
    }
  }
  
  // Similar checks would be done for classroom double bookings
  
  return conflicts;
}

// Calculate statistics for a schedule
function calculateStats(assignments: Assignment[]): ScheduleStats {
  // Faculty utilization (hours per faculty)
  const facultyHours: Record<string, number> = {};
  
  // Room utilization (hours per room)
  const roomHours: Record<string, number> = {};
  
  // Calculate hours for each assignment
  for (const assignment of assignments) {
    const startParts = assignment.startTime.split(':').map(Number);
    const endParts = assignment.endTime.split(':').map(Number);
    
    const startMinutes = startParts[0] * 60 + startParts[1];
    const endMinutes = endParts[0] * 60 + endParts[1];
    
    const durationHours = (endMinutes - startMinutes) / 60;
    
    // Add to faculty hours
    if (!facultyHours[assignment.facultyId]) {
      facultyHours[assignment.facultyId] = 0;
    }
    facultyHours[assignment.facultyId] += durationHours;
    
    // Add to room hours
    if (!roomHours[assignment.classroomId]) {
      roomHours[assignment.classroomId] = 0;
    }
    roomHours[assignment.classroomId] += durationHours;
  }
  
  // Convert to utilization percentages (simplified for this example)
  const facultyUtilization: Record<string, number> = {};
  for (const facultyId in facultyHours) {
    facultyUtilization[facultyId] = Math.min(100, (facultyHours[facultyId] / 40) * 100);
  }
  
  const roomUtilization: Record<string, number> = {};
  for (const roomId in roomHours) {
    roomUtilization[roomId] = Math.min(100, (roomHours[roomId] / 50) * 100);
  }
  
  return {
    totalAssignments: assignments.length,
    totalConflicts: 0, // This would be set based on conflicts detection
    facultyUtilization,
    roomUtilization,
    unassignedHours: 0 // This would be calculated based on required vs. assigned hours
  };
}

// Create sample assignments for demo purposes
function createSampleAssignments(): Assignment[] {
  return [
    {
      id: '1',
      facultyId: 'faculty1',
      subjectId: 'subject1',
      classroomId: 'classroom1',
      timeSlotId: 'Monday-0900',
      day: 'Monday',
      startTime: '09:00',
      endTime: '11:00',
      facultyName: 'Dr. Smith',
      subjectName: 'Introduction to Programming',
      classroomName: 'Room 101'
    },
    {
      id: '2',
      facultyId: 'faculty2',
      subjectId: 'subject2',
      classroomId: 'classroom2',
      timeSlotId: 'Monday-1100',
      day: 'Monday',
      startTime: '11:00',
      endTime: '13:00',
      facultyName: 'Dr. Johnson',
      subjectName: 'Database Management',
      classroomName: 'Room 102'
    },
    {
      id: '3',
      facultyId: 'faculty1',
      subjectId: 'subject3',
      classroomId: 'classroom1',
      timeSlotId: 'Tuesday-0900',
      day: 'Tuesday',
      startTime: '09:00',
      endTime: '11:00',
      facultyName: 'Dr. Smith',
      subjectName: 'Algorithms',
      classroomName: 'Room 101'
    }
  ];
} 