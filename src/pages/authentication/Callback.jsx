import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const dataSource = searchParams.get('datasource');

    if (token && username) {
      // Save token or user info to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', username);
      localStorage.setItem('dataSource', dataSource);

      toast.success('Login successful!');
      navigate('/dashboard'); 
    } else {
      toast.error('Missing token or username!');
      navigate('/misc/error');
    }
  }, [location, navigate]);

  return (
    <div className="card">
      <h3>Processing authentication...</h3>
    </div>
  );
};

export default Callback;