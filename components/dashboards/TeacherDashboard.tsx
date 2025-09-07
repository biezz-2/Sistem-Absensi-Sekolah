
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import QRCode from 'react-qr-code';
import { User, AttendanceSession } from '../../types';
import { MOCK_CLASSES, MOCK_USERS } from '../../data/mock';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import Spinner from '../ui/Spinner';
import { CheckCircleIcon, UserIcon, QrCodeIcon, ClockIcon } from '../icons/Icons';
import { useNotifier } from '../../hooks/useNotifier';

interface TeacherDashboardProps {
  user: User;
  activeSession: AttendanceSession | null;
  checkedInStudents: string[];
  onStartSession: (classId: string, duration: number) => void;
  onStopSession: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, activeSession, checkedInStudents, onStartSession, onStopSession }) => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionDuration, setSessionDuration] = useState<number>(15); // in minutes
  const [remainingTime, setRemainingTime] = useState<number | null>(null); // in seconds
  const { addNotification } = useNotifier();
  
  const teacherClasses = useMemo(() => MOCK_CLASSES.filter(c => c.teacherId === user.id), [user.id]);
  const selectedClass = useMemo(() => MOCK_CLASSES.find(c => c.id === (activeSession?.classId || selectedClassId)), [activeSession, selectedClassId]);
  const studentsInClass = useMemo(() => MOCK_USERS.filter(u => selectedClass?.studentIds.includes(u.id)), [selectedClass]);

  const stopSession = useCallback(() => {
    onStopSession();
    addNotification(`Sesi untuk ${selectedClass?.name} telah berakhir.`, 'info');
  }, [addNotification, onStopSession, selectedClass?.name]);


  const startSession = () => {
    if (!selectedClassId) return;
    setIsLoading(true);
    // Simulate API call to create a session
    setTimeout(() => {
      onStartSession(selectedClassId, sessionDuration);
      setIsLoading(false);
    }, 1500);
  };
  
  // Reset selected class when session ends from another component (e.g. logout)
  useEffect(() => {
    if (!activeSession) {
        setSelectedClassId(null);
    }
  }, [activeSession]);

  // Countdown timer effect
  useEffect(() => {
    if (!activeSession) {
      setRemainingTime(null);
      return;
    }

    const calculateRemaining = () => {
      const now = new Date().getTime();
      const end = new Date(activeSession.endTime).getTime();
      const secondsLeft = Math.round((end - now) / 1000);

      if (secondsLeft < 0) {
        // Use a small buffer to prevent race conditions
        if (activeSession.isActive) {
           stopSession();
        }
        return 0;
      }
      return secondsLeft;
    };

    setRemainingTime(calculateRemaining());

    const timer = setInterval(() => {
        setRemainingTime(calculateRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSession, stopSession]);

  // Notify teacher when a student checks in
  const lastCheckedInStudentId = useMemo(() => checkedInStudents[checkedInStudents.length - 1], [checkedInStudents]);
  useEffect(() => {
      if(lastCheckedInStudentId){
          const student = MOCK_USERS.find(u => u.id === lastCheckedInStudentId);
          if(student) {
              addNotification(`${student.name} telah hadir.`, 'success');
          }
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastCheckedInStudentId]); // Only run when the last student changes
  
  
  const formatTime = (seconds: number): string => {
    if (seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-800">Dasbor Guru</h2>
      
      {!activeSession ? (
        <Card>
          <CardHeader>
            <CardTitle>Mulai Sesi Absensi</CardTitle>
            <CardDescription>Pilih kelas dan durasi untuk memulai sesi absensi.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
                <select
                  value={selectedClassId || ''}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full p-2 border rounded-md bg-white text-sm"
                  disabled={isLoading}
                >
                  <option value="" disabled>Pilih Kelas</option>
                  {teacherClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(Number(e.target.value))}
                  className="w-full p-2 border rounded-md bg-white text-sm"
                  disabled={isLoading}
                >
                  <option value={1}>1 Menit</option>
                  <option value={5}>5 Menit</option>
                  <option value={10}>10 Menit</option>
                  <option value={15}>15 Menit</option>
                </select>
            </div>
            <Button onClick={startSession} disabled={!selectedClassId || isLoading} className="w-full">
              {isLoading ? <><Spinner /> Memulai...</> : 'Mulai Sesi'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Kode QR Aktif</span>
                <QrCodeIcon className="h-6 w-6 text-primary-600" />
              </CardTitle>
              <CardDescription>Untuk kelas: {selectedClass?.name}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-white rounded-lg border w-full max-w-[160px] mx-auto">
                <QRCode value={activeSession.id} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
              </div>
              
              {remainingTime !== null && (
                <div className="text-center p-3 rounded-lg w-full bg-slate-50 border">
                    <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 mb-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>Sesi Berakhir Dalam</span>
                    </div>
                    <p className="text-4xl font-bold text-primary-700 tracking-tight">
                        {formatTime(remainingTime)}
                    </p>
                </div>
              )}

              <p className="text-xs text-slate-500 text-center -mt-2">Siswa dapat memindai kode ini untuk mencatat kehadiran.</p>
              <Button onClick={stopSession} variant="destructive">Hentikan Sesi</Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Monitor Absensi Real-time</CardTitle>
              <CardDescription>
                {checkedInStudents.length} dari {studentsInClass.length} siswa telah hadir.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {studentsInClass.map(student => {
                  const isCheckedIn = checkedInStudents.includes(student.id);
                  return (
                    <div key={student.id} className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${isCheckedIn ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'}`}>
                      <div className="flex items-center space-x-3">
                        <UserIcon className="h-5 w-5" />
                        <span className="font-medium">{student.name}</span>
                      </div>
                      {isCheckedIn ? (
                        <div className="flex items-center space-x-2 text-sm">
                          <CheckCircleIcon className="h-5 w-5" />
                          <span>Hadir</span>
                        </div>
                      ) : (
                        <span className="text-sm">Belum Hadir</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
