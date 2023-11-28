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
        expect(screen.getByText("Remember Me")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
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
        fireEvent.click(screen.getByRole("button", { name: "Login" }));
        
        // Wait for the login process to finish
        await waitFor(() => {
            expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
        });
        
        // Check for successful login redirection
        await waitFor(() => {
            //expect(window.location.pathname).toEqual("/ER---QR-Code-Generator/qr");
        });
    });
    
    test('login with incorrect credentials', async () => {
        render(
            <Router>
                <LoginForm />
            </Router>
        );
        
        fireEvent.change(screen.getByLabelText('Username'), {
            target: { value: 'incorrectusername' },
        });
        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: 'incorrectpassword' },
        });

        fireEvent.click(screen.getByRole("button", { name: "Login" }));
        await waitFor(() => {
            expect(screen.queryByText("Invalid credentials")).toBeInTheDocument();
        });
    });
});