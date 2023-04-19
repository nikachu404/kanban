export interface Issue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  user: User;
  assignee: User | null;
  created_at: Date;
  comments: number;
}

interface User {
  login: string;
  url?: string;
}