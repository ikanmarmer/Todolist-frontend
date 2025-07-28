import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthController from "../controllers/AuthController";
import Swal from 'sweetalert2';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [avatarPreview, setAvatarPreview] = useState(null);

  // Tailwind classes
  const activeClass = 'flex items-center gap-3 px-4 py-2 rounded-lg mb-2 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-bold rounded-lg transition-all duration-30 transform hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg border border-teal-500 hover:border-teal-400';
  const baseClass = 'flex items-center gap-3 px-4 py-2 rounded-lg mb-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg border border-teal-500 hover:border-teal-400';

  // Auth state
  const { logout, user, refreshUserStatus } = AuthController();

  useEffect(() => {
    // Initialize auth state from localStorage on component mount
    AuthController.getState().initializeAuth();
    
    // Refresh user status to get latest data including avatar
    refreshUserStatus();
  }, [refreshUserStatus]);

  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
    } else {
      setAvatarPreview(null);
    }
  }, [user]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Apakah kamu yakin?',
      text: "Kamu akan logout dari akun ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Logout!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await logout();
        navigate('/');
        Swal.fire({
          icon: 'success',
          title: 'Berhasil Logout',
          text: 'Anda berhasil logout',
        });
      } catch (err) {
        console.error('Logout error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Logout',
          text: 'Silakan coba lagi',
        });
      }
    }
  };

  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    e.target.src = "/src/assets/profile-default.png";
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-br from-cyan-500 to-teal-600 p-2 shadow-inner text-black flex flex-col justify-between z-50 transition-transform duration-300 overflow-y-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } xl:translate-x-0`}
    >
      {/* Custom scrollbar styles */}
      <style>
        {`
          .sidebar-scroll::-webkit-scrollbar {
            width: 8px;
          }
          .sidebar-scroll::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
          }
          .sidebar-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.4);
          }
          .sidebar-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
        `}
      </style>

      <div className="flex flex-col h-full overflow-y-auto sidebar-scroll">
        <div className="text-black">
          {/* Mobile close button */}
          <div className="flex justify-end xl:hidden p-4">
            <button onClick={onClose} className="text-white text-xl">
              ✕
            </button>
          </div>

          {/* Profile */}
          <div className="flex flex-col items-center px-4 mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-black-400 mb-2 bg-gray-200 flex items-center justify-center">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="object-cover w-full h-full"
                  onError={handleImageError}
                  onLoad={() => console.log('Avatar loaded successfully:', avatarPreview)}
                />
              ) : (
                <img
                  src="/src/assets/profile-default.png"
                  alt="Default Profile"
                  className="object-cover w-full h-full"
                  onError={handleImageError}
                />
              )}
            </div>         
            <p className="text-black font-medium text-sm">
              Hallo, {user?.name || 'Guest'}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="px-4">
            <Link
              to="/dashboard"
              className={
                location.pathname === '/dashboard' ? activeClass : baseClass
              }
            >
              <i className="fa-solid fa-gauge-high text-lg"></i> Dashboard
            </Link>

            <Link
              to="/todo-list"
              className={
                location.pathname === '/todo-list' ||
                location.pathname.startsWith('/todo-list-detail')
                  ? activeClass
                  : baseClass
              }
            >
              <i className="fa-solid fa-list-check text-lg"></i> Todo List
            </Link>

            <Link
              to="/profile"
              className={
                location.pathname === '/profile' ? activeClass : baseClass
              }
            >
              <i className="fa-solid fa-user text-lg"></i> Profile
            </Link>

            <Link
              to="/setting"
              className={
                location.pathname === '/setting' ? activeClass : baseClass
              }
            >
              <i className="fa-solid fa-sliders text-lg"></i> Setting
            </Link>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="px-4 pb-6 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 
                hover:from-teal-700 hover:to-cyan-800 text-white 
                font-bold py-3 px-6 rounded-lg transition-all duration-300 
                transform hover:scale-105 hover:shadow-xl active:scale-95 
                shadow-lg border border-teal-500 hover:border-teal-400"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
          </button>
        </div>
      </div>
    </div>
  );
}