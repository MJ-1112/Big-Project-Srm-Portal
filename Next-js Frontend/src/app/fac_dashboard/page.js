// start/src/app/fac_dashboard/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, storage } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { Container, Typography } from '@mui/material';

const FacDashboardPage = () => {
  
  const [currentUser, setCurrentUser] = useState(undefined); 
  const [userEmail, setUserEmail] = useState('Loading...'); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();


  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Dashboard: onAuthStateChanged triggered. User:", user ? user.email : "null");
      setCurrentUser(user); 

      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail('No user logged in');
      }
    });

    return () => unsubscribe();
  }, []); 

 useEffect(() => {
   if (currentUser === null) {
      console.log("Dashboard: User is definitively null after auth check. Redirecting to /faculty-login.");
      router.push('http://localhost:3000/');
    }
  }, [currentUser, router]); 

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('http://localhost:3000/'); 
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadStatus(''); // Clear previous status
      setErrorMessage(''); // Clear previous error
    }
  };

  const handleUploadPdf = async () => {
  if (!selectedFile) {
    setErrorMessage('Please select a PDF file first.');
    return;
  }

  if (!currentUser || !currentUser.email) {
    setErrorMessage('Cannot upload: user email not available.');
    return;
  }

  setUploadStatus('Uploading to server...');
  setErrorMessage('');

  const formData = new FormData();
  formData.append('pdf', selectedFile);

  try {
    const response = await fetch('http://localhost:5000/extract-attendance', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      setUploadStatus(`✅ Upload & extraction successful. File: ${result.csv_filename}`);
    } else {
      throw new Error(result.error || 'Something went wrong during processing.');
    }
  } catch (error) {
    console.error('Upload error:', error);
    setErrorMessage(`Server error: ${error.message}`);
    setUploadStatus('');
  }

  setSelectedFile(null); // Clear file
};


  if (currentUser === undefined) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading dashboard...</Typography>
      </Container>
    );
  }

   if (currentUser === null) {
      return null; // Or a message like "Not authorized, redirecting..."
  }

 
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Faculty Dashboard!</h1>
      <p>You are logged in as: <strong>{userEmail}</strong></p>

      {/* Horizontal Rule */}
      <hr style={{ margin: '20px auto', width: '80%', borderTop: '1px solid #ccc' }} />

      <h2>File Upload</h2>
      {/* Hidden file input, triggered by a custom button click */}
      <input
        type="file"
        id="fileInput"
        accept="application/pdf"
        style={{ display: 'none' }} 
        onChange={handleFileChange}
      />
      {/* Custom button to trigger the hidden file input */}
      <button onClick={() => document.getElementById('fileInput').click()}
              style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Select PDF
      </button>

      {/* Display selected file name */}
      {selectedFile && <p>Selected file: <strong>{selectedFile.name}</strong></p>}

      {/* Button to start the upload, disabled if no file is selected */}
      <button
        onClick={handleUploadPdf}
        style={{ padding: '10px 20px', cursor: 'pointer', marginLeft: '10px' }}
        disabled={!selectedFile}
      >
        Start Upload
      </button>

      {/* Display upload status and error messages */}
      {uploadStatus && <p style={{ color: 'blue', fontWeight: 'bold' }}>{uploadStatus}</p>}
      {errorMessage && <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>}

      {/* Horizontal Rule */}
      <hr style={{ margin: '20px auto', width: '80%', borderTop: '1px solid #ccc' }} />

      {/* Logout Button */}
      <button id="logoutButton" onClick={handleLogout}
              style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px' }}>
        Log Out
      </button>
    </div>
  );
};

export default FacDashboardPage;    