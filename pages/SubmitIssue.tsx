import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { analyzeIssue } from '../services/geminiService';
import { Priority } from '../types';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Upload, Loader2, Send } from 'lucide-react';

const SubmitIssue: React.FC = () => {
  const { addIssue } = useStore();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('General');
  const [priority, setPriority] = useState<Priority>(Priority.LOW);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [attachment, setAttachment] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSmartAnalysis = async () => {
    if (!description || !title) {
        alert("Please enter a title and description first.");
        return;
    }
    setIsAnalyzing(true);
    try {
        const result = await analyzeIssue(description, title);
        setPriority(result.priority as Priority);
        setDepartment(result.department);
        setAiAnalysis(`AI Summary: ${result.summary}\nSuggested Action: ${result.suggestedAction}`);
    } catch (e) {
        console.error(e);
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
        const newIssueId = addIssue({
            title,
            description,
            department,
            priority,
            aiAnalysis,
            attachmentUrl: attachment
        });
        
        // Navigate to the specific ticket page to "show" the issue
        setTimeout(() => {
            if (newIssueId) {
                navigate(`/ticket/${newIssueId}`);
            } else {
                navigate('/dashboard');
            }
        }, 100);
        
    } catch (error) {
        console.error("Failed to submit issue", error);
        setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Submit New Issue</h2>
            <p className="text-slate-500">Describe your problem and let our AI assist you.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Issue Title</label>
                    <input 
                        type="text" 
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="e.g., Printer not working on 2nd floor"
                    />
                </div>

                {/* Description + AI Button */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-slate-700">Description</label>
                        <button 
                            type="button" 
                            onClick={handleSmartAnalysis}
                            disabled={isAnalyzing || !description}
                            className="text-xs flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                            {isAnalyzing ? 'Analyzing...' : 'Auto-Detect Priority'}
                        </button>
                    </div>
                    <textarea 
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Please provide detailed information about the issue..."
                    />
                </div>

                {/* AI Analysis Result Block */}
                {aiAnalysis && (
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                            <Sparkles className="text-indigo-600 mt-1 flex-shrink-0" size={18} />
                            <div>
                                <h4 className="text-sm font-bold text-indigo-900">Gemini AI Analysis</h4>
                                <p className="text-sm text-indigo-800 mt-1 whitespace-pre-wrap">{aiAnalysis}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Categorization (Auto-filled by AI) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                        <select 
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option>General</option>
                            <option>IT</option>
                            <option>HR</option>
                            <option>Facilities</option>
                            <option>Finance</option>
                            <option>Legal</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                        <select 
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Priority)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value={Priority.LOW}>Low</option>
                            <option value={Priority.MEDIUM}>Medium</option>
                            <option value={Priority.HIGH}>High</option>
                            <option value={Priority.CRITICAL}>Critical</option>
                        </select>
                    </div>
                </div>

                {/* File Upload */}
                <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Attachment</label>
                     <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-slate-50 transition-colors relative">
                        <div className="space-y-1 text-center">
                            {attachment ? (
                                <img src={attachment} alt="Preview" className="mx-auto h-32 object-contain" />
                            ) : (
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            )}
                            <div className="flex text-sm text-gray-600 justify-center">
                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                    <span>Upload a file</span>
                                    <input type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        {isSubmitting ? 'Submitting...' : 'Submit Issue'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default SubmitIssue;
