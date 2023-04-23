import { Issue } from '../types/Issue';

export const getIssueCreationTime = (item: Issue) => {
  return `#${item.number} opened ${Math.floor((new Date().getTime() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago`;
};
