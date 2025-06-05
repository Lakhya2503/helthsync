import React, { useEffect, useState } from 'react';
import auth from '../../supabase/auth';
import { useSelector } from 'react-redux';
import doctor_images from '../../assets/doctor_images';

const Visits = () => {
  const user = useSelector((state) => state.auth.user);
  const [visits, setVisits] = useState({
    total: 0,
    newPatients: 0,
    newPatientsPercentage: 0,
    oldPatients: 0,
    oldPatientsPercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisits = async () => {
    //   if (!user?.email) return;

      try {
        const { data, error } = await auth.supabase
          .from('appointments')
          .select('patient_name, created_at,patient_email')
          .eq('patient_email', user.email)
          .gte('appointment_date', new Date().toISOString().split('T')[0]);

        if (error) throw error;

        const total = data.length;
        const newPatients = data.filter(
          (appt) => new Date(appt.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length;
        const oldPatients = total - newPatients;
        setVisits({
          total,
          newPatients,
          newPatientsPercentage: total > 0 ? Math.round((newPatients / total) * 100) : 0,
          oldPatients,
          oldPatientsPercentage: total > 0 ? Math.round((oldPatients / total) * 100) : 0,
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch visits');
        console.error('Visits fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, [user]);

  if (loading) return <div className="p-4 text-gray-600">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="bg-gradient-to-r from-[#a4ced1] to-[#13868d] px-6 rounded-lg shadow-md flex items-center space-x-6">
      <div className="flex-1">
        <h2 className="text-3xl font-semibold text-gray-700 mb-2">Visits for Today</h2>
        <h4 className="text-4xl font-bold text-gray-800">{visits.total}</h4>
        <div className="flex space-x-4 mt-4">
          <div className="bg-teal-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">New Patients</p>
            <p className="text-xl font-semibold text-gray-800">{visits.newPatients}</p>
            <p className="text-sm text-green-500">{visits.newPatientsPercentage}% ↑</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Old Patients</p>
            <p className="text-xl font-semibold text-gray-800">{visits.oldPatients}</p>
            <p className="text-sm text-red-500">{visits.oldPatientsPercentage}% ↓</p>
          </div>
        </div>
      </div>
      <img src={doctor_images.Doctor_21} alt="" className="h-[280px] px-8 w-auto" />
    </div>
  );
};

export default Visits;