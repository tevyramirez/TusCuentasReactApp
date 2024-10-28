import React, { useState, FormEvent } from 'react';
import { Input, Button, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import { API_ADDRESS } from 'variables/apiSettings';

const SignIn: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Log the request details
      console.log('Making request to:', `${API_ADDRESS}login/`);
      console.log('Request payload:', { username, password });

      const response = await fetch(`${API_ADDRESS}login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Include credentials if needed
      });

      // Log the response details
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Get the raw text first
      const textResponse = await response.text();
      console.log('Raw response:', textResponse);

      let data;
      try {
        // Try to parse the response as JSON
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        setError('Received invalid response from server');
        return;
      }

      if (response.ok) {
        if (data.access) {
          localStorage.setItem('access_token', data.access);
          login(data.access);
          window.location.href = '/admin';
        } else {
          setError('Token no recibido del servidor');
        }
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