import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Plus, Edit, Calendar, MessageSquare, Stethoscope, Clock, Star, UserCheck, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@headlessui/react';
import { useSelector } from 'react-redux';
import auth from '../../supabase/auth';
import HeaderMessage from './HeaderMessage';
import DoctorList from './Doctors';
import { motion } from 'framer-motion';

const DoctorDashboardCard = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [stats, setStats] = useState({ 
    totalVisits: 0, 
    newPatients: 0, 
    oldPatients: 0,
    appointmentsToday: 0,
    messages: 0,
    rating: 0,
    averageWaitTime: 0
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isHovered, setIsHovered] = useState(false);
  const authuser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!authuser?.email) {
          navigate('/login');
          return;
        }

        const { data, error: supabaseError } = await auth.supabase
          .from('doctors')
          .select('*')
          .eq('email', authuser.email)
          .single();

        if (supabaseError) throw supabaseError;
        if (!data) throw new Error('No doctor profile found');

        setDoctor(data);
        
        // Simulate fetching stats data with more realistic values
        const randomStats = {
          totalVisits: data.total_visits || Math.floor(Math.random() * 500) + 100,
          newPatients: data.new_patients || Math.floor(Math.random() * 50) + 10,
          oldPatients: data.returning_patients || Math.floor(Math.random() * 200) + 50,
          appointmentsToday: Math.floor(Math.random() * 10) + 1,
          messages: Math.floor(Math.random() * 15) + 3,
          rating: (Math.random() * 1 + 4).toFixed(1), // Random rating between 4.0 and 5.0
          averageWaitTime: Math.floor(Math.random() * 20) + 5 // Random wait time between 5-25 mins
        };
        
        setStats(randomStats);
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError(err.message || 'Failed to load doctor profile');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [authuser, navigate]);

  const handleEditProfile = () => {
    navigate(`/dashboard/doctors/edit/${doctor.id}`);
  };

  const handleViewAppointments = () => {
    navigate('/dashboard/appointments');
  };

  const handleViewMessages = () => {
    navigate('/dashboard/messages');
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'new-appointment':
        navigate('/dashboard/appointments/new');
        break;
      case 'prescription':
        navigate('/dashboard/prescriptions/new');
        break;
      case 'patient-record':
        navigate('/dashboard/patients/new');
        break;
      default:
        break;
    }
  };

  if (loading) return (
    <div className="p-6 animate-pulse">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-60 w-full md:w-1/3"></div>
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-3/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-4/5"></div>
            <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 shadow-lg"
    >
      <div className="text-red-600 font-medium flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
      <button
        onClick={() => window.location.reload()}
        className="mt-3 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
        Try Again
      </button>
    </motion.div>
  );

  if (!doctor) return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 text-center bg-white rounded-xl shadow-lg border border-gray-200"
    >
      <div className="text-gray-600 mb-4 flex flex-col items-center">
        <Stethoscope className="text-amber-500 h-12 w-12 mb-3" />
        <span className="text-lg font-medium">No doctor profile found</span>
      </div>
      <Button
        onClick={() => navigate('/dashboard/doctors/create')}
        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center gap-2 mx-auto shadow-md hover:shadow-lg"
      >
        <Plus size={16} />
        Create Doctor Profile
      </Button>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Doctor Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden border border-gray-200"
      >
        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* Doctor Image */}
          <div 
            className="w-full md:w-1/3 lg:w-1/4 relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative overflow-hidden rounded-lg border-4 border-white shadow-lg">
              <motion.img 
                src={doctor.profile_image || '/default-doctor.jpg'} 
                alt={`Dr. ${doctor.last_name}`}
                className="w-full h-60 md:h-full object-cover"
                initial={{ scale: 1 }}
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  e.target.src = '/default-doctor.jpg';
                }}
              />
              {isHovered && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4"
                >
                  <button 
                    onClick={handleEditProfile}
                    className="text-white bg-black/70 hover:bg-black/90 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 transition-all"
                  >
                    <Edit size={14} />
                    Edit Photo
                  </button>
                </motion.div>
              )}
            </div>
            <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </div>
            
            {/* Rating Badge */}
            <div className="absolute -top-3 -left-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <Star size={14} className="fill-white" />
              {stats.rating}
            </div>
          </div>
          
          {/* Doctor Details */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <HeaderMessage />
                  <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                    Dr. {doctor.first_name} {doctor.last_name}
                  </span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">{doctor.specialty || 'General Practitioner'}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Clock size={14} className="text-gray-400" />
                  Average wait time: {stats.averageWaitTime} mins
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleEditProfile}
                  className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <Edit size={16} />
                  Edit Profile
                </Button>
                <Button
                  onClick={() => navigate('/dashboard/doctors/create')}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Plus size={16} />
                  Add Doctor
                </Button>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickAction('new-appointment')}
                className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
              >
                <div className="bg-blue-100 text-blue-600 p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                  <Calendar size={18} />
                </div>
                <span className="text-sm font-medium text-blue-800">New Appointment</span>
              </motion.button>
              
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickAction('prescription')}
                className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
              >
                <div className="bg-green-100 text-green-600 p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v18M3 12h18" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-green-800">New Prescription</span>
              </motion.button>
              
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickAction('patient-record')}
                className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3 text-center hover:shadow-md transition-all"
              >
                <div className="bg-purple-100 text-purple-600 p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-purple-800">New Patient Record</span>
              </motion.button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'overview' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Overview
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'schedule' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Calendar size={16} />
                Schedule
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'messages' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <MessageSquare size={16} />
                Messages
                {stats.messages > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {stats.messages}
                  </span>
                )}
              </button>
            </div>
            
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-900">Specialty:</span> {doctor.specialty || 'Not specified'}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-900">Phone:</span> {doctor.phone_number || 'Not provided'}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-900">Years of Experience:</span> {doctor.experience || 'Not specified'}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-900">Languages:</span> {doctor.languages?.join(', ') || 'English'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-900">Email:</span> {doctor.email}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-900">License ID:</span> {doctor.license_number || 'Not provided'}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-900">Hospital:</span> {doctor.hospital || 'Not specified'}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-900">Consultation Fee:</span> {doctor.consultation_fee ? `$${doctor.consultation_fee}` : 'Not specified'}
                    </p>
                  </div>
                </div>
                
                {doctor.description && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
                    <h3 className="text-blue-800 font-medium mb-2">Professional Bio</h3>
                    <p className="text-gray-700">"{doctor.description}"</p>
                  </div>
                )}
              </>
            )}
            
            {activeTab === 'schedule' && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-800 font-medium">Today's Appointments</h3>
                  <button 
                    onClick={handleViewAppointments}
                    className="text-sm text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1"
                  >
                    View All
                    <ArrowUpRight size={16} />
                  </button>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-gray-700 flex items-center gap-2">
                    <span className="font-medium text-gray-900">Total Appointments:</span> 
                    <span className="text-teal-600 font-bold">{stats.appointmentsToday}</span>
                  </p>
                  <div className="mt-3 space-y-3">
                    {Array.from({ length: Math.min(3, stats.appointmentsToday) }).map((_, i) => (
                      <motion.div 
                        key={i} 
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => navigate(`/dashboard/appointments/${i+1}`)}
                      >
                        <div>
                          <p className="font-medium text-gray-800">Patient #{i+1}</p>
                          <p className="text-xs text-gray-500">{['10:00 AM', '2:30 PM', '4:15 PM'][i] || 'Time not specified'}</p>
                          <p className="text-xs mt-1 flex items-center gap-1">
                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${i === 0 ? 'bg-green-100 text-green-800' : i === 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                              {i === 0 ? 'Follow-up' : i === 1 ? 'New Patient' : 'Consultation'}
                            </span>
                          </p>
                        </div>
                        <button className="text-xs bg-teal-50 text-teal-600 px-2 py-1 rounded hover:bg-teal-100 transition-colors">
                          View Details
                        </button>
                      </motion.div>
                    ))}
                    {stats.appointmentsToday === 0 && (
                      <p className="text-gray-500 text-center py-4">No appointments scheduled for today</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'messages' && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-800 font-medium">Recent Messages</h3>
                  <button 
                    onClick={handleViewMessages}
                    className="text-sm text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1"
                  >
                    View All
                    <ArrowUpRight size={16} />
                  </button>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  {stats.messages > 0 ? (
                    <div className="space-y-3">
                      {Array.from({ length: Math.min(3, stats.messages) }).map((_, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ x: 5 }}
                          className="flex items-start gap-3 p-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                          onClick={() => navigate(`/dashboard/messages/${i+1}`)}
                        >
                          <div className="bg-teal-100 text-teal-800 rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold mt-1">
                            {['J', 'M', 'A'][i] || 'P'}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{['John Smith', 'Maria Garcia', 'Alex Johnson'][i] || 'Patient'}</p>
                            <p className="text-sm text-gray-600 truncate">{['Follow-up question about prescription...', 'Test results discussion...', 'Appointment rescheduling request...'][i] || 'New message'}</p>
                          </div>
                          <span className="text-xs text-gray-500 self-center">2h ago</span>
                          {i === 0 && (
                            <span className="bg-red-500 rounded-full h-2 w-2"></span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No new messages</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Stats Cards - Responsive Grid */}
            {activeTab === 'overview' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
              >
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => navigate('/dashboard/patients')}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-blue-600 font-medium">Total Visits</p>
                    <ArrowUpRight className="text-blue-500" size={18} />
                  </div>
                  <p className="text-2xl font-bold text-blue-800 mt-2">{stats.totalVisits}</p>
                  <p className="text-xs text-blue-500 mt-1">+12% from last month</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => navigate('/dashboard/patients?filter=new')}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-green-600 font-medium">New Patients</p>
                    <UserPlus className="text-green-500" size={18} />
                  </div>
                  <p className="text-2xl font-bold text-green-800 mt-2">{stats.newPatients}</p>
                  <p className="text-xs text-green-500 mt-1">+8% from last month</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => navigate('/dashboard/patients?filter=returning')}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-purple-600 font-medium">Returning Patients</p>
                    <UserCheck className="text-purple-500" size={18} />
                  </div>
                  <p className="text-2xl font-bold text-purple-800 mt-2">{stats.oldPatients}</p>
                  <p className="text-xs text-purple-500 mt-1">-3% from last month</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={handleViewAppointments}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-amber-600 font-medium">Today's Appointments</p>
                    <Calendar className="text-amber-500" size={18} />
                  </div>
                  <p className="text-2xl font-bold text-amber-800 mt-2">{stats.appointmentsToday}</p>
                  <p className="text-xs text-amber-500 mt-1">{stats.appointmentsToday > 0 ? 'Next at 10:00 AM' : 'No appointments'}</p>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Doctor List */}
      <DoctorList />
    </div>
  );
};

export default DoctorDashboardCard;