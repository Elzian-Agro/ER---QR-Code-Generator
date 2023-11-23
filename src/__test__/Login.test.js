import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; 
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../pages/login';

// Mock the AuthContext
jest.mock('../AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
  }),
}));

describe('Login Page', () => {
    test('renders login form elements', () => {
        render(
            <Router>
                <LoginForm />
            </Router>
        );

        // Check if the login form elements are rendered
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    test('convert password to hash', () => {
        const sha256 = require('js-sha256');

        // Function to hash the password
        const hashPassword = (password) => {
            return sha256(password); 
        };

        const inputPassword = 'admin123';
        const hashedPassword = hashPassword(inputPassword);

        // Compare the hashed password with the expected hash value
        expect(hashedPassword).toEqual('240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9');
    });

    test('login with correct credentials', async () => {
        render(
            <Router>
                <LoginForm />
            </Router>
        );

        // Fill in the username and password
        fireEvent.change(screen.getByLabelText('Username'), {
            target: { value: 'admin' },
        });
        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: 'admin123' },
        });

        // Click the login button
        fireEvent.click(screen.getByText('Login'));
        
        // Wait for the 'Login successful' message
        await waitFor(() => screen.getByText('Login successful'));

        // Check if the navigation occurred to the QR Generator page
        //expect(window.location.pathname).toBe('/ER---QR-Code-Generator/qr');        
    });
    
    test('login with incorrect credentials', async () => {
        render(
            <Router>
                <LoginForm />
            </Router>
        );
        
        fireEvent.change(screen.getByLabelText('Username'), {
            target: { value: 'admin' },
        });
        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: 'incorrectpassword' },
        });

        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => screen.getByText('Invalid credentials'));
    });
});