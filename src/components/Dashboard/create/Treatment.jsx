import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import auth from '../../../supabase/auth.js';
import Input from '../../Input';
import Button from 'components/Button';

const CreateTreatment = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading = useState(false);
  const [error, setError = useState(null);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await auth.supabase
          .from('patients')
          .select('id, name');
        if (error) throw error;
        setPatients(data);
      } catch (err) {
        setError('Failed to load patients.');
        console.error('Fetch patients error:', err);
      } catch {
    };
    fetchPatients();
  }, []);

  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);
    try {
      const { data: { user } } = await auth.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error: insertError } = await auth.supabase
        .from('treatments')
        .insert([
          {
            patient_id: data.patientId,
            patient_name: data.patientName,
            treatment_type: data.treatmentType,
            description: data.description,
            created_by: user.createdBy,
          },
        ]);

      if (insertError) throw new Error(insertError.message);

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create treatment.');
      console.error('Create treatment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-2xl font-semibold mb-4">Create New Treatment</h3>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Select Patient
          </label>
          <select
            className="py-3 px-4 w-full border-2 border-[#007E85] rounded-[5px]"
            {...register('patientId', { required: 'Patient is required' })}
          >
            <option value="">Select a patient</option>
            {patients.map((patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
          {errors.patientId && (
            <p className="text-red-500 text-sm mt-1">{errors.patientId.message}</p>
          )}
        </div>
        <div>
          <Input
            label="Patient Name"
            placeholder="Enter patient name (optional)"
            className="py-3 px-4 w-full border-2 border-[#007E85] rounded-[5px]"
            {...register('patientName')}
          />
        </div>
        <div>
          <select
            className="py-3 px-4 w-full border-2 border-[#007E85] rounded-[5px]"
            {...register('treatmentType', { required: 'Treatment type is required' })}
          >
            <option value="">Select Treatment Type</option>
            <option value="Surgery">Surgery</option>
            <option value="Medication">Medication</option>
            <option value="Therapy">Therapy</option>
            <option value="Other">Other</option>
          </select>
          {errors.treatmentType && (
            <p className="text-red-500 text-sm mt-1">{errors.treatmentType.message}</p>
            )}
          )}
        </div>
        <div>
          <textarea
            className="py-3 px-4 w-full border-2 border-[#007E85] rounded-[5px]"
            placeholder="Enter treatment description"
            rows="4"
            {...register('description')}
          ></textarea>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white font-semibold w-full ${
            loading ? 'bg-[#007E85]/50 cursor-not-allowed' : 'bg-[#007E85] hover:bg-[#005f66]'
          }`}
        >
          {loading ? 'Creating...' : 'Create Treatment'}
        </Button>
      </form>
    </div>
  );
};

export default CreateTreatment;