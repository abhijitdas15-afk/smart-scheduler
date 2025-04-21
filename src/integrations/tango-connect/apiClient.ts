import axios from 'axios';
import { Faculty, Subject } from '@/types';

/**
 * API client for connecting to the Subject-tango-connect application
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_TANGO_CONNECT_API_URL || '/api',
  withCredentials: true // For sharing authentication cookies
});

/**
 * Intercept requests to add auth token if available
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from Clerk if available
    const token = localStorage.getItem('__clerk_client_jwt');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Fetch all faculty from the parent application
 */
export const fetchFaculty = async (): Promise<Faculty[]> => {
  try {
    const response = await apiClient.get('/faculty');
    
    // Transform the data to match our Faculty type
    return response.data.map((faculty: any) => ({
      id: faculty.id,
      name: faculty.name || `${faculty.firstName} ${faculty.lastName}`,
      email: faculty.email || faculty.primaryEmailAddress,
      subjects: faculty.assignedSubjects || [],
      maxHoursPerDay: 8, // Default values, can be customized later
      maxHoursPerWeek: 40,
      availability: [] // This would need to be set up in our app
    }));
  } catch (error) {
    console.error('Error fetching faculty:', error);
    throw error;
  }
};

/**
 * Fetch all subjects from the parent application
 */
export const fetchSubjects = async (): Promise<Subject[]> => {
  try {
    const response = await apiClient.get('/subjects');
    
    // Transform the data to match our Subject type
    return response.data.map((subject: any) => ({
      id: subject.id,
      name: subject.name,
      description: subject.description || '',
      totalHours: subject.totalTime || 0,
      sessionsPerWeek: Math.ceil((subject.totalTime || 0) / 2), // Estimate based on total hours
      sessionDuration: 120, // Default 2-hour sessions
      preferredClassroomIds: [],
      allowConsecutive: true
    }));
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
};

/**
 * Fetch a specific subject's details
 */
export const fetchSubjectDetails = async (subjectId: string): Promise<Subject> => {
  try {
    const response = await apiClient.get(`/subjects/${subjectId}`);
    
    return {
      id: response.data.id,
      name: response.data.name,
      description: response.data.description || '',
      totalHours: response.data.totalTime || 0,
      sessionsPerWeek: Math.ceil((response.data.totalTime || 0) / 2),
      sessionDuration: 120,
      preferredClassroomIds: [],
      allowConsecutive: true
    };
  } catch (error) {
    console.error(`Error fetching subject ${subjectId}:`, error);
    throw error;
  }
};

export default apiClient; 