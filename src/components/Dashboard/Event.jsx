import React, { useEffect, useState } from 'react';
import auth from '../../supabase/auth';

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await auth.supabase
          .from('events')
          .select('type, title, event_date, event_time')
          .gte('event_date', new Date().toISOString().split('T')[0])
          .order('event_date', { ascending: true });

        if (error) throw error;
        setEvents(
          data.map((event) => ({
            type: event.type,
            title: event.title,
            date: new Date(event.event_date).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            time: formatTime(event.event_time),
          }))
        );
      } catch (err) {
        setError(err.message || 'Failed to fetch events');
        console.error('Events fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = hours % 12 || 12;
    return `${formattedHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  if (loading) return <div className="p-4 text-gray-600">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Upcoming</h2>
        <a href="#" className="text-blue-500 text-sm">View All</a>
      </div>
      {events.length > 0 ? (
        events.map((event, index) => (
          <div key={index} className="flex items-center space-x-4 mb-4 last:mb-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
              {event.type}
            </div>
            <div>
              <p className="text-gray-800 font-semibold">{event.title}</p>
              <p className="text-sm text-gray-500">{event.date} • {event.time}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No upcoming events.</p>
      )}
    </div>
  );
};

export default Event;