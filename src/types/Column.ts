import { Issue } from './Issue';

export interface Column  {
  id: string;
  title: string;
  items: Issue[];
}