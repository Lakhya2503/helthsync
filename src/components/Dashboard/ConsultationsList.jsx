import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getConsultations, deleteConsultation, createConsultation } from '../../supabase/service/consultationService';
import { useNavigate, useLocation } from 'react-router-dom';

const ConsultationsList = () => {
  const location = useLocation();
  const isConsultationPage = location.pathname.startsWith('/consultations');
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  
  // State management
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorEmailFilter, setDoctorEmailFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    patient_name: '',
    age: '',
    months: '',
    symptoms: '',
    last_checked: new Date().toISOString().split('T')[0],
    observation: '',
    prescription: [{ name: '', dosage: '' }],
  });

  // Fetch consultations with filters
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const options = {
          patientName: searchTerm,
          doctorEmail: doctorEmailFilter
        };
        const data = await getConsultations(options);
        setConsultations(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [searchTerm, doctorEmailFilter]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrescriptionChange = (index, field, value) => {
    const updated = [...formData.prescription];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, prescription: updated }));
  };

  const addPrescription = () => {
    setFormData(prev => ({
      ...prev,
      prescription: [...prev.prescription, { name: '', dosage: '' }],
    }));
  };

  const removePrescription = (index) => {
    setFormData(prev => ({
      ...prev,
      prescription: prev.prescription.filter((_, i) => i !== index),
    }));
  };

  // CRUD operations
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this consultation?')) {
      try {
        await deleteConsultation(id);
        setConsultations(consultations.filter(c => c.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const consultation = {
        doctor_email: user.email,
        patient_name: formData.patient_name,
        age: parseInt(formData.age),
        months: parseInt(formData.months),
        symptoms: formData.symptoms.split(',').map(s => s.trim()),
        last_checked: formData.last_checked,
        observation: formData.observation,
        prescription: JSON.stringify(formData.prescription.filter(med => med.name)),
      };

      const newConsultation = await createConsultation(consultation);
      setConsultations([newConsultation, ...consultations]);
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save consultation');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      patient_name: '',
      age: '',
      months: '',
      symptoms: '',
      last_checked: new Date().toISOString().split('T')[0],
      observation: '',
      prescription: [{ name: '', dosage: '' }],
    });
  };

  // Loading state
  if (loading && !showForm) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#007E85]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#007E85]">Patient Consultations</h1>
          <p className="text-gray-600 mt-1">
            {consultations.length} {consultations.length === 1 ? 'record' : 'records'} found
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showForm 
                ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                : 'bg-[#007E85] text-white hover:bg-[#00666B]'
            }`}
          >
            {showForm ? '← Back to List' : '+ New Consultation'}
          </button>

          {!isConsultationPage && (
            <button 
              className="px-4 py-2 bg-white text-[#007E85] border border-[#007E85] rounded-lg hover:bg-[#007E85]/10 font-medium transition-colors"
              onClick={() => navigate('/consultations')}
            >
              View All Records
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)} 
            className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-md hover:bg-red-100 text-red-500"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {showForm ? (
        /* Consultation Form */
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-[#007E85]/20 mb-8">
          <div className="bg-[#007E85] p-6">
            <h2 className="text-xl font-semibold text-white">New Patient Consultation</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#007E85] focus:border-[#007E85]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#007E85] focus:border-[#007E85]"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Months</label>
                  <input
                    type="number"
                    name="months"
                    value={formData.months}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#007E85] focus:border-[#007E85]"
                    min="0"
                    max="11"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Checked Date</label>
                <input
                  type="date"
                  name="last_checked"
                  value={formData.last_checked}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#007E85] focus:border-[#007E85]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms (comma separated)</label>
                <input
                  type="text"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#007E85] focus:border-[#007E85]"
                  placeholder="Fever, Headache, Cough"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Observations</label>
              <textarea
                name="observation"
                value={formData.observation}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#007E85] focus:border-[#007E85]"
                required
              />
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Prescription</label>
                <button
                  type="button"
                  onClick={addPrescription}
                  className="text-sm text-[#007E85] hover:text-[#00666B] font-medium"
                >
                  + Add Medication
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.prescription.map((med, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Medication name"
                      value={med.name}
                      onChange={(e) => handlePrescriptionChange(index, 'name', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#007E85] focus:border-[#007E85]"
                    />
                    <input
                      type="text"
                      placeholder="Dosage"
                      value={med.dosage}
                      onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#007E85] focus:border-[#007E85]"
                    />
                    {formData.prescription.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePrescription(index)}
                        className="p-2 text-gray-500 hover:text-red-500 rounded-full"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#007E85] text-white rounded-lg hover:bg-[#00666B] disabled:opacity-70 flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Consultation'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Consultations List */
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#007E85]/20">
          {/* Filters */}
          <div className="p-6 border-b border-[#007E85]/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#007E85] mb-1">Search Patients</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by patient name..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#007E85] focus:border-[#007E85]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#007E85] mb-1">Filter by Doctor</label>
                <input
                  type="text"
                  placeholder="Filter by doctor email..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#007E85] focus:border-[#007E85]"
                  value={doctorEmailFilter}
                  onChange={(e) => setDoctorEmailFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Empty State */}
          {consultations.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No consultations found</h3>
              <p className="mt-1 text-gray-500">Get started by creating a new patient consultation.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-[#007E85] text-white rounded-lg hover:bg-[#00666B]"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Consultation
                </button>
              </div>
            </div>
          ) : (
            /* Consultations Table */
            <ul className="divide-y divide-[#007E85]/10">
              {consultations.map((consultation) => (
                <li key={consultation.id} className="hover:bg-[#007E85]/05 transition-colors">
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#007E85]/10 flex items-center justify-center text-[#007E85] font-medium">
                          {consultation.patient_name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-[#007E85]">
                            {consultation.patient_name}
                            <span className="ml-2 text-sm font-normal text-gray-500">
                              ({consultation.age}y {consultation.months}m)
                            </span>
                          </h3>
                          <p className="text-sm text-gray-500">
                            {consultation.doctor_email}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(consultation.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {Array.isArray(consultation.symptoms) ? (
                          consultation.symptoms.map((symptom, i) => (
                            <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#007E85]/10 text-[#007E85]">
                              {symptom}
                            </span>
                          ))
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#007E85]/10 text-[#007E85]">
                            {consultation.symptoms}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2">
                        <span className="font-medium">Observation:</span> {consultation.observation}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => handleDelete(consultation.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        Delete
                      </button>
                      {/* <button
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Edit
                      </button> */}
                      <button
                        onClick={() => {/* View details logic */}}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-[#007E85] hover:bg-[#00666B]"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsultationsList;