import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Role } from '../types';
import { ShieldCheck, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const { login, register, auth } = useStore();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  // We're just mocking auth, so password isn't verified but typically would be
  const [password, setPassword] = useState(''); 
  const [role, setRole] = useState<Role>(Role.USER);

  // Redirect if authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [auth.isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login(email, role); // In a real app, role comes from backend after authing
    } else {
      register(name, email);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="bg-blue-600 p-8 text-white text-center">
            <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold mb-2">Smart Issue Tracker</h1>
            <p className="text-blue-100 text-sm">AI-Powered Enterprise Resolution</p>
        </div>

        <div className="p-8">
          <div className="flex gap-4 mb-8 bg-slate-100 p-1 rounded-lg">
            <button 
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                onClick={() => setIsLogin(true)}
            >
                Login
            </button>
            <button 
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                onClick={() => setIsLogin(false)}
            >
                Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
                <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
            )}
            <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            {isLogin && (
                <div className="space-y-2">
                    <p className="text-xs text-slate-500 font-medium ml-1">Simulate Role:</p>
                    <div className="flex gap-2">
                         <button 
                            type="button" 
                            onClick={() => setRole(Role.USER)}
                            className={`flex-1 py-1 text-xs border rounded ${role === Role.USER ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-200'}`}
                         >User</button>
                         <button 
                            type="button" 
                            onClick={() => setRole(Role.ADMIN)}
                            className={`flex-1 py-1 text-xs border rounded ${role === Role.ADMIN ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-200'}`}
                         >Admin</button>
                    </div>
                </div>
            )}

            <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
            >
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
                Mock Environment • credentials stored locally
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;