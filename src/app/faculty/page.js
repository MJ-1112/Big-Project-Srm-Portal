// start/src/app/faculty-login/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Container, Typography, TextField, Box, Snackbar, Alert } from '@mui/material';

import { auth, db } from '../firebase';

import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const allowedFacultyEmails = [
    "itsabishekskanda@gmail.com",
    "ag4342@srmist.edu.in",
    // Add more allowed faculty emails here
];

const FacultyLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [section, setSection] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [initialAuthCheckComplete, setInitialAuthCheckComplete] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false); // NEW STATE: To track if login just happened
  
  const router = useRouter();

  useEffect(() => {
    console.log("FacultyLoginPage: useEffect mounted for initial check.");

     if (isRedirecting) {
        console.log("FacultyLoginPage: Already redirecting from login, skipping initial sign-out check.");
        setInitialAuthCheckComplete(true); // Still allow form to render if it was waiting
        return;
    }

    if (auth.currentUser) { 
        console.log(`User ${auth.currentUser.email} found on faculty login page on initial load (sync check). Signing out to force re-login.`);
        signOut(auth)
            .then(() => {
                console.log("Initial auto-sign out successful.");
                setInitialAuthCheckComplete(true);
            })
            .catch((error) => {
                console.error("Error during initial auto-logout (sync check):", error);
                setInitialAuthCheckComplete(true);
            });
    } else {
        console.log("No user logged in initially (sync check). Ready to display faculty login form.");
        setInitialAuthCheckComplete(true);
    }

    }, [isRedirecting]); 
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("handleLogin started.");
    setMessage('');
    setSnackbarOpen(false);
    setJustLoggedIn(false); 

    if (!email || !password || !section) {
      setMessage('Please fill in all fields (Email, Password, Section).');
      setMessageType('error');
      setSnackbarOpen(true);
      console.log("Validation error: Missing fields.");
      return;
    }

    try {
      console.log(`Attempting signInWithEmailAndPassword for: ${email}`);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("signInWithEmailAndPassword successful. User:", user.email);
      setJustLoggedIn(true); 

      if (allowedFacultyEmails.includes(user.email)) {
        console.log("User email is allowed. Updating Firestore...");
        await setDoc(doc(db, 'faculty', user.uid), {
          email: user.email,
          section: section,
          lastLogin: serverTimestamp(),
          role: 'faculty'
        }, { merge: true });
        console.log("Firestore update successful.");

        setMessage('Login successful! Redirecting to Dashboard...');
        setMessageType('success');
        setSnackbarOpen(true);

        setIsRedirecting(true); 

        console.log("Redirecting to /fac_dashboard immediately...");
        router.push('/fac_dashboard'); 

      } else {
        console.log("User email not allowed. Signing out...");
        await signOut(auth);
        setMessage('Access Denied: Your email is not authorized for faculty login.');
        setMessageType('error');
        setSnackbarOpen(true);
        setJustLoggedIn(false); // Reset if unauthorized
      }

    } catch (error) {
      console.error("Firebase Faculty Login Error:", error);
      let errorMessage = 'Login failed. Please check your credentials.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      setMessage(errorMessage);
      setMessageType('error');
      setSnackbarOpen(true);
      setPassword('');
      console.log("Login error displayed:", errorMessage);
      setJustLoggedIn(false); // Reset on error
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // --- Conditional Rendering: Show loading/redirecting based on state ---

  
  if (isRedirecting) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Redirecting...</Typography>
      </Container>
    );
  }

 
  if (!initialAuthCheckComplete) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Checking authentication state...</Typography>
      </Container>
    );
  }

 
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Faculty Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="section"
            label="Section"
            name="section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={messageType} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}; 

export default FacultyLoginPage;