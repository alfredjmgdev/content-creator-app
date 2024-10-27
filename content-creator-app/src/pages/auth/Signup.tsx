import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../../utils';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupSchema = Yup.object().shape({
    username: Yup.string()
        .matches(/^[a-zA-Z]+$/, 'Solo se permiten letras')
        .min(3, 'Debe tener 3 caracteres o más')
        .max(30, 'Debe tener 30 caracteres o menos')
        .required('Requerido'),
    email: Yup.string()
        .email('Email inválido')
        .min(10, 'Debe tener 10 caracteres o más')
        .max(30, 'Debe tener 30 caracteres o menos')
        .required('Requerido'),
    password: Yup.string()
        .min(6, 'Debe tener 6 caracteres o más')
        .max(30, 'Debe tener 30 caracteres o menos')
        .required('Requerido'),
    type: Yup.string().oneOf(['reader', 'creator']).required('Requerido'),
});

interface SignUpValues {
    username: string;
    email: string;
    password: string;
    type: 'reader' | 'creator';
}

function SignUp() {
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (
        values: SignUpValues,
        { setSubmitting, setStatus }: FormikHelpers<SignUpValues>
    ) => {
        try {
            const response = await axios.post('http://localhost:3000/api/auth/signup', values);
            console.log('Sign up successful:', response.data);
            // Redirect to login page or dashboard
            navigate('/login');
        } catch (error) {
            console.error('Sign up error:', error);
            if (axios.isAxiosError(error) && error.response) {
                // Handle specific error messages from the server
                const errorMessage = error.response.data.message || 'Error al registrar. Por favor, intente nuevamente.';
                setStatus(errorMessage);
            } else {
                setStatus('Error al conectar con el servidor. Por favor, intente nuevamente.');
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
                        Crea tu cuenta
                    </h2>
                </div>
                <Formik
                    initialValues={{ username: '', email: '', password: '', type: 'reader' }}
                    validationSchema={SignupSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, isSubmitting, status }) => (
                        <Form className="mt-8 space-y-6">
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <label htmlFor="username" className="sr-only">
                                        Nombre de usuario
                                    </label>
                                    <Field
                                        id="username"
                                        name="username"
                                        type="text"
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-t-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark focus:z-10 sm:text-sm"
                                        placeholder="Nombre de usuario"
                                    />
                                    <ErrorMessage name="username" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="sr-only">
                                        Correo electrónico
                                    </label>
                                    <Field
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
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
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-text-light dark:text-text-dark bg-input-light dark:bg-input-dark rounded-b-md focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-light focus:z-10 sm:text-sm"
                                        placeholder="Contraseña"
                                    />
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                            </div>

                            <div className="flex items-center justify-center space-x-4">
                                <div className="flex items-center">
                                    <Field
                                        id="user-type-reader"
                                        name="type"
                                        type="radio"
                                        value="reader"
                                        className="sr-only"
                                    />
                                    <label
                                        htmlFor="user-type-reader"
                                        className={`flex items-center cursor-pointer ${
                                            values.type === 'reader'
                                                ? 'text-primary-light dark:text-primary-dark'
                                                : 'text-text-light dark:text-text-dark'
                                        }`}
                                    >
                                        <span className={`w-4 h-4 inline-block mr-2 rounded-full border ${
                                            values.type === 'reader'
                                                ? 'border-primary-light dark:border-primary-dark bg-primary-light dark:bg-primary-dark'
                                                : 'border-gray-500 dark:border-gray-400 bg-transparent'
                                        }`}></span>
                                        Lector
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <Field
                                        id="user-type-creator"
                                        name="type"
                                        type="radio"
                                        value="creator"
                                        className="sr-only"
                                    />
                                    <label
                                        htmlFor="user-type-creator"
                                        className={`flex items-center cursor-pointer ${
                                            values.type === 'creator'
                                                ? 'text-primary-light dark:text-primary-dark'
                                                : 'text-text-light dark:text-text-dark'
                                        }`}
                                    >
                                        <span className={`w-4 h-4 inline-block mr-2 rounded-full border ${
                                            values.type === 'creator'
                                                ? 'border-primary-light dark:border-primary-dark bg-primary-light dark:bg-primary-dark'
                                                : 'border-gray-500 dark:border-gray-400 bg-transparent'
                                        }`}></span>
                                        Creador
                                    </label>
                                </div>
                            </div>
                            <ErrorMessage name="type" component="div" className="text-red-500 text-xs mt-1" />

                            <div className="flex flex-col space-y-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-light dark:bg-primary-dark hover:bg-primary-dark dark:hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-primary-dark"
                                >
                                    {isSubmitting ? 'Registrando...' : 'Registrarse'}
                                </button>

                                {status && (
                                    <div className="text-red-500 text-sm text-center">{status}</div>
                                )}

                                <Link
                                    to="/login"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-light dark:text-primary-dark bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-primary-dark"
                                >
                                    Ya tengo una cuenta
                                </Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default SignUp;
