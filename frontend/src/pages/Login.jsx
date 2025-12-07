import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/browse');
    } catch (err) {
      setError('Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://assets.nflxext.com/ffe/siteui/vlv3/47c2bc92-5a2a-4f33-8f91-4314e9e62ef1/web/IN-en-20240916-TRIFECTA-perspective_72df5d07-cf3f-4530-9afd-8f1d92d7f1a8_large.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="px-4 md:px-12 py-6">
          <h1
            className="text-[#E50914] text-3xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: 'Bebas Neue, Arial, sans-serif' }}
          >
            NETFLIX
          </h1>
        </div>

        {/* Login Form */}
        <div className="flex items-center justify-center px-4 py-16">
          <div className="bg-black/75 rounded px-8 md:px-16 py-12 md:py-16 w-full max-w-md">
            <h2 className="text-white text-3xl font-semibold mb-8">Sign In</h2>

            {error && (
              <div className="bg-[#E87C03] text-white px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder="Email or phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-[#333] text-white border-0 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-[#333] text-white border-0 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E50914] text-white py-4 rounded font-semibold hover:bg-[#f6121d] transition-colors disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-400">
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
                <a href="#" className="text-gray-400 hover:underline">
                  Need help?
                </a>
              </div>
            </form>

            <div className="mt-16 text-gray-400">
              <span>New to Netflix? </span>
              <Link to="/signup" className="text-white hover:underline">
                Sign up now
              </Link>
              .
            </div>

            <div className="mt-4 text-xs text-gray-500">
              This page uses mock authentication for demo purposes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
