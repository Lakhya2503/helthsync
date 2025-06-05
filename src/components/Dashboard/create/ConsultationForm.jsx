import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import auth from '../../../supabase/auth';
import { v4 as uuidv4 } from 'uuid';

const ConsultationForm = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
// Add import at top

// Update initial state
const [formData, setFormData] = useState({
  patient_name: '',
  age: '',
  months: '',
  symptoms: '',
  last_checked: new Date().toISOString().split('T')[0],
  // last_checked_id: uuidv4(), // Proper UUID here
  observation: '',
  prescription: [{ name: '', dosage: '' }],
});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrescriptionChange = (index, field, value) => {
    const updatedPrescription = [...formData.prescription];
    updatedPrescription[index][field] = value;
    setFormData((prev) => ({ ...prev, prescription: updatedPrescription }));
  };

  const addPrescription = () => {
    setFormData((prev) => ({
      ...prev,
      prescription: [...prev.prescription, { name: '', dosage: '' }],
    }));
  };

  const removePrescription = (index) => {
    setFormData((prev) => ({
      ...prev,
      prescription: prev.prescription.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const { error } = await auth.supabase.from('consultations').insert({
        doctor_email: user.email,
        patient_name: formData.patient_name,
        age: parseInt(formData.age),
        months: parseInt(formData.months),
        symptoms: formData.symptoms.split(',').map((s) => s.trim()),
        last_checked: formData.last_checked,
        last_checked_id: formData.last_checked_id,
        observation: formData.observation,
        prescription: formData.prescription.filter((med) => med.name),
      });

      if (error) throw error;
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Failed to save consultation');
      console.error('ConsultationForm error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">New Consultation</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Patient Name</label>
            <input
              type="text"
              name="patient_name"
              value={formData.patient_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">Age (Years)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">Months</label>
              <input
                type="number"
                name="months"
                value={formData.months}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
                max="11"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Symptoms (comma-separated)</label>
            <input
              type="text"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Fever, Cough"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Last Checked</label>
            <input
              type="date"
              name="last_checked"
              value={formData.last_checked}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Observation</label>
            <textarea
              name="observation"
              value={formData.observation}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Prescription</label>
            {formData.prescription.map((med, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Medication Name"
                  value={med.name}
                  onChange={(e) => handlePrescriptionChange(index, 'name', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={med.dosage}
                  onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.prescription.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePrescription(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPrescription}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Medication
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save Consultation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsultationForm;