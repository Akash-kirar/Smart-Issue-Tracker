import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Role } from '../types';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  LogOut, 
  Menu, 
  X, 
  Settings, 
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { auth, logout } = useStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isAdmin = auth.user?.role === Role.ADMIN;

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'text-gray-300 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-slate-900 text-white shadow-xl z-20">
        <div className="flex items-center justify-center h-20 border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-wider flex items-center gap-2">
            <ShieldCheck className="text-blue-500" />
            SmartTracker
          </h1>
        </div>
        <div className="flex-1 py-6 px-3 space-y-2">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/submit" icon={PlusCircle} label="New Issue" />
          {isAdmin && (
            <NavItem to="/admin" icon={Settings} label="Admin Console" />
          )}
        </div>
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={auth.user?.avatar} 
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-slate-600"
            />
            <div>
              <p className="text-sm font-semibold">{auth.user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{auth.user?.role.toLowerCase()}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center justify-center w-full py-2 px-4 rounded-md bg-slate-800 hover:bg-slate-700 transition text-sm"
          >
            <LogOut size={16} className="mr-2" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
      
      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out z-40 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">SmartTracker</h1>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 py-6 px-3 space-y-2">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/submit" icon={PlusCircle} label="New Issue" />
          {isAdmin && (
            <NavItem to="/admin" icon={Settings} label="Admin Console" />
          )}
           <button 
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800 w-full text-left"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm z-10">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-700">
            <Menu size={24} />
          </button>
          <span className="font-bold text-slate-900">SmartTracker</span>
          <div className="w-8"></div> {/* Spacer */}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
