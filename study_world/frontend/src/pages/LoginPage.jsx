import React, { useState } from 'react';
import '../styles/LoginPage.css';

function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [remember, setRemember] = useState(false);
	const [errors, setErrors] = useState({});

	const validate = () => {
		const errs = {};
		if (!email) errs.email = 'Email is required';
		else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email';
		if (!password) errs.password = 'Password is required';
		else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
		return errs;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const errs = validate();
		setErrors(errs);
		if (Object.keys(errs).length === 0) {
			// TODO: replace with real auth call
			
			console.log('Login attempt', { email, password, remember });
			// Example feedback for the demo
			alert('Login submitted (demo) — check console for payload');
		}
	};

	return (
		<div className="login-page">
			<div className="login-card">
				<h1 className="login-title">Sign in</h1>
				<form className="login-form" onSubmit={handleSubmit} noValidate>
					<label className="field">
						<span className="label-text">Email</span>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={`input ${errors.email ? 'input-error' : ''}`}
							placeholder="you@example.com"
							aria-label="Email"
						/>
						{errors.email && <div className="error">{errors.email}</div>}
					</label>

					<label className="field">
						<span className="label-text">Password</span>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={`input ${errors.password ? 'input-error' : ''}`}
							placeholder="Enter your password"
							aria-label="Password"
						/>
						{errors.password && <div className="error">{errors.password}</div>}
					</label>

					<label className="remember">
						<input
							type="checkbox"
							checked={remember}
							onChange={(e) => setRemember(e.target.checked)}
						/>
						<span>Remember me</span>
					</label>

					<button type="submit" className="btn-primary">Sign in</button>

					<div className="helper-row">
						<a href="/forgot-password" className="link">Forgot password?</a>
						<a href="/signup" className="link">Create account</a>
					</div>
				</form>
			</div>
		</div>
	);
}

export default LoginPage;