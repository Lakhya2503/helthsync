import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import auth from '../../supabase/auth';
import Input from '../Input';
import Button from '../Button';

const CreateDoctor = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      specialty: '',
      description: '',
      profileImageUrl: '',
      isAvailable: true,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const validateUrl = (url) => {
    if (!url) return true; // Allow empty URL
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))$/i;
    return urlPattern.test(url) || 'Invalid image URL (e.g., https://example.com/image.jpg)';
  };

  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);
    try {
      const { data: { user } } = await auth.supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user found. Please log in.');
      }

      const { error: insertError } = await auth.supabase
        .from('doctors')
        .insert([
          {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone_number: data.phoneNumber,
            specialty: data.specialty,
            description: data.description,
            profile_image: data.profileImageUrl || null,
            is_available: data.isAvailable,
          },
        ]);

      if (insertError) {
        throw new Error(`Doctor insertion failed: ${insertError.message}`);
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create doctor. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create a New Doctor</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            className="py-3 px-4 w-full border-2 border-[#007E85] rounded-[5px]"
            placeholder="First Name"
            {...register('firstName', { required: 'First name is required' })}
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <Input
            className="py-3 px-4 w-full border-2 border-[#007E85] rounded-[5px]"
            placeholder="Last Name"
            {...register('lastName', { required: 'Last name is required' })}
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
        </div>
        <div>
          <Input
            className="py-3 px-4 w-full border-2 border-[#007E85] rounded-[5px]"
            placeholder="Email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: 'Invalid email format',
              },
            })}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Input
            className="py-3 px-4 w-full border-2 border-[#007E85] rounded-[5px]"
            placeholder="Phone Number"
            {...register('phoneNumber', { required: 'Phone number is required' })}
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
        </div>
        <div>
          <Input
            className="py-3 px-4 w-full border-2 border-[#007E85] rounded-[5px]"
            placeholder="Specialty (e.g., Cardiology)"
            {...register('specialty', { required: 'Specialty is required' })}
          />
          {errors.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty.message}</p>}
        </div>
        <div>
          <textarea
            className="py-3 px-4 w-full border-2 border-[#007E85] rounded-[5px]"
            placeholder="Description"
            rows="4"
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>
        <div>
          <Input
            className="py-3 px-4 w-full border-2 border-[#007E85] rounded-[5px]"
            placeholder="Profile Image URL (Optional)"
            {...register('profileImageUrl', { validate: validateUrl })}
          />
          {errors.profileImageUrl && <p className="text-red-500 text-sm mt-1">{errors.profileImageUrl.message}</p>}
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-gray-700">Available</label>
          <button
            type="button"
            onClick={() => setValue('isAvailable', !getValues('isAvailable'))}
            className={`w-16 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
              getValues('isAvailable') ? 'bg-[#007E85]' : 'bg-gray-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transform transition-transform duration-300 ${
                getValues('isAvailable') ? 'translate-x-8' : 'translate-x-0'
              }`}
            ></div>
          </button>
          <input type="hidden" {...register('isAvailable')} />
        </div>
        <div className="flex space-x-4">
          <Button
            type="submit"
            className="bg-[#007E85] hover:bg-[#005f66] text-white py-3 px-6 rounded-[5px] transition-colors duration-200 font-semibold"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Create Doctor'}
          </Button>
          <Button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-transparent border-2 border-[#007E85] text-[#007E85] hover:bg-[#007E85] hover:text-white py-3 px-6 rounded-[5px] transition-colors duration-200 font-semibold"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateDoctor;