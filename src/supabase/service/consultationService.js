import auth from '../auth';

// Helper function to validate consultation data
const validateConsultationData = (data) => {
  if (!data.doctor_email) throw new Error('Doctor email is required');
  if (!data.patient_name) throw new Error('Patient name is required');
  if (data.age == null || data.age < 0) throw new Error('Valid age is required');
  if (data.months == null || data.months < 0 || data.months >= 12) throw new Error('Valid months (0-11) is required');
  if (!data.symptoms) throw new Error('Symptoms are required');
  if (!data.observation) throw new Error('Observation is required');
  try {
    if (data.prescription) JSON.parse(data.prescription); // Validate JSON
  } catch {
    throw new Error('Prescription must be valid JSON');
  }
  return true;
};

export const getConsultations = async (options = {}) => {
  const {
    limit = 100,
    ascending = false,
    doctorEmail = null,
    patientName = null
  } = options;

  try {
    let query = auth.supabase
      .from('consultations')
      .select('id, doctor_email, patient_name, age, months, symptoms, last_checked, last_checked_id, observation, prescription, created_at')
      .order('created_at', { ascending });

    if (limit) query = query.limit(limit);
    if (doctorEmail) query = query.eq('doctor_email', doctorEmail);
    if (patientName) query = query.ilike('patient_name', `%${patientName}%`);

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching consultations:', error.message);
    throw new Error('Failed to fetch consultations. Please try again.');
  }
};

export const getConsultationById = async (id) => {
  try {
    const { data, error } = await auth.supabase
      .from('consultations')
      .select('id, doctor_email, patient_name, age, months, symptoms, last_checked, last_checked_id, observation, prescription, created_at')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Consultation not found');
    return data;
  } catch (error) {
    console.error(`Error fetching consultation ${id}:`, error.message);
    throw new Error(`Failed to fetch consultation: ${error.message}`);
  }
};

export const createConsultation = async (consultationData) => {
  try {
    validateConsultationData(consultationData);

    const { data, error } = await auth.supabase
      .from('consultations')
      .insert([{
        doctor_email: consultationData.doctor_email,
        patient_name: consultationData.patient_name,
        age: consultationData.age,
        months: consultationData.months,
        symptoms: consultationData.symptoms,
        last_checked: consultationData.last_checked || null,
        last_checked_id: consultationData.last_checked_id || null,
        observation: consultationData.observation,
        prescription: consultationData.prescription ? JSON.parse(consultationData.prescription) : null
      }])
      .select('id, doctor_email, patient_name, age, months, symptoms, last_checked, last_checked_id, observation, prescription, created_at')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating consultation:', error.message);
    throw new Error(`Failed to create consultation: ${error.message}`);
  }
};

export const updateConsultation = async (id, updates) => {
  try {
    if (!id) throw new Error('Consultation ID is required');
    if (Object.keys(updates).length === 0) throw new Error('No updates provided');

    if (updates.prescription) {
      try {
        updates.prescription = JSON.parse(updates.prescription);
      } catch {
        throw new Error('Prescription must be valid JSON');
      }
    }

    const { data, error } = await auth.supabase
      .from('consultations')
      .update(updates) // No updated_at in schema
      .eq('id', id)
      .select('id, doctor_email, patient_name, age, months, symptoms, last_checked, last_checked_id, observation, prescription, created_at')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating consultation ${id}:`, error.message);
    throw new Error(`Failed to update consultation: ${error.message}`);
  }
};

export const deleteConsultation = async (id) => {
  try {
    if (!id) throw new Error('Consultation ID is required');

    const { error } = await auth.supabase
      .from('consultations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting consultation ${id}:`, error.message);
    throw new Error(`Failed to delete consultation: ${error.message}`);
  }
};

export const getRecentConsultations = async (days = 7, doctorEmail = null) => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const dateString = date.toISOString();

    let query = auth.supabase
      .from('consultations')
      .select('id, doctor_email, patient_name, age, months, symptoms, last_checked, last_checked_id, observation, prescription, created_at')
      .gte('created_at', dateString)
      .order('created_at', { ascending: false });

    if (doctorEmail) query = query.eq('doctor_email', doctorEmail);

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent consultations:', error.message);
    throw new Error('Failed to fetch recent consultations. Please try again.');
  }
};