"use client";

import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, TextField, Box, Dialog, DialogTitle, DialogContent, MenuItem,Select,InputLabel } from '@mui/material';
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [formFilled, setFormFilled] = useState(false);
  const [formData, setFormData] = useState({ regNo: '', department: '' ,branch: '' , pemail:'', pmobile:'', mymobile:''});
  const [extraFormOpen, setExtraFormOpen] = useState(false);
  const [extraData, setExtraData] = useState({ projectTitle: '', domain: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userRef = doc(db, 'students', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.regNo && data.department && data.branch && data.pemail && data.pmobile && data.mymobile)     {
            setFormFilled(true);
          }
        }
      } else {
        window.location.href = '/'; // redirect to login if not signed in
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInitialFormSubmit = async () => {
    if (!formData.regNo || !formData.department||formData.branch || formData.pemail || formData.pmobile || formdata.mymobile) {
      alert("Fill all fields");
      return;
    }

    try {
      await setDoc(doc(db, "students", currentUser.uid), {
        name: currentUser.displayName,
        email: currentUser.email,
        regNo: formData.regNo,
        department: formData.department,
        branch:formData.branch,
        pemail:formData.pemail,
        pmobile:formData.pmobile,
        mymobile:formData.mymobile        

      });

      setFormFilled(true);
    } catch (error) {
      console.error("Error saving student data:", error);
      alert("Error saving student data.");
    }
  };

  const handleExtraFormSubmit = async () => {
    try {
      const extraRef = collection(db, "students", currentUser.uid, "extraDetails");
      await addDoc(extraRef, {
        projectTitle: extraData.projectTitle,
        domain: extraData.domain,
        submittedAt: new Date(),
      });

      alert("Extra details submitted!");
      setExtraFormOpen(false);
      setExtraData({ projectTitle: '', domain: '' }); // clear form
    } catch (err) {
      console.error("Error submitting extra form:", err);
      alert("Failed to submit extra form.");
    }
  };

  if (!currentUser) return <Typography>Loading....</Typography>;

  return (
    <Container sx={{ backgroundColor:'white', width:'100vw', display:'flex',justifyContent:"center", height:'100vh', flexDirection:'column'}}>
      <Typography variant="h4" color='primary'
      sx={{display:'flex',alignItems:'flex-start', mt:10 }}>Welcome, {currentUser.displayName}
       
      </Typography>
      <Typography variant='h5' color='primary'>
         Mail: {currentUser.email}
      </Typography> 

      {!formFilled ? (
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Register Number"
            value={formData.regNo}
            onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
           
          />
          <InputLabel id="demo-simple-select-label">Department</InputLabel>
          <Select
          labelId="demo-simple-select-label"
            label="Department"
            color='secondary'
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          >
            <MenuItem value={'CSE'}>CSE</MenuItem>
            <MenuItem value={'CSE AI/ML'}>CSE AI/ML</MenuItem>
            <MenuItem value={'CSE Data Science'}>CSE Data Science</MenuItem>
            </Select>

          <TextField
            label="Branch"
            value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
          />
          <TextField
            label="Parent's mail"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
          <TextField
            label="Parent Mobile"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
          <TextField
            label="Personal Mobile"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
          <Button variant="contained" onClick={handleInitialFormSubmit}>Submit Details</Button>
        </Box>
      ) : (
        <>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Dashboard</Typography>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setExtraFormOpen(true)}>
              Fill Extra Details
            </Button>
          </Box>

          {/* Dialog for extra form */}
          <Dialog open={extraFormOpen} onClose={() => setExtraFormOpen(false)}>
            <DialogTitle>Extra Details</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Project Title"
                value={extraData.projectTitle}
                onChange={(e) => setExtraData({ ...extraData, projectTitle: e.target.value })}
              />
              <TextField
                label="Domain"
                value={extraData.domain}
                onChange={(e) => setExtraData({ ...extraData, domain: e.target.value })}
              />
              <Button variant="contained" onClick={handleExtraFormSubmit}>Submit</Button>
            </DialogContent>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
