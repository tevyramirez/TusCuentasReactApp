import React, { useState, FormEvent } from 'react';
import { Input, Button, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { login } = useAuth();


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.access);
        console.log("se logea")
        // Redirigir al usuario a la página deseada después del inicio de sesión
        // Ejemplo: redirige a la página de dashboard
        window.location.href = '/admin';

      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to login');
      }
    } catch (error) {
      setError('Failed to login');
    }
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Ingresa
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Usa tu E-mail y contraseña 
        </p>
      
        <form onSubmit={handleSubmit} className="w-full">
          {/* Email */}
          <FormControl className="mb-3">
            <FormLabel >Email*</FormLabel>
            <Input
              id="email"
          
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="mail@simple.com"
              required
            />
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>

          {/* Password */}
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
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>

          {/* Remember me checkbox and forgot password link */}
          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-brand-500 dark:text-white" />
              <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                Recuérdame
              </p>
            </div>
            <Link to="/forgot-password" className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white">
              ¿Olvidaste la Contraseña?
            </Link>
          </div>

          {/* Sign in button */}
          <Button type="submit" className="w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            Ingresa
          </Button>
        </form>

        {/* Separator line and "or" text */}
        <div className="mb-6 mt-6 flex items-center gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white"> o </p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>

        {/* Link to registration */}
        {/* <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
          Not registered yet?
        </span>
        <Link
          to="/register"
          className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
        >
          Create an account
        </Link> */}
      </div>
    </div>
  );
};

export default SignIn;
