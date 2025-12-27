import React from 'react';
import { useStore } from '../context/StoreContext';
import { Role } from '../types';
import { Navigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { auth, issues } = useStore();

  if (auth.user?.role !== Role.ADMIN) {
    return <Navigate to="/dashboard" />;
  }

  // Data for Department Chart
  const deptData = issues.reduce((acc: any, curr) => {
    acc[curr.department] = (acc[curr.department] || 0) + 1;
    return acc;
  }, {});
  
  const barChartData = Object.keys(deptData).map(key => ({
    name: key,
    issues: deptData[key]
  }));

  // Data for Status Chart
  const statusData = issues.reduce((acc: any, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.keys(statusData).map(key => ({
    name: key.replace('_', ' '),
    value: statusData[key]
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Admin Console</h2>
            <p className="text-slate-500">System analytics and performance metrics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-700 mb-6">Issues by Department</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Bar dataKey="issues" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Status Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-700 mb-6">Status Distribution</h3>
                 <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* All Users Table (Simplified) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-semibold text-slate-800">System Overview</h3>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold text-slate-800">{issues.length}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Total Issues</p>
                    </div>
                     <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold text-slate-800">
                            {issues.filter(i => i.priority === 'CRITICAL').length}
                        </p>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Critical Issues</p>
                    </div>
                     <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold text-slate-800">
                            {issues.filter(i => i.status === 'RESOLVED').length}
                        </p>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Resolved</p>
                    </div>
                     <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold text-slate-800">
                             {new Set(issues.map(i => i.submittedBy)).size}
                        </p>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Active Users</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminDashboard;
