import './App.css';
import React, {useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes , useNavigate} from 'react-router-dom';
import Login from './Components/Login/login.jsx';
import UserDashboard from './Components/UserDashboard/userdashboard.jsx';
import DoctorDashboard from './Components/DoctorDashboard/doctor.jsx';
import PatientHome from './Components/PatientHome/patienthome.jsx';
import { checkSession } from './Api';


const ProtectedRoute = ({ element: Component, ...rest }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const result = await checkSession();
        console.log('yellow ', result);
        if (result.status === 200) {
          setIsAuthenticated(true);
          setUser(result.user);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/');
      }
    };

    fetchSession();
  }, [navigate]);

  return isAuthenticated ? <Component {...rest} user={user} /> : null;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user" element={<ProtectedRoute element={UserDashboard} />} />
        <Route path="/doctor" element={<ProtectedRoute element={DoctorDashboard} />} />
      </Routes>
    </Router>
  );
}

export default App;