import React from 'react';
import { useNavigate } from 'react-router-dom';
import './doctor.css';

const DoctorDashboard = ({ user }) => {
  //const navigate = useNavigate();
  // const handleLogout = async () => {
  //   try {
  //     await fetch('http://localhost:9090/logout', {
  //       method: 'POST',
  //       credentials: 'include' // Include cookies in the request
  //     });
  //     navigate('/');
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  const patients = [
    { id: 1, name: 'John Doe', age: 30, condition: 'Flu' },
    { id: 2, name: 'Jane Smith', age: 25, condition: 'Cold' },
    { id: 3, name: 'Sam Johnson', age: 40, condition: 'Diabetes' },
    { id: 4, name: 'Alice Brown', age: 35, condition: 'Hypertension' }
  ];

  return (
    <div className="dashboard-container">
      <header>
        <h1>Doctor Dashboard {user}</h1>
      </header>
      <main>
        <h2>Patients</h2>
        <div className="patient-cards">
          {patients.map(patient => (
            <div key={patient.id} className="patient-card">
              <h3>{patient.name}</h3>
              <p>Age: {patient.age}</p>
              <p>Condition: {patient.condition}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;