import React, { useState } from 'react';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../store/authSlice';

import DashboardHome from '../components/Dashboard/DashboardHome';
import Calendar from '../components/Dashboard/SmallCalendar';
import Setting from '../components/Dashboard/Setting';
import CreateDoctor from '../components/Dashboard/CreatDoctor';
import Blogs from './Bloges';
import DoctorDash from '../components/Dashboard/DoctorDash';

import Dashboard_svg from '../assets/svg/index';
import doctor_images from '../assets/doctor_images';
import { Button } from '@headlessui/react';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const authStatus = useSelector((state) => state.auth.isAuthenticated);

  const navigationItems = [
    { icon: Dashboard_svg.Dashboard_Svg, path: 'home', name: 'Dashboard' },
    { icon: Dashboard_svg.Calendar_Svg, path: 'calendar', name: 'Calendar' },
    { icon: Dashboard_svg.Message_Svg, path: 'message', name: 'Bloges' },
    ...(authStatus
      ? [{ icon: Dashboard_svg.Doctor_Svg, path: 'doctors', name: 'Doctors' }]
      : []),
    { icon: Dashboard_svg.Setting_Svg, path: 'setting', name: 'Settings' },
  ];

  const getRouteName = () => {
    const currentPath = location.pathname.split('/').pop() || 'home';
    const currentItem = navigationItems.find((item) => item.path === currentPath);
    return currentItem ? currentItem.name : 'Dashboard';
  };

  const handleHome = () => {
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-teal-600 to-teal-700 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } flex flex-col py-4 shadow-xl z-10`}
      >
        <div className="flex items-center justify-between px-4 mb-6">
          {isSidebarOpen && (
            <span className="text-xl font-bold text-white tracking-tight">HealthSync Admin</span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-white rounded-lg hover:bg-teal-500/30 transition-colors duration-200"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>

        <ul className="flex flex-col items-center h-full gap-1 px-2">
          {navigationItems.map((item, index) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <li key={index} className="w-full">
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-500/20 text-white shadow-md border-l-4 border-teal-300'
                      : 'text-teal-100 hover:bg-teal-500/20 hover:text-white'
                  }`}
                >
                  <img src={item.icon} alt="icon" className="w-6 h-6 filter brightness-0 invert" />
                  {isSidebarOpen && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Sidebar footer */}
        {isSidebarOpen && (
          <div className="mt-auto px-4 py-3 bg-teal-500/10 rounded-lg mx-2">
            <div className="flex items-center gap-3">
              <img 
                src={user?.avatar_url || doctor_images.Avatar} 
                className="h-10 w-10 rounded-full border-2 border-teal-300 object-cover" 
                alt="User" 
              />
              <div>
                <p className="text-sm font-medium text-white">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-teal-100">
                  {authStatus ? 'Administrator' : 'Guest'}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 ml-0 transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                {getRouteName()}
              </span>
              {getRouteName() !== 'Dashboard' && (
                <span className="ml-3 px-3 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full">
                  Admin Panel
                </span>
              )}
            </h1>
          </div>
          
          <div className="relative">
            <div
              className="flex gap-2 items-center px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm cursor-pointer hover:bg-gray-50 transition-colors duration-200 hover:shadow-md"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <img
                src={user?.avatar_url || doctor_images.Avatar}
                alt="User avatar"
                className="w-9 h-9 rounded-full object-cover border-2 border-teal-400 shadow-sm"
              />
              {isSidebarOpen && (
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name || 'Guest User'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {authStatus ? 'Administrator' : 'Guest'}
                  </span>
                </div>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-gray-50">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.name || 'Guest User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'guest@example.com'}
                  </p>
                </div>
                <div className="py-1">
                  <Button
                    onClick={handleHome}
                    className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-150 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </Button>
                  {authStatus ? (
                    <Button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => navigate('/login')}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Login
                      </Button>
                      <Button
                        onClick={() => navigate('/signup')}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Sign Up
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="rounded-xl bg-white p-6 min-h-[calc(100vh-10rem)] shadow-sm border border-gray-100">
          <Routes>
            <Route path="home" element={<DashboardHome />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="message" element={<Blogs />} />
            <Route path="doctors" element={<DoctorDash />} />
            <Route path="doctors/create" element={<CreateDoctor />} />
            <Route path="setting" element={<Setting />} />
            <Route path="*" element={<DashboardHome />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;