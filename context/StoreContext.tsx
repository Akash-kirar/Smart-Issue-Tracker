import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Issue, Role, AuthState, Status, Priority } from '../types';

// Mock Data Seeding
const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: Role.ADMIN, avatar: 'https://picsum.photos/id/64/100/100' },
  { id: '2', name: 'John Doe', email: 'user@example.com', role: Role.USER, avatar: 'https://picsum.photos/id/65/100/100' },
  { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: Role.DEPARTMENT_HEAD, avatar: 'https://picsum.photos/id/66/100/100' },
];

const MOCK_ISSUES: Issue[] = [
  {
    id: '101',
    title: 'Wi-Fi Connection Dropping',
    description: 'The wifi on the 3rd floor keeps disconnecting every 10 minutes.',
    status: Status.OPEN,
    priority: Priority.HIGH,
    department: 'IT',
    submittedBy: '2',
    submittedByName: 'John Doe',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
    aiAnalysis: 'Suggested: Check AP-304 logs.'
  },
  {
    id: '102',
    title: 'Leaking Faucet in Kitchen',
    description: 'The kitchen sink faucet is dripping constantly.',
    status: Status.IN_PROGRESS,
    priority: Priority.LOW,
    department: 'Facilities',
    submittedBy: '2',
    submittedByName: 'John Doe',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
  }
];

interface StoreContextType {
  auth: AuthState;
  login: (email: string, role: Role) => void;
  logout: () => void;
  register: (name: string, email: string) => void;
  issues: Issue[];
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'status' | 'submittedBy' | 'submittedByName'>) => string | null;
  updateIssueStatus: (id: string, status: Status) => void;
  addComment: (issueId: string, text: string) => void;
  deleteIssue: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth State
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('sit_auth');
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false, token: null };
  });

  // Data State
  const [issues, setIssues] = useState<Issue[]>(() => {
    const saved = localStorage.getItem('sit_issues');
    return saved ? JSON.parse(saved) : MOCK_ISSUES;
  });

  // Effects to persist data
  useEffect(() => {
    localStorage.setItem('sit_auth', JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    localStorage.setItem('sit_issues', JSON.stringify(issues));
  }, [issues]);

  // Auth Methods
  const login = (email: string, role: Role) => {
    // Simulating login finding user or creating dummy
    let user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
        user = { id: Date.now().toString(), name: email.split('@')[0], email, role, avatar: `https://picsum.photos/seed/${email}/100/100` };
    }
    setAuth({
      user,
      isAuthenticated: true,
      token: 'mock-jwt-token-' + Date.now()
    });
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false, token: null });
  };

  const register = (name: string, email: string) => {
    login(email, Role.USER);
    // In a real app this would post to backend
  };

  // Issue Methods
  const addIssue = (data: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'status' | 'submittedBy' | 'submittedByName'>): string | null => {
    if (!auth.user) return null;
    
    const newId = Date.now().toString();
    const newIssue: Issue = {
      ...data,
      id: newId,
      status: Status.OPEN,
      submittedBy: auth.user.id,
      submittedByName: auth.user.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    setIssues(prev => [newIssue, ...prev]);
    return newId;
  };

  const updateIssueStatus = (id: string, status: Status) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id ? { ...issue, status, updatedAt: new Date().toISOString() } : issue
    ));
  };

  const addComment = (issueId: string, text: string) => {
    if (!auth.user) return;
    const newComment = {
      id: Date.now().toString(),
      userId: auth.user.id,
      userName: auth.user.name,
      text,
      createdAt: new Date().toISOString()
    };
    
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, comments: [...issue.comments, newComment] } : issue
    ));
  };

  const deleteIssue = (id: string) => {
    setIssues(prev => prev.filter(i => i.id !== id));
  };

  return (
    <StoreContext.Provider value={{ auth, login, logout, register, issues, addIssue, updateIssueStatus, addComment, deleteIssue }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
