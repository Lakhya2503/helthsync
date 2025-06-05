import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, X, Bell, Calendar, Stethoscope, Newspaper, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import authService from '../../supabase/authService';
import doctor_images from '../../assets/doctor_images';
import HeaderMessage from './HeaderMessage';
import SmallCalendar from './SmallCalendar';
import Visits from './Visits';
import PatientList from './PatientList';
import News from './News';
import {
  createConsultation,
  getRecentConsultations,
} from '../../supabase/service/consultationService';
import { createEvent, getEvents } from '../../supabase/service/eventService';
import { createNews, getNews } from '../../supabase/service/newsService';
import ConsultationForm from './create/ConsultationForm';
import EventForm from './create/EventForm';
import NewsForm from './create/NewsForm';
import MobileMenu from './MobileMenu';
import LoadingSpinner from './../cards/LoadingSpinner';
import ErrorBanner from './../cards/ErrorBanner';
import ConsultationsList from './ConsultationsList';
import EventList from './EventList';
import NewsList from './NewsList';

const DashboardHome = () => {
  // Redux state
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State management
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [events, setEvents] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Memoized filtered data
  const filteredConsultations = useMemo(() => {
    if (!searchTerm) return consultations;
    return consultations.filter(consultation => 
      `${consultation.patientId} ${consultation.notes} ${consultation.doctorName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [consultations, searchTerm]);

  const filteredEvents = useMemo(() => {
    if (!searchTerm) return events;
    return events.filter(event => 
      `${event.title} ${event.description} ${event.creatorName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  const filteredNews = useMemo(() => {
    if (!searchTerm) return newsItems;
    return newsItems.filter(news => 
      `${news.title} ${news.content} ${news.authorName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [newsItems, searchTerm]);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [consultationsData, eventsData, newsData] = await Promise.all([
        getRecentConsultations().catch(e => { throw new Error('Failed to load consultations') }),
        getEvents().catch(e => { throw new Error('Failed to load events') }),
        getNews().catch(e => { throw new Error('Failed to load news') })
      ]);
      
      setConsultations(consultationsData);
      setEvents(eventsData);
      setNewsItems(newsData);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError({
        message: err.message || 'Failed to load dashboard data',
        retry: fetchDashboardData
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handlers
  const handleLogout = async () => {
    try {
      await authService.signout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError({
        message: 'Failed to logout. Please try again.',
        retry: handleLogout
      });
    }
  };

  const handleConsultationSubmit = async (data) => {
    try {
      const newConsultation = await createConsultation({
        ...data,
        doctorId: user.id,
        doctorName: user.name,
        status: 'scheduled'
      });
      setConsultations(prev => [newConsultation, ...prev]);
      setShowConsultationForm(false);
    } catch (err) {
      console.error('Consultation creation error:', err);
      setError({
        message: 'Failed to create consultation',
        retry: () => handleConsultationSubmit(data)
      });
    }
  };

  const handleEventSubmit = async (data) => {
    try {
      const newEvent = await createEvent({
        ...data,
        createdBy: user.id,
        creatorName: user.name
      });
      setEvents(prev => [newEvent, ...prev]);
      setShowEventForm(false);
    } catch (err) {
      console.error('Event creation error:', err);
      setError({
        message: 'Failed to create event',
        retry: () => handleEventSubmit(data)
      });
    }
  };

  const handleNewsSubmit = async (data) => {
    try {
      const newNews = await createNews({
        ...data,
        authorId: user.id,
        authorName: user.name
      });
      setNewsItems(prev => [newNews, ...prev]);
      setShowNewsForm(false);
    } catch (err) {
      console.error('News creation error:', err);
      setError({
        message: 'Failed to create news',
        retry: () => handleNewsSubmit(data)
      });
    }
  };

  const clearSearch = () => setSearchTerm('');

  // Loading and error states
  if (authLoading || isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error && !consultations.length && !events.length && !newsItems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 p-6 rounded-lg max-w-md w-full text-center border border-red-200 shadow-sm">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={error.retry}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Mobile menu */}
      <MobileMenu 
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        onNewConsultation={() => setShowConsultationForm(true)}
        onNewEvent={() => setShowEventForm(true)}
        onNewNews={() => setShowNewsForm(true)}
      />

      {/* Modal forms */}
      <ConsultationFormModal
        show={showConsultationForm}
        onClose={() => setShowConsultationForm(false)}
        onSubmit={handleConsultationSubmit}
      />
      
      <EventFormModal
        show={showEventForm}
        onClose={() => setShowEventForm(false)}
        onSubmit={handleEventSubmit}
      />
      
      <NewsFormModal
        show={showNewsForm}
        onClose={() => setShowNewsForm(false)}
        onSubmit={handleNewsSubmit}
      />

      {/* Main layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1">
          <DashboardHeader
            user={user}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onLogout={handleLogout}
          />

          {error && (
            <ErrorBanner 
              message={error.message}
              onRetry={error.retry}
              onDismiss={() => setError(null)}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <Visits />
              <PatientList />
              
              {/* <ConsultationsSection
                consultations={filteredConsultations}
                searchTerm={searchTerm}
                onCreateNew={() => setShowConsultationForm(true)}
                onViewAll={() => navigate('/consultations')}
                onConsultationClick={(id) => navigate(`/consultations/${id}`)}
                onClearSearch={clearSearch}
              /> */}
              <ConsultationsList/>

              

            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <SmallCalendar events={events} />
              
              {/* <EventsSection
                events={filteredEvents}
                searchTerm={searchTerm}
                onCreateNew={() => setShowEventForm(true)}
                onViewAll={() => navigate('/dashboard/events')}
                onEventClick={(id) => navigate(`/dashboard/events/${id}`)}
                onClearSearch={clearSearch}
              /> */}
              
                <EventList/>
                <NewsList/>

              {/* <NewsSection
                newsItems={filteredNews}
                searchTerm={searchTerm}
                onCreateNew={() => setShowNewsForm(true)}
                onViewAll={() => navigate('/dashboard/news')}
                onClearSearch={clearSearch}
              /> */}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components

const ConsultationFormModal = ({ show, onClose, onSubmit }) => (
  show && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <ConsultationForm onClose={onClose} onSubmit={onSubmit} />
    </div>
  )
);

const EventFormModal = ({ show, onClose, onSubmit }) => (
  show && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <EventForm onClose={onClose} onSubmit={onSubmit} />
    </div>
  )
);

const NewsFormModal = ({ show, onClose, onSubmit }) => (
  show && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <NewsForm onClose={onClose} onSubmit={onSubmit} />
    </div>
  )
);

const DashboardHeader = ({ user, searchTerm, onSearchChange, onLogout }) => (
  <div className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
    <div>
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 flex items-center gap-3">
        <HeaderMessage />
        <span className="text-teal-600 capitalize">Dr. {user?.name || 'User'}!</span>
      </h1>
    </div>
    
    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search patients, events..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <NotificationBell />
        
        <div className="flex items-center gap-2">
          <UserAvatar user={user} />
          <span className="text-gray-800 font-medium capitalize hidden md:inline">
            Dr. {user?.name || 'User'}
          </span>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
);

const NotificationBell = () => (
  <button className="p-2 text-gray-600 hover:text-gray-800 relative transition-colors duration-200">
    <Bell className="h-5 w-5" />
    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
  </button>
);

const UserAvatar = ({ user }) => (
  <img 
    src={user?.avatar_url || doctor_images.avatar} 
    className="h-8 w-8 rounded-full object-cover border border-gray-300" 
    alt="User avatar" 
  />
);

const ConsultationsSection = ({
  consultations,
  searchTerm,
  onCreateNew,
  onViewAll,
  onConsultationClick,
  onClearSearch
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <SectionHeader
      icon={<Stethoscope className="h-5 w-5 text-teal-600" />}
      title="Recent Consultations"
      onCreateNew={onCreateNew}
      onViewAll={onViewAll}
    />
    
    {consultations.length > 0 ? (
      <div className="space-y-4">
        {consultations.slice(0, 5).map(consultation => (
          <ConsultationCard 
            key={consultation.id}
            consultation={consultation}
            onClick={() => onConsultationClick(consultation.id)}
          />
        ))}
      </div>
    ) : (
      <EmptyState
        message="No consultations found"
        searchTerm={searchTerm}
        onClearSearch={onClearSearch}
        onCreateNew={onCreateNew}
        createButtonText="Create your first consultation"
      />
    )}
  </div>
);

const ConsultationCard = ({ consultation, onClick }) => (
  <div 
    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <div>
        <h3 className="font-medium text-gray-800">Patient: {consultation.patientId}</h3>
        <p className="text-sm text-gray-500">With Dr. {consultation.doctorName}</p>
      </div>
      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
        {new Date(consultation.date).toLocaleDateString()} • {new Date(consultation.date).toLocaleTimeString([], {timeStyle: 'short'})}
      </span>
    </div>
    
    {consultation.notes && (
      <p className="text-gray-600 mt-2 text-sm line-clamp-2">{consultation.notes}</p>
    )}
    
    <div className="mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <ConsultationTags 
        prescription={consultation.prescription}
        followUp={consultation.followUp}
      />
      <StatusBadge status={consultation.status} />
    </div>
  </div>
);

const ConsultationTags = ({ prescription, followUp }) => (
  <div className="flex flex-wrap gap-1">
    {prescription && (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Prescribed
      </span>
    )}
    {followUp && (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        Follow-up
      </span>
    )}
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`text-xs px-2 py-1 rounded-full ${
    status === 'completed' ? 'bg-green-100 text-green-800' :
    status === 'cancelled' ? 'bg-red-100 text-red-800' :
    'bg-yellow-100 text-yellow-800'
  }`}>
    {status}
  </span>
);

const EventsSection = ({
  events,
  searchTerm,
  onCreateNew,
  onViewAll,
  onEventClick,
  onClearSearch
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <SectionHeader
      icon={<Calendar className="h-5 w-5 text-teal-600" />}
      title="Upcoming Events"
      onCreateNew={onCreateNew}
      onViewAll={onViewAll}
    />
    
    {events.length > 0 ? (
      <div className="space-y-3">
        {events.slice(0, 3).map(event => (
          <EventCard 
            key={event.id}
            event={event}
            onClick={() => onEventClick(event.id)}
          />
        ))}
      </div>
    ) : (
      <EmptyState
        message="No events found"
        searchTerm={searchTerm}
        onClearSearch={onClearSearch}
        onCreateNew={onCreateNew}
        createButtonText="Create your first event"
      />
    )}
  </div>
);

const EventCard = ({ event, onClick }) => (
  <div 
    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
    onClick={onClick}
  >
    <h3 className="font-medium text-gray-800">{event.title}</h3>
    <p className="text-sm text-gray-500 mt-1">
      {new Date(event.date).toLocaleDateString()} • {new Date(event.date).toLocaleTimeString([], {timeStyle: 'short'})}
    </p>
    {event.location && (
      <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
        <span>📍</span> {event.location}
      </p>
    )}
    {event.description && (
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
    )}
  </div>
);

const NewsSection = ({
  newsItems,
  searchTerm,
  onCreateNew,
  onViewAll,
  onClearSearch
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <SectionHeader
      icon={<Newspaper className="h-5 w-5 text-teal-600" />}
      title="Clinic News"
      onCreateNew={onCreateNew}
      onViewAll={onViewAll}
      actionText="Add"
    />
    <News newsItems={newsItems} searchTerm={searchTerm} />
    {newsItems.length === 0 && searchTerm && (
      <button 
        onClick={onClearSearch}
        className="mt-2 text-sm text-teal-600 hover:underline transition-colors duration-200"
      >
        Clear search
      </button>
    )}
  </div>
);

const SectionHeader = ({ icon, title, onCreateNew, onViewAll, actionText = 'New' }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
      {icon}
      {title}
    </h2>
    <div className="flex gap-2">
      <button
        onClick={onCreateNew}
        className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm flex items-center gap-1 transition-colors duration-200"
      >
        <Plus size={16} />
        {actionText}
      </button>
      <button
        onClick={onViewAll}
        className="px-3 py-1 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50 text-sm transition-colors duration-200"
      >
        View All
      </button>
    </div>
  </div>
);

const EmptyState = ({ message, searchTerm, onClearSearch, onCreateNew, createButtonText }) => (
  <div className="text-center py-8">
    <p className="text-gray-500">{message}</p>
    {searchTerm ? (
      <button 
        onClick={onClearSearch}
        className="mt-2 text-sm text-teal-600 hover:underline transition-colors duration-200"
      >
        Clear search
      </button>
    ) : (
      <button
        onClick={onCreateNew}
        className="mt-3 px-3 py-1 bg-teal-600 text-white rounded-md text-sm hover:bg-teal-700 transition-colors duration-200"
      >
        {createButtonText}
      </button>
    )}
  </div>
);

// Prop Types
DashboardHome.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    avatar_url: PropTypes.string,
  }),
  loading: PropTypes.bool,
};

export default DashboardHome;
