import { Issue } from '../types/Issue';

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

export const getIssueCreationTime = (item: Issue) => {
  const daysAgo = Math.floor((new Date().getTime() - new Date(item.created_at).getTime()) / MILLISECONDS_PER_DAY);
  return `#${item.number} opened ${daysAgo} days ago`;
};