import { Issue } from '../types/Issue';

export const filterIssues = (issues: Issue[]) => {
  return issues.reduce(
    (acc: { todoIssues: Issue[], inProgressIssues: Issue[], doneIssues: Issue[] }, issue) => {
      if (issue.state === 'open') {
        if (issue.assignee === null) {
          acc.todoIssues.push(issue);
        } else {
          acc.inProgressIssues.push(issue);
        }
      } else {
        acc.doneIssues.push(issue);
      }
      return acc;
    },
    { todoIssues: [], inProgressIssues: [], doneIssues: [] }
  );
};

