import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import auth from '../../supabase/auth';
import Input from '../Input';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';

const DoctorSearch = () => {
  const navigate = useNavigate()
  const [isAvailable, setIsAvailable] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm();

  // Specialty options with common medical specialties
  const specialties = [
    { value: '', label: 'All Specialties' },
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Dermatology', label: 'Dermatology' },
    { value: 'Endocrinology', label: 'Endocrinology' },
    { value: 'Family Medicine', label: 'Family Medicine' },
    { value: 'Gastroenterology', label: 'Gastroenterology' },
    { value: 'Neurology', label: 'Neurology' },
    { value: 'Obstetrics/Gynecology', label: 'OB/GYN' },
    { value: 'Oncology', label: 'Oncology' },
    { value: 'Ophthalmology', label: 'Ophthalmology' },
    { value: 'Orthopedics', label: 'Orthopedics' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Psychiatry', label: 'Psychiatry' },
    { value: 'Pulmonology', label: 'Pulmonology' },
    { value: 'Rheumatology', label: 'Rheumatology' },
    { value: 'Urology', label: 'Urology' },
  ];

  const onSubmit = async (searchData) => {
    setSearchLoading(true);
    setError('');
    setSearchResults([]);

    try {
      // Base query for available doctors
      let query = auth.supabase
        .from('doctors')
        .select(`
          id,
          first_name,
          last_name,
          specialty,
          description,
          profile_image,
          is_available,
          email,
          phone_number
        `)
        .eq('is_available', isAvailable)
        .order('last_name', { ascending: true });

      // Add name filter if provided
      if (searchData.name) {
        query = query.or(
          `first_name.ilike.%${searchData.name}%,last_name.ilike.%${searchData.name}%`
        );
      }

      // Add specialty filter if selected
      if (searchData.specialty) {
        query = query.eq('specialty', searchData.specialty);
      }

      const { data: doctors, error: queryError } = await query;

      if (queryError) throw queryError;

      setSearchResults(doctors || []);

      if (!doctors?.length) {
        setError('No doctors found matching your criteria. Try broadening your search.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while searching for doctors.');
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Find a Doctor</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Doctor Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Search by name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                {...register('name')}
              />
            </div>

            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                Specialty
              </label>
              <select
                id="specialty"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                {...register('specialty')}
              >
                {specialties.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">{isAvailable ? 'Available' : 'All'}</span>
                  <button
                    type="button"
                    onClick={() => setIsAvailable(!isAvailable)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isAvailable ? 'bg-teal-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isAvailable ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
                disabled={searchLoading}
              >
                {searchLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </span>
                ) : (
                  'Search Doctors'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {searchResults.length > 0 ? (
          <>
            <h2 className="text-xl font-semibold text-gray-800">
              {searchResults.length} {searchResults.length === 1 ? 'Doctor' : 'Doctors'} Found
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      {doctor.profile_image ? (
                        <img
                          src={doctor.profile_image}
                          alt={`Dr. ${doctor.first_name} ${doctor.last_name}`}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center">
                          <span className="text-teal-600 text-xl font-bold">
                            {doctor.first_name.charAt(0)}{doctor.last_name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Dr. {doctor.first_name} {doctor.last_name}
                        </h3>
                        <p className="text-teal-600 font-medium">{doctor.specialty}</p>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          doctor.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {doctor.is_available ? 'Available' : 'Not Available'}
                        </div>
                      </div>
                    </div>
                    {doctor.description && (
                      <p className="mt-4 text-gray-600 text-sm line-clamp-3">
                        {doctor.description}
                      </p>
                    )}
                    <div className="mt-4 space-y-2">
                      {doctor.phone_number && (
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          {doctor.phone_number}
                        </div>
                      )}
                      {doctor.email && (
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          {doctor.email}
                        </div>
                      )}
                    </div>
                    <div className="mt-6">
                      <Button
                        className="w-full py-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700"
                        onClick={() => {
                          // Handle booking/appointment logic
                          navigate('./service')
                          console.log('Book appointment with', doctor.id);

                        }}
                      >
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No doctors found</h3>
            <p className="mt-1 text-gray-500">
              {error || 'Try adjusting your search filters to find what you\'re looking for.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;