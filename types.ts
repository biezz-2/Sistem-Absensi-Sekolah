
export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  teacherId?: string;
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  studentIds: string[];
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface AttendanceSession {
  id: string; // This would be the UUID
  classId: string;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  sessionId: string;
  checkInTime: Date;
  status: 'present' | 'late' | 'absent';
}

// --- Notification System Types ---
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

// --- History View Type ---
export interface HistoryRecord {
  id: string;
  studentId: string;
  date: string;
  className: string;
  status: 'present' | 'late' | 'absent';
}
