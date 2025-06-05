import React, { useState } from 'react';
import doctor_images from '../../assets/doctor_images/index';
import Input from '../Input';
import Button from '../Button';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../supabase/authService'; // Import singleton
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const user = await authService.signin({
        email: data.email,
        password: data.password,
      });

      if (user) {
        navigate('/'); // Redirect to home on success
      } else {
        setError(authService.getStatus().error || 'Login failed.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const user = useSelector((state) => state.auth.user);
  console.log('Logged in user:', user);

  const authStatus = useSelector((state) => state.auth.isAuthenticated);
  console.log(authStatus);

  return (
    <div className="flex py-5 px-20 h-fit items-center gap-[3rem] rounded-2xl justify-center w-fit mx-auto my-10 bg-violet-500">
      <div className="w-fit">
        <img
          src={doctor_images.Login_Dc}
          className="h-[40rem] w-[30vw] object-cover"
          style={{
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 40%)',
            maskImage: 'linear-gradient(to top, transparent 0%, black 40%)',
          }}
        />
      </div>

      <div className="flex flex-col items-center justify-center w-[25vw] h-[28rem] rounded-2xl bg-white gap-3">
        <h3 className="text-3xl">Login</h3>
        <p>
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-500 underline">
            Sign up
          </Link>
        </p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="w-full flex flex-col gap-3 py-8 px-8" onSubmit={handleSubmit(onSubmit)}>
          <Input
            className="py-3 px-3 w-full border-2 border-[#007E85] rounded-[5px]"
            label="Email"
            placeholder="example@gmail.com"
            type="email"
            {...register('email', { required: true })}
          />
          <Input
            className="py-3 px-3 w-full border-2 border-[#007E85] rounded-[5px]"
            label="Password"
            placeholder="Password"
            type="password"
            {...register('password', { required: true })}
          />

          <Button
            className="bg-blue-500 hover:bg-blue-600 transition-all duration-200 w-full py-3 mt-3 rounded-[5px] text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;