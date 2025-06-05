import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getEvents, 
  createEvent, 
  deleteEvent, 
  getUpcomingEvents, 
  getPastEvents 
} from '../../supabase/service/eventService';
import EventForm from '../../components/Dashboard/create/EventForm';
import { FiCalendar, FiClock, FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'upcoming', 'past'
  const [daysFilter, setDaysFilter] = useState(7);

  useEffect(() => {
    fetchEvents();
  }, [viewMode, daysFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let data;
      
      switch(viewMode) {
        case 'upcoming':
          data = await getUpcomingEvents(daysFilter);
          break;
        case 'past':
          data = await getPastEvents(daysFilter);
          break;
        default:
          data = await getEvents();
      }
      
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      const newEvent = await createEvent(eventData);
      setEvents([newEvent, ...events]);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Error creating event:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        setEvents(events.filter(event => event.id !== id));
      } catch (err) {
        setError(err.message);
        console.error('Error deleting event:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.slice(0, 5); // Format as HH:MM
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 md:py-8">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Event Management</h1>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center px-3 py-2 md:px-4 md:py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {showForm ? (
            <>
              <FiX className="mr-1" /> Cancel
            </>
          ) : (
            <>
              <FiPlus className="mr-1" /> Add Event
            </>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded ${
              viewMode === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setViewMode('upcoming')}
            className={`px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded ${
              viewMode === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setViewMode('past')}
            className={`px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded ${
              viewMode === 'past' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Past
          </button>
        </div>
        
        {(viewMode === 'upcoming' || viewMode === 'past') && (
          <div className="flex items-center space-x-2">
            <span className="text-sm md:text-base">Show last/next</span>
            <select 
              value={daysFilter} 
              onChange={(e) => setDaysFilter(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm md:text-base"
            >
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
            </select>
          </div>
        )}
      </div>

      {/* Event Form */}
      {showForm && (
        <div className="mb-6 md:mb-8 bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Create New Event</h2>
          <EventForm onSubmit={handleCreateEvent} />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm md:text-base">
          {error}
        </div>
      )}

      {/* Loading/Empty State */}
      {loading ? (
        <div className="text-center py-8">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm md:text-base">
          No events found. {viewMode !== 'all' && 'Try changing your filters.'}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs md:text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {event.type}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm md:text-base font-medium text-gray-900">{event.title}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm md:text-base text-gray-500">
                        <FiCalendar className="mr-1" /> {formatDate(event.event_date)}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm md:text-base text-gray-500">
                        <FiClock className="mr-1" /> {formatTime(event.event_time)}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm md:text-base text-gray-500">
                      <Link 
                        to={`/events/edit/${event.id}`} 
                        className="text-blue-500 hover:text-blue-700 mr-4 flex items-center"
                      >
                        <FiEdit2 className="mr-1" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-red-500 hover:text-red-700 flex items-center"
                      >
                        <FiTrash2 className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 mb-2">
                      {event.type}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <Link 
                      to={`/events/edit/${event.id}`} 
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <FiEdit2 />
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <FiCalendar className="mr-1" /> {formatDate(event.event_date)}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FiClock className="mr-1" /> {formatTime(event.event_time)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EventList;