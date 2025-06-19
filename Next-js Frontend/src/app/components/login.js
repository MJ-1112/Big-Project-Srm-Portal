"use client";

import React from 'react';
import { Container, Box, Typography, Button } from "@mui/material";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Link from 'next/link';

const Login = () => {
    const provider = new GoogleAuthProvider();

    const handleStudentSignin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const email = user.email;

            if (!email.endsWith('@srmist.edu.in')) {
                window.alert('Use Srm Mail');
                window.location.href='/unauthorised'
                return;
            }

            window.location.href = '/Dashboard';
        } catch (error) {
            window.alert('Some error occurred');
        }
    };

    return (
        <Container>
            <Box sx={{
                height: 500,
                display: "flex",
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'center'
            }}>
                <Typography color='primary' fontSize={30}>
                    Welcome to SRM Portal
                </Typography>
                <Button
                    sx={{ height: 60, width: 200 }}
                    color='success'
                    variant='outlined'
                    onClick={handleStudentSignin}
                >
                    Login as Student
                </Button>
                <Link href='/faculty'>
                <Button
                    sx={{ height: 60, width: 200 }}
                    variant='outlined'
                    color='error'
            
                >
                    Login as Faculty
                </Button>
                </Link>
            </Box>
        </Container>
    );
};

export default Login;
