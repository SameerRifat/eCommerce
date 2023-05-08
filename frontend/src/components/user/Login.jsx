import React, { useEffect } from 'react'
import TextField from '@mui/material/TextField';
import { Field, Form, Formik } from 'formik'
import * as yup from 'yup'
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clear_errors, login } from '../../features/user/userSlice';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';

const userSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("required"),
    // password: yup
    //     .string()
    //     .min(8, 'Password must be 8 characters long')
    //     .matches(/[0-9]/, 'Password requires a number')
    //     .matches(/[a-z]/, 'Password requires a lowercase letter')
    //     .matches(/[A-Z]/, 'Password requires an uppercase letter')
    //     .matches(/[^\w]/, 'Password requires a symbol')
    //     .required("required"),
})

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, isAuthenticated, error } = useSelector((state) => state.user)
    const handleFormSubmit = async (values, actions) => {
        const myForm = new FormData();
        myForm.set("email", values.email)
        myForm.set("password", values.password)
        dispatch(login(myForm))
        // navigate('/')
    }
    const alert = useAlert()
    const redirect = location.search ? `/${location.search.split("=")[1]}` : "/";
    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirect)
        }
        if (error) {
            alert.error(error)
            dispatch(clear_errors());
        }
    }, [isAuthenticated, error, dispatch, navigate])
    return (
        <>
            {/*
            This example requires updating your template:
    
            ```
            <html class="h-full bg-white">
            <body class="h-full">
            ```
          */}
            <div className='h-screen z-30 fixed top-0 left-0 w-full bg-white'>
                <div className="h-[100vh] flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 z-20 relative bg-white">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <NavLink to='/'>
                            <img
                                className="mx-auto h-10 w-auto"
                                src="/images/logo.png"
                                alt="Your Company"
                            />
                        </NavLink>
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <Formik
                            onSubmit={handleFormSubmit}
                            initialValues={{ email: '', password: '' }}
                            validationSchema={userSchema}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                            }) => (
                                <Form onSubmit={handleSubmit} encType='multipart/form-data'>
                                    <Box>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            Email address
                                        </label>
                                        <div className="mt-2">
                                            <TextField
                                                fullWidth
                                                size='small'
                                                variant='outlined'
                                                type='email'
                                                autoComplete='off'
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.email}
                                                name='email'
                                                error={!!touched.email && !!errors.email}
                                                helperText={touched.email && errors.email}
                                                className='border-4 border-red-500'
                                            />
                                        </div>
                                    </Box>
                                    <div className='my-6'>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                                Password
                                            </label>
                                            <div className="text-sm">
                                                <NavLink to="/password/forgot" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                                    Forgot password?
                                                </NavLink>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <TextField
                                                fullWidth
                                                size='small'
                                                variant='outlined'
                                                type='password'
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.password}
                                                name='password'
                                                error={!!touched.password && !!errors.password}
                                                helperText={touched.password && errors.password}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="flex w-full justify-center rounded-md bg-gradient-to-tr from-pink-500 to-violet-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Sign in
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <p className="mt-10 text-center text-sm text-gray-500">
                            Not have an account?{' '}
                            <NavLink to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                Create account
                            </NavLink>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login