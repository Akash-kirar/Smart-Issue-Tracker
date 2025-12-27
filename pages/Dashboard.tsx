import React from 'react';
import { useStore } from '../context/StoreContext';
import { Issue, Status, Priority, Role } from '../types';
import { Link } from 'react-router-dom';
import { Clock, AlertCircle, CheckCircle, MoreHorizontal } from 'lucide-react';

const StatusBadge = ({ status }: { status: Status }) => {
  const styles = {
    [Status.OPEN]: 'bg-yellow-100 text-yellow-800',
    [Status.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [Status.RESOLVED]: 'bg-green-100 text-green-800',
    [Status.CLOSED]: 'bg-gray-100 text-gray-800',
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>{status.replace('_', ' ')}</span>;
};

const PriorityBadge = ({ priority }: { priority: Priority }) => {
    const styles = {
        [Priority.LOW]: 'text-gray-500',
        [Priority.MEDIUM]: 'text-blue-500',
        [Priority.HIGH]: 'text-orange-500',
        [Priority.CRITICAL]: 'text-red-600 font-bold',
    };
    return <span className={`text-xs uppercase ${styles[priority]}`}>{priority}</span>;
};

const Dashboard: React.FC = () => {
  const { issues, auth } = useStore();

  // Filter issues based on role
  // If User: see only their own issues.
  // If Admin/Dept Head: see all.
  const visibleIssues = auth.user?.role === Role.USER 
    ? issues.filter(i => i.submittedBy === auth.user?.id)
    : issues;

  const stats = {
    open: visibleIssues.filter(i => i.status === Status.OPEN).length,
    inProgress: visibleIssues.filter(i => i.status === Status.IN_PROGRESS).length,
    resolved: visibleIssues.filter(i => i.status === Status.RESOLVED).length,
  };

  return (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
            <p className="text-slate-500">Overview of reported issues</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">Open Issues</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{stats.open}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                    <AlertCircle size={24} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">In Progress</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{stats.inProgress}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                    <Clock size={24} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">Resolved</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{stats.resolved}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                    <CheckCircle size={24} />
                </div>
            </div>
        </div>

        {/* Issue List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">Recent Issues</h3>
                <Link to="/submit" className="text-sm text-blue-600 font-medium hover:underline">
                    Report New +
                </Link>
            </div>
            <div className="divide-y divide-slate-100">
                {visibleIssues.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        No issues found. Great job!
                    </div>
                ) : (
                    visibleIssues.map(issue => (
                        <div key={issue.id} className="p-6 hover:bg-slate-50 transition-colors group">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {issue.title}
                                        </h4>
                                        <StatusBadge status={issue.status} />
                                    </div>
                                    <p className="text-slate-500 text-sm line-clamp-1 mb-2">{issue.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-slate-400">
                                        <span>ID: #{issue.id}</span>
                                        <span>•</span>
                                        <span>{issue.department}</span>
                                        <span>•</span>
                                        <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <PriorityBadge priority={issue.priority} />
                                    <Link 
                                        to={`/ticket/${issue.id}`}
                                        className="text-slate-400 hover:text-blue-600 p-1"
                                    >
                                        <MoreHorizontal size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
