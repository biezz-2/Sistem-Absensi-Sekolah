
import { User, Class, UserRole, HistoryRecord } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Budi Hartono', email: 'budi@sekolah.id', role: UserRole.STUDENT, studentId: 'S001' },
  { id: 'user-2', name: 'Citra Lestari', email: 'citra@sekolah.id', role: UserRole.STUDENT, studentId: 'S002' },
  { id: 'user-3', name: 'Dewi Anggraini', email: 'dewi@sekolah.id', role: UserRole.STUDENT, studentId: 'S003' },
  { id: 'user-4', name: 'Eko Prasetyo', email: 'eko@sekolah.id', role: UserRole.STUDENT, studentId: 'S004' },
  { id: 'user-5', name: 'Dr. Indah Permata', email: 'indah@sekolah.id', role: UserRole.TEACHER, teacherId: 'T01' },
  { id: 'user-6', name: 'Prof. Bambang Wijoyo', email: 'bambang@sekolah.id', role: UserRole.TEACHER, teacherId: 'T02' },
  { id: 'user-7', name: 'Kepala Sekolah', email: 'admin@sekolah.id', role: UserRole.ADMIN },
];

export const MOCK_CLASSES: Class[] = [
  { 
    id: 'class-1', 
    name: 'Matematika Lanjutan', 
    teacherId: 'user-5', 
    studentIds: ['user-1', 'user-2', 'user-3'],
    location: { latitude: -6.200000, longitude: 106.816666 } // Jakarta
  },
  { 
    id: 'class-2', 
    name: 'Fisika Kuantum', 
    teacherId: 'user-6', 
    studentIds: ['user-2', 'user-3', 'user-4'],
    location: { latitude: -6.200000, longitude: 106.816666 } // Jakarta
  },
  { 
    id: 'class-3', 
    name: 'Sejarah Dunia', 
    teacherId: 'user-5', 
    studentIds: ['user-1', 'user-4'],
    location: { latitude: -6.200000, longitude: 106.816666 } // Jakarta
  }
];

export const MOCK_ATTENDANCE_HISTORY: HistoryRecord[] = [
    { id: 'rec-1', studentId: 'user-1', date: '2024-07-20', className: 'Matematika Lanjutan', status: 'present' },
    { id: 'rec-2', studentId: 'user-2', date: '2024-07-21', className: 'Fisika Kuantum', status: 'present' },
    { id: 'rec-3', studentId: 'user-1', date: '2024-07-22', className: 'Matematika Lanjutan', status: 'absent' },
    { id: 'rec-4', studentId: 'user-3', date: '2024-07-23', className: 'Fisika Kuantum', status: 'present' },
    { id: 'rec-5', studentId: 'user-4', date: '2024-07-24', className: 'Sejarah Dunia', status: 'late' },
];
