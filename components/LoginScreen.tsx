
import React, { useState } from 'react';
import { MOCK_USERS } from '../data/mock';
import { Button } from './ui/Button';

interface LoginScreenProps {
  onLogin: (userId: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(MOCK_USERS[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      onLogin(selectedUserId);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 p-4">
      <div className="w-full max-w-md p-4 sm:p-8 space-y-6 bg-white rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sistem Absensi QR</h1>
          <p className="mt-2 text-sm text-gray-600">Silakan masuk untuk melanjutkan</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="user-select" className="sr-only">Pilih Pengguna</label>
              <select
                id="user-select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              >
                {MOCK_USERS.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Button type="submit" className="w-full">
              Masuk
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
