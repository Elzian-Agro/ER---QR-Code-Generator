import React from 'react';
import { useAuth } from '../AuthContext';
import { Navigate } from 'react-router-dom';

const QrGenerator = () => {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return <Navigate to="/" />; 
  }



  return (
    <div>
      {}
    </div>
  );
};

export default QrGenerator;
