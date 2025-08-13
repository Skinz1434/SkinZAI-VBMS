'use client';

import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

const AuthModal = ({ isOpen, onClose, mode, onModeChange }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('rater');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store user data
    const userData = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      userId: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      firstName: firstName || 'Demo',
      lastName: lastName || 'User',
      organization: organization || 'VA Regional Office',
      organizationId: organization === 'VA Regional Office' ? 'ro-atlanta' : 
                    organization === 'VA Central Office' ? 'hq-washington' :
                    organization === 'Contract Medical Office' ? 'contract-qic' :
                    organization === 'Field Office' ? 'fo-phoenix' : 'ro-denver',
      role,
      roleId: role === 'Rating Specialist' ? 'rating-specialist' :
              role === 'VSR' ? 'vsr' :
              role === 'RVSR' ? 'rvsr' :
              role === 'Supervisor' ? 'supervisor' :
              role === 'Administrator' ? 'administrator' :
              role === 'Data Analyst' ? 'data-analyst' : 'rating-specialist',
      loginTime: new Date().toISOString(),
      status: 'active' as const
    };
    
    localStorage.setItem('nova-user', JSON.stringify(userData));
    setIsLoading(false);
    onClose();
    
    // Refresh page to update UI
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-lg w-full max-w-md border border-slate-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-sm text-slate-400">
                {mode === 'login' 
                  ? 'Access your NOVA workspace' 
                  : 'Join the NOVA platform'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Organization</label>
                  <select
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select Organization</option>
                    <option value="VA Regional Office - Atlanta">VA Regional Office - Atlanta</option>
                    <option value="VA Regional Office - Houston">VA Regional Office - Houston</option>
                    <option value="VA Regional Office - Los Angeles">VA Regional Office - Los Angeles</option>
                    <option value="VA Regional Office - New York">VA Regional Office - New York</option>
                    <option value="VA Central Office">VA Central Office</option>
                    <option value="VBA Headquarters">VBA Headquarters</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                    required
                  >
                    <option value="rater">Rating Specialist</option>
                    <option value="vsr">Veteran Service Representative</option>
                    <option value="rvsr">Rating Veteran Service Representative</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="administrator">Administrator</option>
                    <option value="analyst">Data Analyst</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                placeholder="your.email@va.gov"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg transition-colors font-medium flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="text-center">
              <button
                onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                {mode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
              <h4 className="text-sm font-medium text-slate-200 mb-2">Demo Credentials</h4>
              <div className="space-y-1 text-xs text-slate-400">
                <p>Email: demo@va.gov</p>
                <p>Password: demo123</p>
                <p className="text-yellow-400 mt-2">Or use any email/password for demo access</p>
              </div>
            </div>
          )}

          <div className="mt-4 text-xs text-slate-500 text-center">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
            <p className="mt-1">This system is for authorized personnel only.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;