import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import auth from '../../supabase/auth';
import DocMembers from '../cards/DocMemberCard';

const DoctorList = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const authuser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        if (!authuser || !authuser.email) {
          navigate('/login');
          return;
        }

        const { data, error } = await auth.supabase
          .from('doctors')
          .select('id, first_name, last_name, email, phone_number, specialty, profile_image, created_at, description')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setDoctors(data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch doctors. Please check your permissions or table setup.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [authuser, navigate]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      <span className="ml-4 text-gray-600">Loading doctors...</span>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-6 bg-red-50 rounded-lg shadow-md">
      <div className="text-red-600 font-medium mb-4">Error: {error}</div>
      <button
        onClick={() => navigate('/dashboard/doctors/create')}
        className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg"
      >
        + Create a Doctor
      </button>
    </div>
  );

  if (doctors.length === 0) return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-md text-center">
      <div className="text-gray-500 mb-6 text-lg">No doctors found in the database.</div>
      <button
        onClick={() => navigate('/dashboard/doctors/create')}
        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg font-medium"
      >
        + Add New Doctor
      </button>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Our Medical Team</h1>
          <button
            onClick={() => navigate('/dashboard/doctors/create')}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg"
          >
            + Add Doctor
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <div 
              key={doctor.id} 
              className="transform hover:scale-105 transition-transform duration-200"
            >
              <DocMembers {...doctor} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorList;