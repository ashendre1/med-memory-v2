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
        return <div>Current Prescription Content If you have any questions about the hackathon, please post them in the #shellhacks channel in Discord, and we'll be in touch as soon as possible. Or if you prefer, you may reach out to an organizer privately on Discord or send an email tofiu@weareinit.org. Please do not withdraw your application if you entered the wrong info. Reach out to an organizer with your correct information and we will fix it for you.

        Resources:If you have any questions about the hackathon, please post them in the #shellhacks channel in Discord, and we'll be in touch as soon as possible. Or if you prefer, you may reach out to an organizer privately on Discord or send an email tofiu@weareinit.org. Please do not withdraw your application if you entered the wrong info. Reach out to an organizer with your correct information and we will fix it for you.

Resources:If you have any questions about the hackathon, please post them in the #shellhacks channel in Discord, and we'll be in touch as soon as possible. Or if you prefer, you may reach out to an organizer privately on Discord or send an email tofiu@weareinit.org. Please do not withdraw your application if you entered the wrong info. Reach out to an organizer with your correct information and we will fix it for you.

Resources:If you have any questions about the hackathon, please post them in the #shellhacks channel in Discord, and we'll be in touch as soon as possible. Or if you prefer, you may reach out to an organizer privately on Discord or send an email tofiu@weareinit.org. Please do not withdraw your application if you entered the wrong info. Reach out to an organizer with your correct information and we will fix it for you.

Resources:</div>;
      case 'addDoctors':
        return <div>Add Doctors { console.log("hello")}Content</div>;
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
          <br></br>
          <br></br>
          <br></br>
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