import React, { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import '../styles/LoginPage.css'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!email) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 6)
      errs.password = 'Password must be at least 6 characters'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    // Optional: store session if "remember me" checked
    if (remember) {
      localStorage.setItem('user', JSON.stringify(data.user))
    } else {
      sessionStorage.setItem('user', JSON.stringify(data.user))
    }

    console.log('✅ Logged in user:', data.user)
    alert('Login successful!')
    // redirect or navigate to dashboard here
    window.location.href = '/dashboard'
  }

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

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="helper-row">
            <a href="/forgot-password" className="link">
              Forgot password?
            </a>
            <a href="/signup" className="link">
              Create account
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
