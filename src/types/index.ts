// Day of the week type
export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

// Time slot interface
export interface TimeSlot {
  id: string;
  day: Day;
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
}

// Faculty interface
export interface Faculty {
  id: string;
  name: string;
  email?: string;
  subjects: string[]; // IDs of subjects they can teach
  maxHoursPerDay: number;
  maxHoursPerWeek: number;
  availability: Availability[];
}

// Faculty availability
export interface Availability {
  day: Day;
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
}

// Faculty teaching preference
export interface Preference {
  subjectId: string;
  priority: number; // 1-5, with 5 being highest priority
}

// Subject interface
export interface Subject {
  id: string;
  name: string;
  description?: string;
  totalHours: number;
  sessionsPerWeek: number;
  sessionDuration: number; // in minutes
  preferredClassroomIds: string[]; // IDs of preferred classrooms
  allowConsecutive: boolean;
}

// Classroom interface
export interface Classroom {
  id: string;
  name: string;
  building?: string;
  floor?: number;
  capacity: number;
  resources: string[]; // Equipment available
}

// Assignment interface (a scheduled class)
export interface Assignment {
  id: string;
  facultyId: string;
  subjectId: string;
  classroomId: string;
  timeSlotId: string;
  day: Day;
  startTime: string;
  endTime: string;
  facultyName?: string; // Denormalized for convenience
  subjectName?: string; // Denormalized for convenience
  classroomName?: string; // Denormalized for convenience
}

// Constraint interface
export interface Constraint {
  id: string;
  type: ConstraintType;
  value: any; // This will vary based on constraint type
  priority: ConstraintPriority; // Hard or soft constraint
  description?: string;
}

// Constraint type enum
export type ConstraintType = 
  | 'FacultyUnavailable' 
  | 'SubjectPreferredTime' 
  | 'RoomRestriction'
  | 'MinimumBreakTime'
  | 'MaxConsecutiveClasses'
  | 'PreferredDayPattern';

// Constraint priority
export type ConstraintPriority = 'Hard' | 'Soft';

// Conflict in scheduling
export interface Conflict {
  type: string;
  message: string;
  assignments: Assignment[];
  severity: 'High' | 'Medium' | 'Low';
}

// Schedule statistics
export interface ScheduleStats {
  totalAssignments: number;
  totalConflicts: number;
  facultyUtilization: Record<string, number>; // Faculty ID to utilization percentage
  roomUtilization: Record<string, number>; // Room ID to utilization percentage
  unassignedHours: number;
}

// Complete schedule
export interface Schedule {
  id: string;
  name: string;
  description?: string;
  assignments: Assignment[];
  conflicts: Conflict[];
  stats: ScheduleStats;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
}

// API response type
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
} 