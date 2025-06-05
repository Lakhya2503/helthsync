import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import auth from '../../supabase/auth';

const ResponsiveCalendar = () => {
  const navigate = useNavigate();
  const authuser = useSelector((state) => state.auth.user);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!authuser?.email) {
          setError('Please log in to view appointments.');
          navigate('/login');
          return;
        }

        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const { data, error: supabaseError } = await auth.supabase
          .from('appointments')
          .select('*')
          .eq('user_id', authuser.id)
          .gte('appointment_date', startDate.toISOString())
          .lte('appointment_date', endDate.toISOString())
          .order('appointment_time', { ascending: true });

        if (supabaseError) throw supabaseError;

        setAppointments(data.map(appt => ({
          ...appt,
          date: new Date(appt.appointment_date),
          formattedTime: appt.appointment_time?.slice(0, 5) || ''
        })));
      } catch (err) {
        setError(err.message || 'Failed to fetch appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [authuser, currentDate, navigate]);

  // Calendar generation helpers
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const getAppointmentsForDay = (date) => {
    return appointments.filter(appt => 
      appt.date.getDate() === date.getDate() &&
      appt.date.getMonth() === date.getMonth() &&
      appt.date.getFullYear() === date.getFullYear()
    );
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]?.toUpperCase()).join('') || '';
  };

  // Calendar navigation
  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth()));
    setSelectedDate(today);
  };

  // Generate calendar grid
  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    
    // Empty cells for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString("en-in");
      const isSelected = selectedDate.toDateString() === date.toDateString();
      const hasAppointments = getAppointmentsForDay(date).length > 0;
      const dayAppointments = getAppointmentsForDay(date);

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`
            relative h-12 w-12 mx-auto flex flex-col items-center justify-center rounded-lg cursor-pointer
            text-sm transition-all duration-200 ease-in-out
            ${isToday ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md' : ''}
            ${isSelected && !isToday ? 'bg-blue-50 border-2 border-blue-300 text-blue-800' : ''}
            ${!isToday && !isSelected ? 'hover:bg-gray-50 hover:shadow-sm' : ''}
            ${dayAppointments.length > 0 ? 'border-t-4 border-t-blue-400' : ''}
          `}
        >
          <span className={`font-medium ${isToday ? 'text-white' : 'text-gray-700'}`}>
            {day}
          </span>
          {hasAppointments && (
            <div className="absolute bottom-1 flex space-x-1">
              {dayAppointments.slice(0, 3).map((_, i) => (
                <span 
                  key={i} 
                  className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                />
              ))}
              {dayAppointments.length > 3 && (
                <span className="text-xs text-gray-500">+{dayAppointments.length - 3}</span>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  if (loading) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-6 text-center bg-red-50 rounded-lg">
      <div className="mx-auto w-16 h-16 flex items-center justify-center bg-red-100 rounded-full mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-lg font-medium text-red-700 mb-2">{error}</p>
      {error.includes('log in') && (
        <button
          onClick={() => navigate('/login')}
          className="mt-3 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition-all"
        >
          Log In
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Calendar Header */}
      <div className="p-5 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-full bg-white shadow-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
              aria-label="Previous month"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 rounded-full bg-white shadow-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
              aria-label="Next month"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-5">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {daysOfWeek.map(day => (
            <div 
              key={day} 
              className="text-center text-sm font-semibold text-blue-600 uppercase tracking-wider py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Appointments Section */}
      <div className="bg-gray-50 border-t border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Appointments for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {getAppointmentsForDay(selectedDate).length} appointment{getAppointmentsForDay(selectedDate).length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {getAppointmentsForDay(selectedDate).length > 0 ? (
          <div className="space-y-3">
            {getAppointmentsForDay(selectedDate).map(appt => (
              <div 
                key={appt.id} 
                className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-bold text-lg">
                      {getInitials(appt.patient_name)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-900 truncate">
                      {appt.patient_name}
                    </h4>
                    <div className="flex items-center mt-1">
                      <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p className="text-sm text-gray-600">{appt.specialty}</p>
                    </div>
                    <div className="flex items-center mt-1">
                      <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-gray-600">{appt.formattedTime}</p>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      {appt.status || 'Scheduled'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h4 className="mt-3 text-lg font-medium text-gray-700">No appointments scheduled</h4>
            <p className="mt-1 text-gray-500">Select another day or schedule a new appointment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsiveCalendar;