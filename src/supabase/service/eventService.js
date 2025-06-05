import auth from "../auth";

// Helper function to validate event data
const validateEventData = (data) => {
  if (!data.title) throw new Error('Event title is required');
  if (!data.event_date) throw new Error('Event date is required');
  if (!data.event_time) throw new Error('Event time is required');
  if (!data.type) throw new Error('Event type is required');
  return true;
};

export const getEvents = async (options = {}) => {
  const {
    limit = 100,
    ascending = false,
    afterDate = null,
    beforeDate = null,
    type = null
  } = options;

  try {
    let query = auth.supabase
      .from('events')
      .select('id, title, type, event_date, event_time, created_at')
      .order('event_date', { ascending })
      .order('event_time', { ascending });

    if (limit) query = query.limit(limit);
    if (afterDate) query = query.gte('event_date', afterDate);
    if (beforeDate) query = query.lte('event_date', beforeDate);
    if (type) query = query.eq('type', type);

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching events:', error.message);
    throw new Error('Failed to fetch events. Please try again.');
  }
};

export const getEventById = async (id) => {
  try {
    const { data, error } = await auth.supabase
      .from('events')
      .select('id, title, type, event_date, event_time, created_at')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Event not found');
    return data;
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error.message);
    throw new Error(`Failed to fetch event: ${error.message}`);
  }
};

export const createEvent = async (eventData) => {
  try {
    validateEventData(eventData);

    const { data, error } = await auth.supabase
      .from('events')
      .insert([{
        title: eventData.title,
        type: eventData.type,
        event_date: eventData.event_date,
        event_time: eventData.event_time
      }])
      .select('id, title, type, event_date, event_time, created_at')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating event:', error.message);
    throw new Error(`Failed to create event: ${error.message}`);
  }
};

export const updateEvent = async (id, updates) => {
  try {
    if (!id) throw new Error('Event ID is required');
    if (Object.keys(updates).length === 0) {
      throw new Error('No updates provided');
    }

    const { data, error } = await auth.supabase
      .from('events')
      .update(updates) // No updated_at field in schema
      .eq('id', id)
      .select('id, title, type, event_date, event_time, created_at')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating event ${id}:`, error.message);
    throw new Error(`Failed to update event: ${error.message}`);
  }
};

export const deleteEvent = async (id) => {
  try {
    if (!id) throw new Error('Event ID is required');

    const { error } = await auth.supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting event ${id}:`, error.message);
    throw new Error(`Failed to delete event: ${error.message}`);
  }
};

export const getUpcomingEvents = async (days = 7) => {
  try {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    const { data, error } = await auth.supabase
      .from('events')
      .select('id, title, type, event_date, event_time, created_at')
      .gte('event_date', now.toISOString().split('T')[0])
      .lte('event_date', futureDate.toISOString().split('T')[0])
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching upcoming events:', error.message);
    throw new Error('Failed to fetch upcoming events. Please try again.');
  }
};

export const getPastEvents = async (days = 30) => {
  try {
    const now = new Date();
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - days);

    const { data, error } = await auth.supabase
      .from('events')
      .select('id, title, type, event_date, event_time, created_at')
      .lte('event_date', now.toISOString().split('T')[0])
      .gte('event_date', pastDate.toISOString().split('T')[0])
      .order('event_date', { ascending: false })
      .order('event_time', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching past events:', error.message);
    throw new Error('Failed to fetch past events. Please try again.');
  }
};