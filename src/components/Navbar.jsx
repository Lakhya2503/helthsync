import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Doctor_Svg from '../assets/svg/index';
import Button from './Button';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../store/authSlice';
import doctor_images from '../assets/doctor_images';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const [hovered, setHovered] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setHovered(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const Navitems = [
    { name: "Home", path: "/", active: true },
    { name: "Service", path: "/service", active: true },
    { name: "Contact Us", path: "/contact-us", active: true },
    { name: "Help", path: "/help", active: true },
    { name: "Blogs", path: "/blogs", active: true },
  ];

  const auth = [
    { name: "Sign Up", path: "/signup", active: true },
    { name: "Log In", path: "/login", active: true },
  ];

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate('/');
    setHovered(false);
  };

  return (
    <div className="flex justify-between gap-3 h-[100px] items-center px-[7rem] bg-gradient-to-r from-blue-50 to-teal-50 shadow-md">
      <NavLink to={`/`}>
        <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300">
          <img src={Doctor_Svg.Doctor_Svg} alt="" className="h-[30px]" />
          <h3 className="text-sky-600 text-[22px] font-bold">
            Health<span className="text-green-600">Sync</span>
          </h3>
        </div>
      </NavLink>

      <ul className="flex gap-[2.5rem]">
        {Navitems.map((i, idx) => (
          <li key={idx}>
            <NavLink
              to={i.path}
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 ${
                  isActive
                    ? "text-orange-600 font-semibold border-b-2 border-orange-600"
                    : "text-gray-700 hover:text-orange-600"
                } transition-all duration-300 hover:scale-105`
              }
            >
              {i.name}
            </NavLink>
          </li>
        ))}
      </ul>

      <ul className="flex gap-5 items-center">
        {!authStatus ? (
          auth.map((i, idx) => (
            <li key={idx} className="text-13px">
              <NavLink to={`${i.path}`}>
                <Button 
                  className={`px-8 py-2 rounded-full text-[18px] font-semibold transition-all duration-300 ${
                    i.name === "Sign Up" 
                      ? "bg-[#007E85] text-white hover:bg-[#006670] shadow-lg hover:shadow-teal-200"
                      : "bg-transparent text-[#007E85] border-2 border-[#007E85] hover:bg-[#007E85] hover:text-white"
                  }`}
                >
                  {i.name}
                </Button>
              </NavLink>
            </li>
          ))
        ) : (
          <li
            className="relative flex items-center gap-3 cursor-pointer"
            ref={dropdownRef}
          >
            <div 
              className="flex items-center gap-3 px-4 py-2 border-2 rounded-full border-[#007E85] bg-white hover:bg-blue-50 transition-colors duration-300"
              onClick={() => setHovered(prev => !prev)}
            >
              <img
                src={user?.avatar_url || doctor_images.Avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
              />
              <span className="font-semibold text-gray-800">{user?.name || 'User'}</span>
            </div>

            {hovered && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                </div>
                <button
                  onClick={() => {
                    navigate('/dashboard');
                    setHovered(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navbar;