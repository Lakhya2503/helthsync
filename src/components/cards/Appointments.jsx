import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import auth from '../../supabase/auth';
import Input from '../Input';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaUserMd, 
  FaClock, 
  FaUser, 
  FaEnvelope, 
  FaChevronDown,
  FaPhone,
  FaCheckCircle
} from 'react-icons/fa';

const Appointments = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [specialties] = useState([
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'Dental Treatments',
    'Physiotherapy'
  ]);
  const [formData, setFormData] = useState({
    specialty: '',
    doctorId: '',
    date: '',
    time: '',
    name: '',
    email: '',
    // phone: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const authuser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        if (!authuser || !authuser.email) {
          navigate('/login');
          return;
        }

        let query = auth.supabase
          .from('doctors')
          .select('id, first_name, last_name, specialty')
          .order('created_at', { ascending: false });

        if (formData.specialty) {
          query = query.eq('specialty', formData.specialty);
        }

        const { data, error } = await query;

        if (error) throw error;
        setDoctors(data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch doctors.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [formData.specialty, authuser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'specialty' ? { doctorId: '' } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      // Validate required fields
      if (
        !formData.specialty ||
        !formData.doctorId ||
        !formData.date ||
        !formData.time ||
        !formData.name ||
        !formData.email 
        // !formData.phone
      ) {
        throw new Error('All fields are required.');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address.');
      }

      // Validate phone number
      // const phoneRegex = /^[0-9]{10,15}$/;
      // if (!phoneRegex.test(formData.phone)) {
      //   throw new Error('Please enter a valid phone number (10-15 digits).');
      // }

      // Validate appointment date (must be in the future)
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        throw new Error('Appointment date must be in the future.');
      }

      const { error } = await auth.supabase.from('appointments').insert([
        {
          doctor_id: formData.doctorId,
          appointment_date: formData.date,
          appointment_time: formData.time,
          patient_name: formData.name,
          patient_email: formData.email,
          // patient_phone: formData.phone,
          user_id: authuser?.id || null,
          specialty: formData.specialty,
          // status: 'scheduled'
        },
      ]);

      if (error) throw error;
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      // Reset form
      setFormData({
        specialty: '',
        doctorId: '',
        date: '',
        time: '',
        name: '',
        email: '',
        // phone: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to book appointment.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white p-8 rounded-t-2xl shadow-xl">
        <h3 className="text-3xl font-bold mb-2">Book an Appointment</h3>
        <p className="text-teal-100">Schedule your visit with our specialist doctors</p>
      </div>
      
      <div className="bg-white p-6 md:p-8 rounded-b-2xl shadow-lg border border-teal-100">
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
            <FaCheckCircle className="text-green-500 text-2xl flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-800">Appointment Booked Successfully!</h4>
              <p className="text-green-700 mt-1">
                You'll receive a confirmation email shortly. You can view your appointments in your dashboard.
              </p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Specialty Field */}
            <div className="relative">
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaUserMd className="mr-2 text-teal-600" />
                Medical Specialty
              </label>
              <div className="relative">
                <select
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"
                  required
                >
                  <option value="">Select a medical specialty</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserMd className="text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaChevronDown className="text-gray-400 text-sm" />
                </div>
              </div>
            </div>

            {/* Doctor Field */}
            <div className="relative">
              <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaUserMd className="mr-2 text-teal-600" />
                Select Doctor
              </label>
              <div className="relative">
                <select
                  id="doctorId"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"
                  disabled={!formData.specialty}
                  required
                >
                  <option value="">{formData.specialty ? "Select your doctor" : "Select a specialty first"}</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.first_name} {doctor.last_name} ({doctor.specialty})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserMd className="text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaChevronDown className="text-gray-400 text-sm" />
                </div>
              </div>
              {formData.specialty && doctors.length === 0 && (
                <p className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
                  No doctors available for this specialty. Please select another specialty.
                </p>
              )}
            </div>

            {/* Date Field */}
            <div className="relative">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaCalendarAlt className="mr-2 text-teal-600" />
                Appointment Date
              </label>
              <div className="relative">
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  min={getMinDate()}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Time Field */}
            <div className="relative">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaClock className="mr-2 text-teal-600" />
                Appointment Time
              </label>
              <div className="relative">
                <Input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  min="08:00"
                  max="18:00"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaClock className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Patient Name */}
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaUser className="mr-2 text-teal-600" />
                Your Full Name
              </label>
              <div className="relative">
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaEnvelope className="mr-2 text-teal-600" />
                Your Email Address
              </label>
              <div className="relative">
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Phone Field */}
            {/* <div className="relative">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaPhone className="mr-2 text-teal-600" />
                Phone Number
              </label>
              <div className="relative">
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(123) 456-7890"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
              </div>
            </div> */}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg ${
              isSubmitting ? 'bg-teal-700' : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Book Appointment Now'
            )}
          </Button>
        </form>
      </div>

      {/* Additional Information */}
      <div className="mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6 shadow-sm">
        <h4 className="font-bold text-teal-800 text-lg mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Appointment Information
        </h4>
        <ul className="text-teal-700 space-y-2 text-sm">
          <li>• Appointments are confirmed via email within 24 hours</li>
          <li>• Please arrive 15 minutes before your scheduled time</li>
          <li>• Bring your insurance card and identification</li>
          <li>• Cancellations require 24 hours notice</li>
        </ul>
        
        <div className="mt-4 pt-4 border-t border-teal-100">
          <h4 className="font-medium text-teal-800 mb-2">Need immediate assistance?</h4>
          <p className="text-sm text-teal-700">
            Call us at <a href="tel:+18005551234" className="font-semibold text-teal-800 hover:underline">(800) 555-1234</a> or email <a href="mailto:support@medicalclinic.com" className="font-semibold text-teal-800 hover:underline">support@medicalclinic.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Appointments;