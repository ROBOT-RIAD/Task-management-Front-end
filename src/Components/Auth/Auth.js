import React, { useState } from 'react';
import { Formik } from 'formik';
import { Alert } from 'reactstrap';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import log from '../../assets/image/6333040.jpg';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const saveTokenDataAndGetUserId = (access) => {
    const token = jwtDecode(access);
    localStorage.setItem('token', access);
    localStorage.setItem('userId', token.user_id);
    const expirationTime = new Date(token.exp * 1000);
    localStorage.setItem('expirationTime', expirationTime);
    return token.user_id;
};

const Auth = () => {
    const [mode, setMode] = useState("Sign Up");
    const [authLoading, setAuthLoading] = useState(false);
    const [authFailedMsg, setAuthFailedMsg] = useState('');
    const navigate = useNavigate();

    const switchModeHandler = () => {
        setMode(prevMode => (prevMode === "Sign Up" ? "Login" : "Sign Up"));
    };

    const handleSubmit = (values) => {
        setAuthLoading(true);
        const authData = { email: values.email, password: values.password };
        const authUrl = mode === "Sign Up"
            ? "http://127.0.0.1:8000/account/users/"
            : "http://127.0.0.1:8000/account/token/";

        axios.post(authUrl, authData)
            .then(response => {
                setAuthLoading(false);
                if (response.data && response.data.access) {
                    const access = response.data.access;
                    saveTokenDataAndGetUserId(access);
                    window.location.reload();
                    navigate('/home');  
                } else {
                    setAuthFailedMsg('Your Account is Created please check your email');
                }
            })
            .catch(error => {
                setAuthLoading(false);
                if (error.response && error.response.data) {
                    const key = Object.keys(error.response.data)[0];
                    let errValue = error.response.data[key];
                    if (errValue === "No active account found with the given credentials") {
                        errValue = "Your account has been created. Check your email to activate.";
                    }
                    setAuthFailedMsg(errValue);
                } else {
                    setAuthFailedMsg('An error occurred. Please try again.');
                }
            });
    };

    const validate = values => {
        const errors = {};

        if (!values.email) {
            errors.email = 'Required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
        }

        if (!values.password) {
            errors.password = 'Required';
        } else if (values.password.length < 4) {
            errors.password = 'Must be at least 4 characters!';
        }

        if (mode === "Sign Up") {
            if (!values.passwordConfirm) {
                errors.passwordConfirm = 'Required';
            } else if (values.password !== values.passwordConfirm) {
                errors.passwordConfirm = 'Password fields do not match!';
            }
        }

        return errors;
    };

    return (
        <div className="d-flex flex-wrap justify-content-center align-items-center" style={{ backgroundColor: "rgb(234, 234, 234, 0.4)" }}>
            <div className="container row w-100 mx-0">
                <div className="col-lg-6 col-md-8 mb-5 col-12 d-flex justify-content-center align-items-center mb-5 mb-lg-0">
                    <img
                        src={log}
                        alt='Brand Logo'
                        style={{ width: '100%', maxWidth: '450px', height: 'auto', marginBottom: '30px', marginTop: "20px" }}
                    />
                </div>
                <div className="col-lg-6 mb-4 col-md-8 col-12 d-flex justify-content-center align-items-center">
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                        {authFailedMsg && <Alert style={{ color: "red" }}>{authFailedMsg}</Alert>}
                        {authLoading ? <Spinner /> : (
                            <Formik
                                initialValues={{
                                    email: "",
                                    password: "",
                                    passwordConfirm: "",
                                }}
                                onSubmit={handleSubmit}
                                validate={validate}
                            >
                                {({ values, handleChange, handleSubmit, errors }) => (
                                    <div style={{ border: "1px grey solid", padding: "15px", borderRadius: "7px" }}>
                                        <button
                                            style={{ width: "100%", backgroundColor: "#0a0a22", color: "white" }}
                                            className="btn btn-lg"
                                            onClick={switchModeHandler}
                                        >
                                            Switch to {mode === "Sign Up" ? "Login" : "Sign Up"}
                                        </button>
                                        <br /><br />
                                        <form onSubmit={handleSubmit}>
                                            <input
                                                name="email"
                                                placeholder="Enter Your Email"
                                                className="form-control"
                                                value={values.email}
                                                onChange={handleChange}
                                            />
                                            <span style={{ color: "red" }}>{errors.email}</span>
                                            <br />
                                            <input
                                                name="password"
                                                placeholder="Password"
                                                className="form-control"
                                                value={values.password}
                                                onChange={handleChange}
                                            />
                                            <span style={{ color: "red" }}>{errors.password}</span>
                                            <br />
                                            {mode === "Sign Up" && (
                                                <>
                                                    <input
                                                        name="passwordConfirm"
                                                        placeholder="Confirm Password"
                                                        className="form-control"
                                                        value={values.passwordConfirm}
                                                        onChange={handleChange}
                                                    />
                                                    <span style={{ color: "red" }}>{errors.passwordConfirm}</span>
                                                    <br />
                                                </>
                                            )}
                                            <button
                                                type="submit"
                                                style={{ backgroundColor: "#0a0a22", color: "white" }}
                                                className="btn"
                                            >
                                                {mode === "Sign Up" ? "Sign Up" : "Login"}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </Formik>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
