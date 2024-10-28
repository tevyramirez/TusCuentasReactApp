import React, { useState, FormEvent, useEffect } from 'react';
import { Input, Button, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import { API_ADDRESS } from 'variables/apiSettings';

const SignIn: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { login } = useAuth();

  // Function to get CSRF token
  const getCSRFToken = () => {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  // Get CSRF token when component mounts
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch(`${API_ADDRESS}csrf/`, {
          credentials: 'include'
        });
        if (!response.ok) {
          console.error('Failed to fetch CSRF token');
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCSRFToken();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const csrfToken = getCSRFToken();
      
      const response = await fetch(`${API_ADDRESS}login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      // Log the response details (you can remove these in production)
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const textResponse = await response.text();
      let data;
      
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        setError('Error en la respuesta del servidor');
        return;
      }

      if (response.ok && data.access) {
        localStorage.setItem('access_token', data.access);
        login(data.access);
        // Use navigate from react-router instead of window.location
        window.location.href = '/admin';
      } else {
        setError(data.detail || data.error || 'Error de autenticación');
      }
    } catch (error) {
      console.error('Network Error:', error);
      setError('Error de conexión al servidor');
    }
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          AVISO<span className='font-thin'>DE</span>COBRO
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Ingresa aquí usando tus credenciales
        </p>
      
        <form onSubmit={handleSubmit} className="w-full">
          <FormControl className="mb-3">
            <FormLabel>Usuario*</FormLabel>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="nombre de usuario"
              required
            />
          </FormControl>

          <FormControl isInvalid={!!error} className="mb-3">
            <FormLabel htmlFor="password">Contraseña*</FormLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 caracteres"
              required
            />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </FormControl>

          <Button 
            type="submit" 
            className="w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;