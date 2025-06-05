import React, { useState } from 'react';
import doctor_images from '../../assets/doctor_images/index';
import Input from '../Input';
import Button from '../Button';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../../supabase/authService';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { handleSubmit, register } = useForm()
    const dispatch = useDispatch()
    const authService = new AuthService(dispatch)
    const navigate = useNavigate()

    const onSubmit = async function (data) {
        setError('')
        setLoading(true)
        try {
            const user = await authService.login({
                email: data.email,
                password: data.password,
            });

            if (user) {
                navigate('/dashboard'); // Redirect to dashboard or home page after login
            } else {
                setError(authService.getStatus().error || 'Login failed.');
            }

        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const userdata = useSelector(state => state.auth);
    console.log('Logged in user:', userdata);

    return (
        <div className="flex py-5 px-20 h-fit items-center gap-[3rem] rounded-2xl justify-center w-fit mx-auto my-10 bg-fuchsia-500">
            <div className="w-fit">
                <img
                    src={doctor_images.Login_Dc} // You might want to use a different image for login
                    alt="Doctor"
                    className="h-[40rem] w-[30vw] object-cover"
                    style={{
                        WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 40%)',
                        maskImage: 'linear-gradient(to top, transparent 0%, black 40%)',
                    }}
                />
            </div>

            <div className="flex flex-col items-center justify-center w-[25vw] rounded-2xl h-[38rem] bg-white gap-3">
                <h3 className="text-3xl">Login</h3>
                <p>
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-500 underline">
                        Sign Up
                    </Link>
                </p>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <form
                    className="w-full flex flex-col gap-3 px-8"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Input
                        className="py-3 px-3 w-full border-2 border-[#007E85] rounded-[5px]"
                        label="Email"
                        placeholder="example@gmail.com"
                        type="email"
                        {...register('email', {
                            required: true,
                            validate: {
                                matchPattern: (value) =>
                                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    'Email address must be valid',
                            },
                        })}
                    />
                    <Input
                        className="py-3 px-3 w-full border-2 border-[#007E85] rounded-[5px]"
                        label="Password"
                        placeholder="Password"
                        type="password"
                        {...register('password', { required: true })}
                    />
                    <div className="flex justify-end">
                        <Link to="/forgot-password" className="text-blue-500 underline text-sm">
                            Forgot Password?
                        </Link>
                    </div>
                    <Button
                        className="bg-blue-500 hover:bg-blue-600 transition-all duration-200 w-full py-3 mt-3 rounded-[5px] text-white"
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




[
    {
        "first_name": "Alex",
        "last_name": "Monroe",
        "email": "alex.monroe@gmail.com",
        "phone_number": "+1 123 456 7890",
        "specialty": "Cardiology",
        "description": "A dedicated cardiologist with a passion for heart health and patient care.",
        "profile_image_url": "https://example.com/alex-monroe.jpg"
    },
    {
        "first_name": "Sophia",
        "last_name": "Patel",
        "email": "sophia.patel@gmail.com",
        "phone_number": "+1 987 654 3210",
        "specialty": "Neurology",
        "description": "Expert in neurological disorders and brain health. Loves research and innovative treatments.",
        "profile_image_url": "https://example.com/sophia-patel.jpg"
    },
    {
        "first_name": "David",
        "last_name": "Kim",
        "email": "david.kim@gmail.com",
        "phone_number": "+1 456 789 0123",
        "specialty": "Pediatrics",
        "description": "Committed to children's health and well-being. Known for his friendly approach.",
        "profile_image_url": "https://example.com/david-kim.jpg"
    }
]