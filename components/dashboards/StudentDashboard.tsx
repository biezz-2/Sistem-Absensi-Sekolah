
import React, { useState, useCallback, useMemo } from 'react';
import { User, HistoryRecord } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import QrScanner from '../shared/QrScanner';
import { CheckCircleIcon, ClockIcon, QrCodeIcon, XCircleIcon } from '../icons/Icons';
import { useGeolocation } from '../../hooks/useGeolocation';
import Spinner from '../ui/Spinner';
import { useNotifier } from '../../hooks/useNotifier';

interface StudentDashboardProps {
  user: User;
  onCheckIn: (sessionId: string, studentId: string) => { success: boolean; message: string };
  attendanceHistory: HistoryRecord[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onCheckIn, attendanceHistory }) => {
  const [isScanning, setIsScanning] = useState(false);
  const { location, error: locationError, getLocation } = useGeolocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotifier();

  const userHistory = useMemo(() => 
    attendanceHistory.filter(rec => rec.studentId === user.id)
  , [attendanceHistory, user.id]);

  const handleScanSuccess = useCallback(async (decodedText: string) => {
    setIsScanning(false);
    setIsSubmitting(true);
    
    await getLocation(); // We can get location while "submitting"

    // Simulate network delay for a better UX
    setTimeout(() => {
        console.log('Submitting attendance for session:', decodedText, 'at location:', location);
        if (locationError) {
             addNotification(`Gagal mendapatkan lokasi: ${locationError}`, 'error');
             setIsSubmitting(false);
             return;
        }
        
        // This is the actual check-in logic against the central state
        const result = onCheckIn(decodedText, user.id);

        if (result.success) {
            addNotification(result.message, 'success');
        } else {
            addNotification(result.message, 'warning');
        }

        setIsSubmitting(false);
    }, 1000);
  }, [getLocation, location, locationError, addNotification, onCheckIn, user.id]);
  
  const handleScanError = useCallback((errorMessage: string) => {
    console.error(errorMessage);
    addNotification('Gagal memindai QR code. Coba lagi.', 'error');
  }, [addNotification]);

  const getStatusIcon = (status: string) => {
    switch(status) {
        case 'present': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
        case 'late': return <ClockIcon className="h-5 w-5 text-yellow-500" />;
        case 'absent': return <XCircleIcon className="h-5 w-5 text-red-500" />;
        default: return null;
    }
  };

  const handleStartScan = () => {
    setIsSubmitting(false);
    setIsScanning(true);
  }

  return (
    <div className="space-y-6">
       <h2 className="text-3xl font-bold text-slate-800">Dasbor Siswa</h2>
       
      {!isScanning && (
        <Card>
          <CardHeader>
            <CardTitle>Absensi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
             {isSubmitting ? (
                <div className="flex flex-col items-center space-y-4 p-8">
                    <Spinner />
                    <p className="text-slate-600">Mengirim data absensi...</p>
                </div>
            ) : (
              <>
                <p className="text-slate-600">Siap untuk kelas? Klik tombol di bawah untuk melakukan absensi.</p>
                <Button size="lg" onClick={handleStartScan}>
                  <QrCodeIcon className="h-5 w-5 mr-2" />
                  Pindai Kode QR
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {isScanning && (
        <Card>
          <CardHeader>
            <CardTitle>Pindai Kode QR Kelas</CardTitle>
          </CardHeader>
          <CardContent>
            <QrScanner
              onScanSuccess={handleScanSuccess}
              onScanError={handleScanError}
            />
            <div className="text-center mt-4">
                <Button variant="secondary" onClick={() => setIsScanning(false)}>Batal</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Absensi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                  <th scope="col" className="px-3 py-3 sm:px-6">Tanggal</th>
                  <th scope="col" className="px-3 py-3 sm:px-6">Mata Kuliah</th>
                  <th scope="col" className="px-3 py-3 sm:px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {userHistory.length > 0 ? (
                  userHistory.map((record) => (
                    <tr key={record.id} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-3 py-4 sm:px-6 font-medium text-slate-900 whitespace-nowrap">{record.date}</td>
                      <td className="px-3 py-4 sm:px-6">{record.className}</td>
                      <td className="px-3 py-4 sm:px-6">
                          <div className="flex items-center space-x-2">
                              {getStatusIcon(record.status)}
                              <span className="capitalize">{record.status === 'present' ? 'Hadir' : (record.status === 'late' ? 'Terlambat' : 'Tidak Hadir')}</span>
                          </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-slate-500">
                      Belum ada riwayat absensi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
