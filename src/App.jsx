import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import authService from './supabase/authService'; // Import singleton
import Navbar from './components/Navbar';
import Signup from './components/auth/SignUp';
import Login from './components/auth/Login';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Service from './pages/Service';
import ContactUs from './pages/ContactUs';
import Help from './pages/Help';
import Bloges from './pages/Bloges';
import Dashboard from './pages/Dashboard';
import Home from './components/Dashboard/DashboardHome';
import SmallCalendar from './components/Dashboard/SmallCalendar';
import Message from './components/Dashboard/Blogs';
import Setting from './components/Dashboard/Setting';
import Doctors from './components/Dashboard/Doctors';
import CreateDoctor from './components/Dashboard/CreatDoctor';
import Bloge from './components/cards/Bloge';
import CreateBlogPost from './components/creat/CreateBlogPost';
import ConsultationForm from './components/Dashboard/create/ConsultationForm';
import EventForm from './components/Dashboard/create/EventForm';
import NewsForm from './components/Dashboard/create/NewsForm';
import AppointmentForm from './components/cards/Appointments';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PatientForm from './components/Dashboard/create/PatientForm';
import DashboardHome from './components/Dashboard/DashboardHome';
import TermsAndConditions from './components/cards/TermsAndCondition';
import ConsultationsList from './components/Dashboard/ConsultationsList'
import NewsList from './components/Dashboard/NewsList';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isLogin = location.pathname.startsWith('/login');
  const isSignup = location.pathname.startsWith('/signup');

  useEffect(() => {
    console.log('AuthService already initialized via singleton');
  }, [dispatch]);

  return (
    <div className="bg-[#ECECEC] min-h-screen flex flex-col">
      {!isDashboard && !isLogin && !isSignup && <Navbar />}
      <div className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/appointment/doctorId/:id" element={<AppointmentForm />} />
          <Route path="/service" element={<Service />} />
          <Route path="/contact-us" element={<ContactUs />} >
          </Route>
          <Route path="/contact-us/terms" element={<TermsAndConditions />} />
          <Route path="/help" element={<Help />} />
          <Route path="/blogs" element={<Bloges />} />
          <Route path="/blog/:id" element={<Bloge />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-blog" element={<ProtectedRoute><CreateBlogPost /></ProtectedRoute>} />
          <Route path="/dashboard/patients/new" element={<PatientForm />} />
          <Route path="/dashboard/patients/:id" element={<PatientForm />} />

          {/* <Route path="/dashboard/home/consultations" element={<ConsultaionList />} /> */}
            <Route path="/"  />

          {/* Dashboard routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="home/consultaion" element={<ConsultationForm />} />

          <Route path="event/new" element={<EventForm />} />
          <Route path="home/news" element={<NewsForm />} />




            <Route path="calendar" element={<SmallCalendar />} />
            <Route path="message" element={<Message />} />
            <Route path="setting" element={<Setting />} />


            <Route path="doctors" element={<Doctors />} />
            <Route path="doctors/create" element={<CreateDoctor />} />
          </Route>
          <Route  path='/consultations'   element={<ConsultationsList/>}/> 
          <Route  path='/news'   element={<NewsList/>}/> 
        </Routes>
      </div>
      {!isDashboard && !isLogin && !isSignup && <Footer />}
    </div>
  );
}

export default App;

