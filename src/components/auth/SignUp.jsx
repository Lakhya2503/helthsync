import React, { useState } from 'react';
import doctor_images from '../../assets/doctor_images/index';
import Input from '../Input';
import Button from '../Button';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../supabase/authService'; // Import singleton
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { handleSubmit, register } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const user = await authService.signup({
        name: data.name,
        email: data.email,
        password: data.password,
        avatar_url: data.avatar || '', // Default to empty string if avatar is not provided
      });

      if (user) {
        navigate('/login'); // Redirect to login on success
      } else {
        setError(authService.getStatus().error || 'Signup failed.');
      }

      console.log('SignUp result:', user);
    } catch (error) {
      setError(error.message || 'An error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  const userdata = useSelector((state) => state.auth);
  console.log('Auth state:', userdata);

  return (
    <div className="flex py-5 px-20 h-fit items-center gap-[3rem] rounded-2xl justify-center w-fit mx-auto my-10 bg-fuchsia-500">
      <div className="w-fit">
        <img
          src={doctor_images.Signup_Dc}
          alt="Doctor"
          className="h-[40rem] w-[30vw] object-cover"
          style={{
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 40%)',
            maskImage: 'linear-gradient(to top, transparent 0%, black 40%)',
          }}
        />
      </div>

      <div className="flex flex-col items-center justify-center w-[25vw] rounded-2xl h-[38rem] bg-white gap-3">
        <h3 className="text-3xl">Signup</h3>
        <p>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 underline">
            Login
          </Link>
        </p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="w-full flex flex-col gap-3 px-8" onSubmit={handleSubmit(onSubmit)}>
          <Input
            className="py-3 px-3 w-full border-2 border-[#007E85] rounded-[5px]"
            label="Name"
            placeholder="Enter your Name"
            type="text"
            {...register('name', { required: 'Name is required' })}
          />
          <Input
            className="py-3 px-3 w-full border-2 border-[#007E85] rounded-[5px]"
            label="Email"
            placeholder="example@gmail.com"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: 'Email address must be valid',
              },
            })}
          />
          <Input
            className="py-3 px-3 w-full border-2 border-[#007E85] rounded-[5px]"
            label="Password"
            placeholder="Password"
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          <Input
            className="py-3 px-3 w-full border-2 border-[#007E85] rounded-[5px]"
            label="Avatar URL"
            placeholder="Image URL (optional)"
            type="text"
            {...register('avatar')}
          />
          <Button
            className="bg-blue-500 hover:bg-blue-600 transition-all duration-200 w-full py-3 mt-3 rounded-[5px] text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Signup'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;