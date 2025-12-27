import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Status, Role } from '../types';
import { ArrowLeft, Send, User as UserIcon } from 'lucide-react';

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { issues, auth, updateIssueStatus, addComment, deleteIssue } = useStore();
  const [newComment, setNewComment] = useState('');

  const issue = issues.find(i => i.id === id);

  if (!issue) {
    return <div className="p-8 text-center">Issue not found</div>;
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateIssueStatus(issue.id, e.target.value as Status);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(issue.id, newComment);
      setNewComment('');
    }
  };

  const handleDelete = () => {
    if(window.confirm('Are you sure you want to delete this issue?')) {
        deleteIssue(issue.id);
        navigate('/dashboard');
    }
  }

  const canManage = auth.user?.role === Role.ADMIN || auth.user?.role === Role.DEPARTMENT_HEAD;

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-slate-900">{issue.title}</h1>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-mono text-slate-500">#{issue.id}</span>
            </div>
            
            <p className="text-slate-600 leading-relaxed mb-6">{issue.description}</p>
            
            {issue.attachmentUrl && (
                <div className="mb-6 p-4 border border-slate-100 rounded-lg bg-slate-50">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Attachment</p>
                    <img src={issue.attachmentUrl} alt="Attachment" className="max-h-64 rounded-md object-contain" />
                </div>
            )}

            {issue.aiAnalysis && (
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6">
                    <h4 className="text-indigo-900 font-semibold text-sm mb-1">AI Smart Analysis</h4>
                    <p className="text-indigo-800 text-sm whitespace-pre-wrap">{issue.aiAnalysis}</p>
                </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Discussion</h3>
            <div className="space-y-6 mb-6">
                {issue.comments.length === 0 && <p className="text-slate-400 text-sm italic">No comments yet.</p>}
                {issue.comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                            <UserIcon size={14} />
                        </div>
                        <div className="flex-1">
                            <div className="bg-slate-50 p-3 rounded-lg rounded-tl-none">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-sm text-slate-900">{comment.userName}</span>
                                    <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="text-slate-700 text-sm">{comment.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleCommentSubmit} className="relative">
                <input 
                    type="text" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..." 
                    className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button type="submit" className="absolute right-2 top-2 p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                    <Send size={18} />
                </button>
            </form>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Details</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Status</label>
                        {canManage ? (
                             <select 
                                value={issue.status}
                                onChange={handleStatusChange}
                                className="w-full p-2 border border-slate-300 rounded-md text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                {Object.values(Status).map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        ) : (
                            <span className="inline-block px-3 py-1 bg-slate-100 rounded-md text-sm font-medium text-slate-700">
                                {issue.status}
                            </span>
                        )}
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Priority</label>
                        <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium border ${
                            issue.priority === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200' : 
                            issue.priority === 'HIGH' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                            {issue.priority}
                        </span>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Department</label>
                        <p className="text-sm font-medium text-slate-800">{issue.department}</p>
                    </div>
                     <div>
                        <label className="text-xs text-slate-500 block mb-1">Submitted By</label>
                        <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                {issue.submittedByName.charAt(0)}
                             </div>
                             <p className="text-sm text-slate-800">{issue.submittedByName}</p>
                        </div>
                    </div>
                </div>

                {canManage && (
                     <div className="mt-8 pt-4 border-t border-slate-100">
                        <button onClick={handleDelete} className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
                            Delete Issue
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
