import { useState, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppStore } from '@/store/store';
import { Assignment, Faculty, Subject, Classroom, Day } from '@/types';

interface NewAssignmentFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

/**
 * Form component for creating a new class assignment test this change
 */
export default function NewAssignmentForm({ onCancel, onSuccess }: NewAssignmentFormProps) {
  const { addAssignment } = useAppStore(state => ({
    addAssignment: state.addAssignment
  }));
  
  const [faculties, subjects, classrooms] = useAppStore(state => [
    state.faculties,
    state.subjects,
    state.classrooms
  ]);
  
  const [formData, setFormData] = useState({
    facultyId: '',
    subjectId: '',
    classroomId: '',
    day: 'Monday' as Day,
    startTime: '09:00',
    endTime: '11:00'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Generate a unique ID using UUID
    const assignmentId = uuidv4();
    
    // Create new assignment with UUID
    const newAssignment: Assignment = {
      id: assignmentId,
      facultyId: formData.facultyId,
      subjectId: formData.subjectId,
      classroomId: formData.classroomId,
      timeSlotId: `${formData.day}-${formData.startTime.replace(':', '')}`,
      day: formData.day,
      startTime: formData.startTime,
      endTime: formData.endTime,
      // Add denormalized fields for convenience
      facultyName: faculties.find(f => f.id === formData.facultyId)?.name,
      subjectName: subjects.find(s => s.id === formData.subjectId)?.name,
      classroomName: classrooms.find(c => c.id === formData.classroomId)?.name
    };
    
    // Add assignment to store
    addAssignment(newAssignment);
    
    // Call success callback
    onSuccess();
  };
  
  const days: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create New Assignment</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Faculty Selection */}
          <div>
            <label htmlFor="facultyId" className="form-label">Faculty</label>
            <select 
              id="facultyId"
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select a faculty</option>
              {faculties.map(faculty => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Subject Selection */}
          <div>
            <label htmlFor="subjectId" className="form-label">Subject</label>
            <select 
              id="subjectId"
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select a subject</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Classroom Selection */}
          <div>
            <label htmlFor="classroomId" className="form-label">Classroom</label>
            <select 
              id="classroomId"
              name="classroomId"
              value={formData.classroomId}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select a classroom</option>
              {classrooms.map(classroom => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name} ({classroom.building})
                </option>
              ))}
            </select>
          </div>
          
          {/* Day Selection */}
          <div>
            <label htmlFor="day" className="form-label">Day</label>
            <select 
              id="day"
              name="day"
              value={formData.day}
              onChange={handleChange}
              className="form-input"
              required
            >
              {days.map(day => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          
          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="form-label">Start Time</label>
              <input 
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label htmlFor="endTime" className="form-label">End Time</label>
              <input 
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <button 
              type="button" 
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
            >
              Create Assignment
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 
