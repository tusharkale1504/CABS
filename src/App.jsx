import './App.css';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import DoctorHome from './pages/doctor-dashboard/doctor-home/DoctorHome';
import PatientHome from './pages/patient-dashboard/patient-home/PatientHome';
import MyAppointments from './pages/doctor-dashboard/my-appointments/MyAppointments'; 


function App() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register';

  return (
    <div className="app-container">
      {isAuthPage ? (
        <div className="main">
          <div className="info-container">
            <h1 className="app-title">
              MediConnect <span>Your Health, Our Priority</span>
            </h1>

            {/* 👇 Toggle Button Below Slogan */}
            <div className="auth-toggle-buttons">
              {location.pathname === '/login' ? (
                <p>
                  Don't have an account? <Link to="/register">Register</Link>
                </p>
              ) : (
                <p>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              )}
            </div>
          </div>

          <div className="form-container">
            <Routes>
              <Route path="/" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/doctor-dashboard" element={<DoctorHome />} />
          <Route path="/patient-dashboard" element={<PatientHome />} />
           <Route path="/appointments" element={<MyAppointments />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
