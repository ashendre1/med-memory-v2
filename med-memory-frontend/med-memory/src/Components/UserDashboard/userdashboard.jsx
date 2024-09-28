import React, { useState } from 'react';
import './userdashboard.css';
import { uploadPrescription } from '../../Api';

const UserDashboard = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);

  const handleUploadClick = () => {
    setShowUpload(true);
  };

  const handleVisualizationClick = () => {
    setShowUpload(false);
  };

  const handleupload = async () => {
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    fetch('http://localhost:9090/prescription/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include' // Include cookies in the request
    })
      .then(response => {
        if (response.ok) {
          console.log('File uploaded successfully');
        } else {
          console.error('File upload failed');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const getPrescriptions = async () => {
    fetch('http://localhost:9090/prescription/getMyPrescription', {
      method: 'GET',
      credentials: 'include' // Include cookies in the request
    })
      .then(response => response.json())
      .then(data => {
        setImages(data);

        console.log('Images:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log('Selected file:', file);
    setSelectedFile(file);
    // Handle file upload logic here
  };

  return (
    <div>
      <header>
      <button className={!showUpload ? 'active' : ''} onClick={handleVisualizationClick}>
          Visualization
      </button>
    <button className={showUpload ? 'active' : ''} onClick={handleUploadClick}>
          Upload
    </button>
      </header>
      <main>
        {showUpload ? (
          <div>
            <h2>Upload File</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleupload}>Upload</button>
          </div>
        ) : (
          <div>
            <h2>Visualization</h2>
            <button onClick={getPrescriptions}>Get Prescriptions</button>
            <div className="image-gallery">
              {images.map((image, index) => (
                <img key={index} src={image.imageUrl} alt={`Image ${index}`} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;