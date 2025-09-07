
import React from 'react';
import { User } from '../types';
import { Button } from './ui/Button';
import { LogOutIcon, UserCircleIcon } from './icons/Icons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m7-5h4m0 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m7 5h4m0 0v-4m0 4l-5-5" />
            </svg>
            <h1 className="text-xl font-bold text-primary-700">Absensi QR</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-right">
              <p className="font-semibold text-slate-800 truncate max-w-[120px] md:max-w-none">{user.name}</p>
              <p className="hidden md:block text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
            <UserCircleIcon className="h-10 w-10 text-slate-400 flex-shrink-0" />
            <Button onClick={onLogout} variant="secondary" size="sm">
              <LogOutIcon className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
