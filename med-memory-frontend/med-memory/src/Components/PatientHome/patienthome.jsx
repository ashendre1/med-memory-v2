import React, { useState } from 'react';
import './patienthome.css';

const PatientHome = ()  => {
  const [activeSection, setActiveSection] = useState('graph');

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logout clicked');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'graph':
        return <div>Graph Content</div>;
      case 'uploadReports':
        return <div>Upload Reports Content</div>;
      case 'currentPrescription':
        return <div>Current Prescription Content</div>;
      case 'addDoctors':
        return <div>Add Doctors Content</div>;
      default:
        return <div>Graph Content</div>;
    }
  };

  return (
    <div className="patient-home-container">
      <header>
        <div className="header-content">
          <span>Welcome user</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <div className="main-content">
        <aside>
          <button onClick={() => setActiveSection('graph')}>Graph</button>
          <button onClick={() => setActiveSection('uploadReports')}>Upload Reports</button>
          <button onClick={() => setActiveSection('currentPrescription')}>Current Prescription</button>
          <button onClick={() => setActiveSection('addDoctors')}>Add Doctors</button>
        </aside>
        <section>
          {renderContent()}
        </section>
      </div>
    </div>
  );
};

export default PatientHome;