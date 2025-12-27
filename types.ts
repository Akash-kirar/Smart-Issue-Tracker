export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD'
}

export enum Status {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  department: string; // 'IT', 'HR', 'Facilities', 'General'
  submittedBy: string; // User ID
  submittedByName: string;
  assignedTo?: string; // User ID or Department
  createdAt: string;
  updatedAt: string;
  attachmentUrl?: string; // Base64 for demo
  comments: Comment[];
  aiAnalysis?: string; // Analysis from Gemini
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}
