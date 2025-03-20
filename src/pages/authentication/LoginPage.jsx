import { useState } from "react";
import { Link } from "react-router-dom"
import { loginUser } from "../../services/auth";
import './page-auth.css'
import { AuthWrapper } from "./AuthWrapper";
import { toast } from 'react-toastify';

export const LoginPage = () => {
    const [formData, setFormData] = useState({
        password: '',
        email: '',
        rememberMe: false,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await loginUser(formData.email, formData.password);

            if (response?.authToken) {
                const authToken = response.authToken;
                const dataSource = 'mysql';
                const availableDataSource = 'default';

                localStorage.setItem('authToken', authToken);
                localStorage.setItem('username', formData.email);

                window.location.href = `/callback?token=${encodeURIComponent(
                  authToken
                )}&datasource=${encodeURIComponent(
                  dataSource
                )}&username=${encodeURIComponent(formData.email)}&availableDataSource=${encodeURIComponent(
                  availableDataSource
                )}`;
            } else {
                const errorMsg = response?.message || 'Invalid username or password';
                throw new Error(errorMsg);
            }
        } catch (err) {
            console.error('Login error:', err);
            toast.error(err.message || 'An unexpected error occurred');
            setFormData({ email: '', password: '' });
            document.getElementById('username').focus();
        }
    };

    return (
        <AuthWrapper>
            <h4 className="mb-2">Welcome to Tanflow! </h4>
            <p className="mb-4">Please sign-in to your account and start the adventure</p>

            <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        name="username"
                        placeholder="Enter your username"
                        autoFocus />
                </div>
                <div className="mb-3 form-password-toggle">
                        <label className="form-label" htmlFor="password">Password</label>
                    <div className="input-group input-group-merge">
                        <input
                            type="password"
                            autoComplete="true"
                            id="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="form-control"
                            name="password"
                            placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                            aria-describedby="password" />
                    </div>
                    <div className="d-flex justify-content-between">
                        <Link aria-label="Go to Forgot Password Page" to="/auth/forgot-password">
                            <small>Forgot Password?</small>
                        </Link>
                    </div>
                </div>
                <div className="mb-3">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="remember-me"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                        />
                        <label className="form-check-label" htmlFor="remember-me"> Remember Me </label>
                    </div>
                </div>
                <div className="mb-3">
                    <button aria-label='Click me' className="btn btn-primary d-grid w-100" type="submit">Sign in</button>
                </div>
            </form>

            <p className="text-center">
                <span>New on our platform? </span>
                <Link aria-label="Go to Register Page" to='/auth/register' className="registration-link">
                    <span>Create an account</span>
                </Link>
            </p>

        </AuthWrapper>
    );
};
