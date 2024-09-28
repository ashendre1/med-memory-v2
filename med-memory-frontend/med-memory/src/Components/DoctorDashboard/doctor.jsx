import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './doctor.css';
import { getPatientDetails } from '../../Api';

const DoctorDashboard = ({ user }) => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const retrievePatients =await getPatientDetails();
        setPatients(retrievePatients);
      } catch (error){
        console.error(' failed to retreive patients', error);
      }
    }
    
    fetchPatients();
  }, []);

  
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
              <h3>{patient.username}</h3>
              <p>Date of Birth: {patient.dob}</p>
              <p>Gender: {patient.gender}</p>
              <p>Blood Group: {patient.blood_group}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;