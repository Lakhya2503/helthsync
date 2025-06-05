import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import auth from '../../supabase/auth';
import DocMemberCard from './DocMemberCard';
import { PulseLoader } from 'react-spinners';
import { FaPlus, FaSearch } from 'react-icons/fa';

const TeamMembers = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSpecialty, setFilteredSpecialty] = useState('all');
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
          .select('id, first_name, last_name, email, phone_number, specialty, profile_image, description, created_at')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setDoctors(data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch doctors.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [authuser, navigate]);

  // Get unique specialties for filter dropdown
  const specialties = ['all', ...new Set(doctors.map(doctor => doctor.specialty).filter(Boolean))];

  // Filter doctors based on search and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.specialty && doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty = filteredSpecialty === 'all' || doctor.specialty === filteredSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 w-full gap-8 bg-gradient-to-b from-teal-50 to-white">
      <div className="flex flex-col items-center w-full gap-4 max-w-6xl">
        <div className="text-center">
          <h3 className="text-4xl font-bold text-teal-800 mb-2">Our Expert Doctors</h3>
          <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
        </div>
        <p className="text-center text-lg text-teal-700 max-w-3xl">
          Meet our team of dedicated medical professionals providing top-quality care across various specialties
        </p>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl mt-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-teal-600" />
            </div>
            <input
              type="text"
              placeholder="Search by name or specialty..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select
              className="w-full px-4 py-3 rounded-lg border border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white shadow-sm appearance-none pl-10"
              value={filteredSpecialty}
              onChange={(e) => setFilteredSpecialty(e.target.value)}
            >
              <option value="all">All Specialties</option>
              {specialties.filter(spec => spec !== 'all').map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/dashboard/doctors/create')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <FaPlus /> Add Doctor
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <PulseLoader color="#007E85" size={15} />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-6 text-center max-w-2xl p-6 bg-red-50 rounded-xl border border-red-100">
          <div className="text-red-600">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="mt-4 text-xl font-medium">{error}</p>
          </div>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="flex flex-col items-center gap-6 text-center max-w-2xl p-8 bg-amber-50 rounded-xl border border-amber-100">
          <svg className="w-16 h-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="text-xl font-semibold text-amber-700">No matching doctors found</h4>
          <p className="text-amber-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl px-4">
          {filteredDoctors.map((doctor) => (
            <DocMemberCard key={doctor.id} {...doctor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamMembers;