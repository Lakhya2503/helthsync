import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Phone, Calendar, MapPin, AlertCircle, ChevronDown } from 'lucide-react';
import auth from '../../../supabase/auth';
import { useSelector } from 'react-redux';

const PatientForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  
  const [formData, setFormData] = useState({
    unique_id: '',
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    address: '',
    disease_type: '',
    symptoms: '',
    treatment: '',
    status: 'Active',
    last_visit: '',
    next_appointment: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch patient data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchPatient = async () => {
        try {
          setLoading(true);
          const { data, error } = await auth.supabase
            .from('patients')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          if (data) {
            setFormData({
              unique_id: data.unique_id || '',
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || '',
              age: data.age || '',
              gender: data.gender || '',
              address: data.address || '',
              disease_type: data.disease_type || '',
              symptoms: data.symptoms || '',
              treatment: data.treatment || '',
              status: data.status || 'Active',
              last_visit: data.last_visit || '',
              next_appointment: data.next_appointment || '',
              notes: data.notes || ''
            });
          }
        } catch (err) {
          setError(err.message || 'Failed to fetch patient data');
        } finally {
          setLoading(false);
        }
      };

      fetchPatient();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generatePatientId = () => {
    const prefix = 'PAT';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randomNum}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Generate unique ID if creating new patient
      const patientData = isEditMode 
        ? formData 
        : { ...formData, unique_id: generatePatientId(), user_id: user.id };

      const { error } = isEditMode
        ? await auth.supabase
            .from('patients')
            .update(patientData)
            .eq('id', id)
        : await auth.supabase
            .from('patients')
            .insert([patientData]);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => navigate('/dashboard/patients'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to save patient record');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#007E85]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-[#007E85] hover:text-[#005f66] mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          {isEditMode ? 'Edit Patient Record' : 'Create New Patient'}
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg flex items-start text-red-600 mb-6">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium">Error</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 p-4 rounded-lg flex items-start text-green-600 mb-6">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium">Success</h3>
            <p className="text-sm">
              Patient record {isEditMode ? 'updated' : 'created'} successfully. Redirecting...
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <User className="h-5 w-5 mr-2 text-[#007E85]" />
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                value={formData.unique_id}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  min="0"
                  max="120"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <div className="relative">
                  <select
                    name="gender"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85] appearance-none"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-[#007E85]" />
              Contact Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="address"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-[#007E85]" />
              Medical Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition/Disease*</label>
              <input
                type="text"
                name="disease_type"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                value={formData.disease_type}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
              <textarea
                name="symptoms"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                value={formData.symptoms}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Plan*</label>
              <textarea
                name="treatment"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                value={formData.treatment}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Status & Appointments */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-[#007E85]" />
              Status & Appointments
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="relative">
                <select
                  name="status"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85] appearance-none"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Chronic">Chronic</option>
                  <option value="Recovered">Recovered</option>
                  <option value="Critical">Critical</option>
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Visit</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                    value={formData.last_visit}
                    onChange={(e) => handleDateChange('last_visit', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Appointment</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                    value={formData.next_appointment}
                    onChange={(e) => handleDateChange('next_appointment', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#007E85] text-white rounded-lg hover:bg-[#005f66] flex items-center gap-2"
            disabled={loading}
          >
            <Save className="h-5 w-5" />
            {loading ? 'Saving...' : 'Save Patient'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;