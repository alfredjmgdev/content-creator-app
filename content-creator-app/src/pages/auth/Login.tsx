import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../../utils';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email inválido')
    .max(30, 'Debe tener 30 caracteres o menos')
    .required('Requerido'),
  password: Yup.string()
    .max(30, 'Debe tener 30 caracteres o menos')
    .required('Requerido'),
});

function Login() {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  interface LoginValues {
    email: string;
    password: string;
  }

  const handleSubmit = async (
    values: LoginValues,
    { setSubmitting, setFieldError }: FormikHelpers<LoginValues>
  ) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', values);
      console.log('Login successful:', response.data);
      
      // Store the token in local storage
      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        console.log('Token stored in local storage');
      } else {
        console.warn('Token not found in the response');
      }

      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      if (axios.isAxiosError(error) && error.response) {
        // Handle specific error messages from the server
        setFieldError('email', error.response.data.message || 'Error de inicio de sesión');
      } else {
        setFieldError('email', 'Error al conectar con el servidor');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark shadow-md hover:shadow-lg transition-shadow duration-200"
      >
        🏠 Ir al explorador de contenido
      </button>

      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark shadow-md hover:shadow-lg transition-shadow duration-200"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-4xl font-bold text-primary-light dark:text-primary-dark mb-6">
            Disruptive Studio Content Creator
          </h1>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-light dark:text-text-dark">
            Inicia sesión en tu cuenta
          </h2>
        </div>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Correo electrónico
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-t-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                    placeholder="Correo electrónico"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Contraseña
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-b-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                    placeholder="Contraseña"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-light dark:bg-primary-dark hover:bg-primary-dark dark:hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-primary-dark"
                >
                  {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>

                <Link
                  to="/signup"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-light dark:text-primary-dark bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-primary-dark"
                >
                  Crear una cuenta
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;
