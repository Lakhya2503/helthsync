import React, { useEffect, useState } from 'react';
import auth from '../../supabase/auth';
import { useSelector } from 'react-redux';

const Consultation = () => {
  const user = useSelector((state) => state.auth.user);
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultation = async () => {
      if (!user?.email) return;

      try {
        const { data, error } = await auth.supabase
          .from('consultations')
          .select('*')
          .eq('doctor_email', user.email)
          .order('last_checked', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        if (data) {
          setConsultation({
            patient: data.patient_name,
            age: data.age,
            months: data.months,
            symptoms: data.symptoms || [],
            lastChecked: data.last_checked,
            lastCheckedId: data.last_checked_id,
            observation: data.observation,
            prescription: data.prescription || [],
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch consultation');
        console.error('Consultation fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [user]);

  const getInitials = (name) => {
    return name?.split(' ').map(word => word.charAt(0).toUpperCase()).join('') || '';
  };

  if (loading) return <div className="p-4 text-gray-600">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!consultation) return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Consultation</h2>
      <p className="text-gray-500">No recent consultations found.</p>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Consultation</h2>
        <select className="border border-gray-300 rounded p-1 text-sm">
          <option>Today</option>
        </select>
      </div>
      <div className="flex items-center space-x-4 mb-4">
        <div className="rounded-full bg-gray-100 h-12 w-12 flex items-center justify-center border-[.5px] border-blue-700 text-gray-600 font-semibold">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
            {getInitials(consultation.patient)}
          </div>
        </div>
        <div>
          <p className="text-gray-800 font-semibold">{consultation.patient}</p>
          <p className="text-sm text-gray-500">
            Male • {consultation.age} Years {consultation.months} Months
          </p>
        </div>
      </div>
      <div className="flex space-x-2 mb-4">
        {consultation.symptoms.map((symptom, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
          >
            {symptom}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-500 mb-2">
        Last Checked: {consultation.lastChecked}{' '}
        <span className="text-blue-500">{consultation.lastCheckedId}</span>
      </p>
      <p className="text-sm text-gray-700-semibold mb-2">
        <span className="font-semibold">Observation:</span>{' '}
        {consultation.observation}
      </p>
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Prescription:</p>
        <ul className="space-y-1 text-sm text-gray-700">
          {consultation.prescription.map((med, index) => (
            <li key={med.name + index}>
              {med.name} - {med.dosage}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Consultation;