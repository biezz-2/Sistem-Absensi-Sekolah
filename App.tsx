
import React, { useState, useCallback, useMemo } from 'react';
import { User, UserRole, AttendanceSession, HistoryRecord } from './types';
import LoginScreen from './components/LoginScreen';
import StudentDashboard from './components/dashboards/StudentDashboard';
import TeacherDashboard from './components/dashboards/TeacherDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import Header from './components/Header';
import { MOCK_USERS, MOCK_CLASSES, MOCK_ATTENDANCE_HISTORY } from './data/mock';
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationContainer from './components/shared/NotificationContainer';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // --- Centralized State for Attendance ---
  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null);
  const [checkedInStudents, setCheckedInStudents] = useState<string[]>([]);
  const [attendanceHistory, setAttendanceHistory] = useState<HistoryRecord[]>(MOCK_ATTENDANCE_HISTORY);


  const handleLogin = useCallback((userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setActiveSession(null); // Clear session on logout
    setCheckedInStudents([]);
  }, []);

  // --- Attendance Handlers ---
  const handleStartSession = useCallback((classId: string, duration: number) => {
    const newSession: AttendanceSession = {
      id: `session-${Date.now()}-${Math.random()}`,
      classId: classId,
      startTime: new Date(),
      endTime: new Date(Date.now() + duration * 60 * 1000),
      isActive: true,
    };
    setActiveSession(newSession);
    setCheckedInStudents([]); // Reset check-ins for new session
  }, []);

  const handleStopSession = useCallback(() => {
    setActiveSession(null);
    // In a real app, you might archive the session data here.
  }, []);

  const handleStudentCheckIn = useCallback((sessionId: string, studentId: string): { success: boolean; message: string } => {
    if (!activeSession || !activeSession.isActive) {
      return { success: false, message: 'Tidak ada sesi absensi yang aktif.' };
    }
    if (activeSession.id !== sessionId) {
      return { success: false, message: 'Kode QR tidak valid untuk sesi ini.' };
    }
    if (new Date() > new Date(activeSession.endTime)) {
      handleStopSession(); // End session if time is up
      return { success: false, message: 'Waktu absensi untuk sesi ini telah berakhir.' };
    }
    if (checkedInStudents.includes(studentId)) {
      return { success: false, message: 'Anda sudah tercatat hadir untuk sesi ini.' };
    }

    setCheckedInStudents(prev => [...prev, studentId]);

    // Add to attendance history database
    const classInfo = MOCK_CLASSES.find(c => c.id === activeSession.classId);
    if (classInfo) {
      const newRecord: HistoryRecord = {
        id: `rec-${Date.now()}`,
        studentId: studentId,
        date: new Date().toISOString().split('T')[0],
        className: classInfo.name,
        // Mark as late if checking in 2 minutes after session start
        status: new Date() > new Date(activeSession.startTime.getTime() + 2 * 60 * 1000) ? 'late' : 'present',
      };
      setAttendanceHistory(prev => [newRecord, ...prev]);
    }

    return { success: true, message: 'Absensi berhasil dicatat!' };
  }, [activeSession, checkedInStudents, handleStopSession]);


  const DashboardComponent = useMemo(() => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case UserRole.STUDENT:
        return (
          <StudentDashboard 
            user={currentUser} 
            onCheckIn={handleStudentCheckIn} 
            attendanceHistory={attendanceHistory} 
          />
        );
      case UserRole.TEACHER:
        return (
          <TeacherDashboard 
            user={currentUser} 
            activeSession={activeSession}
            checkedInStudents={checkedInStudents}
            onStartSession={handleStartSession}
            onStopSession={handleStopSession}
          />
        );
      case UserRole.ADMIN:
        return <AdminDashboard user={currentUser} />;
      default:
        return null;
    }
  }, [currentUser, activeSession, checkedInStudents, handleStartSession, handleStopSession, handleStudentCheckIn, attendanceHistory]);

  return (
    <NotificationProvider>
      <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
        {currentUser ? (
          <>
            <Header user={currentUser} onLogout={handleLogout} />
            <main className="p-4 md:p-6">
              {DashboardComponent}
            </main>
          </>
        ) : (
          <LoginScreen onLogin={handleLogin} />
        )}
      </div>
      <NotificationContainer />
    </NotificationProvider>
  );
};

export default App;
