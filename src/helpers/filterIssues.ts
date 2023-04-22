import { Issue } from "../types/Issue";

export const filterIssues = (issues: Issue[]) => {
  const todoIssues = issues.filter((issue) => issue.state === 'open');
  const inProgressIssues = issues.filter((issue) => issue.state === 'open' && issue.assignee);
  const doneIssues = issues.filter((issue) => issue.state === 'closed');

  return { todoIssues, inProgressIssues, doneIssues };
};