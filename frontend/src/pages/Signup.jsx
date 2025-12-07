import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await signup(email, password, name);
      navigate('/browse');
    } catch (err) {
      setError('Failed to create account');
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

        {/* Signup Form */}
        <div className="flex items-center justify-center px-4 py-16">
          <div className="bg-black/75 rounded px-8 md:px-16 py-12 md:py-16 w-full max-w-md">
            <h2 className="text-white text-3xl font-semibold mb-8">Sign Up</h2>

            {error && (
              <div className="bg-[#E87C03] text-white px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-[#333] text-white border-0 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
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
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-16 text-gray-400">
              <span>Already have an account? </span>
              <Link to="/login" className="text-white hover:underline">
                Sign in now
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

export default Signup;
