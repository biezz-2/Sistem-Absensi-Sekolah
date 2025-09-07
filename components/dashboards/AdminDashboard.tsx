
import React, { useState, useEffect } from 'react';
import { User, UserRole, Class } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import { MOCK_USERS, MOCK_CLASSES } from '../../data/mock';
import AttendanceChart from '../shared/AttendanceChart';
import { UsersIcon, CheckSquareIcon, SchoolIcon, PencilIcon, MapPinIcon, XCircleIcon } from '../icons/Icons';
import { Button } from '../ui/Button';
import { useNotifier } from '../../hooks/useNotifier';

// --- Modal Component for editing class location ---
interface EditClassLocationModalProps {
  classData: Class;
  onUpdate: (classId: string, newLocation: { latitude: number; longitude: number }) => void;
  onClose: () => void;
}

const EditClassLocationModal: React.FC<EditClassLocationModalProps> = ({ classData, onUpdate, onClose }) => {
  const [latitude, setLatitude] = useState(classData.location.latitude.toString());
  const [longitude, setLongitude] = useState(classData.location.longitude.toString());
  const [error, setError] = useState('');

  useEffect(() => {
    setLatitude(classData.location.latitude.toString());
    setLongitude(classData.location.longitude.toString());
    setError('');
  }, [classData]);

  const handleSubmit = () => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      setError('Latitude dan Longitude harus berupa angka yang valid.');
      return;
    }
    if (lat < -90 || lat > 90) {
      setError('Latitude harus antara -90 dan 90.');
      return;
    }
    if (lon < -180 || lon > 180) {
      setError('Longitude harus antara -180 dan 180.');
      return;
    }

    onUpdate(classData.id, { latitude: lat, longitude: lon });
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-location-title"
    >
      <div 
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle id="edit-location-title">Edit Lokasi untuk {classData.name}</CardTitle>
                        <CardDescription>Perbarui koordinat untuk kelas.</CardDescription>
                    </div>
                     <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
                        <XCircleIcon className="h-6 w-6" />
                    </button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                 {error && <p className="text-red-500 text-sm">{error}</p>}
                <div>
                    <label htmlFor="latitude" className="block text-sm font-medium text-slate-700">Latitude</label>
                    <input
                        type="number"
                        id="latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="-6.200000"
                    />
                </div>
                <div>
                    <label htmlFor="longitude" className="block text-sm font-medium text-slate-700">Longitude</label>
                    <input
                        type="number"
                        id="longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="106.816666"
                    />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                    <Button variant="secondary" onClick={onClose}>Batal</Button>
                    <Button onClick={handleSubmit}>Simpan Perubahan</Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};


interface AdminDashboardProps {
  user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [classes, setClasses] = useState<Class[]>(MOCK_CLASSES);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const { addNotification } = useNotifier();

  const totalStudents = MOCK_USERS.filter(u => u.role === UserRole.STUDENT).length;
  const totalTeachers = MOCK_USERS.filter(u => u.role === UserRole.TEACHER).length;

  useEffect(() => {
    const timer = setTimeout(() => {
        addNotification(
            'Anomali terdeteksi: Tingkat kehadiran di Fisika Kuantum turun 15%.', 
            'warning'
        );
    }, 4000); // Trigger notification after 4 seconds

    return () => clearTimeout(timer);
  }, [addNotification]);


  const handleUpdateLocation = (classId: string, newLocation: { latitude: number; longitude: number }) => {
    setClasses(prevClasses => 
      prevClasses.map(c => 
        c.id === classId ? { ...c, location: newLocation } : c
      )
    );
    setEditingClass(null); // Close modal on successful update
    addNotification('Lokasi kelas berhasil diperbarui.', 'success');
  };

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-slate-800">Dasbor Admin</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
              <UsersIcon className="h-5 w-5 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-slate-500">Siswa terdaftar di sistem</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
              <SchoolIcon className="h-5 w-5 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTeachers}</div>
              <p className="text-xs text-slate-500">Guru aktif di sistem</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tingkat Kehadiran Rata-rata</CardTitle>
              <CheckSquareIcon className="h-5 w-5 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92.5%</div>
              <p className="text-xs text-slate-500">Di semua kelas minggu ini</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Analisis Kehadiran</CardTitle>
              <CardDescription>Tingkat kehadiran per mata kuliah selama sebulan terakhir.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                  <AttendanceChart />
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Manajemen Pengguna</CardTitle>
              <CardDescription>Lihat dan kelola semua pengguna dalam sistem.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-sm text-left text-slate-500">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                    <tr>
                      <th scope="col" className="px-2 sm:px-4 py-3">Nama</th>
                      <th scope="col" className="px-2 sm:px-4 py-3">Peran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_USERS.map((u) => (
                      <tr key={u.id} className="bg-white border-b hover:bg-slate-50">
                        <td className="px-2 sm:px-4 py-3 font-medium text-slate-900">{u.name}</td>
                        <td className="px-2 sm:px-4 py-3 capitalize">{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
               <div className="mt-4">
                  <Button className="w-full">Kelola Pengguna</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Manajemen Kelas</CardTitle>
                <CardDescription>Edit detail kelas yang ada, seperti lokasi yang diizinkan.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {classes.map(c => (
                        <div key={c.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-slate-50 border">
                            <div className="flex-grow">
                                <p className="font-semibold text-slate-800">{c.name}</p>
                                <div className="flex items-center space-x-2 text-sm text-slate-500 mt-1">
                                    <MapPinIcon className="h-4 w-4" />
                                    <span>Lat: {c.location.latitude.toFixed(4)}, Lon: {c.location.longitude.toFixed(4)}</span>
                                </div>
                            </div>
                            <Button variant="secondary" size="sm" onClick={() => setEditingClass(c)} className="w-full sm:w-auto flex-shrink-0">
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit Lokasi
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

      </div>
      
      {editingClass && (
        <EditClassLocationModal 
            classData={editingClass}
            onUpdate={handleUpdateLocation}
            onClose={() => setEditingClass(null)}
        />
      )}
    </>
  );
};

export default AdminDashboard;