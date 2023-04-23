export const getIssuesApiLink = (githubLink: string) => {
  const parts = githubLink.split('/');
  const username = parts[3];
  const repository = parts[4];
  const issuesLink = `https://api.github.com/repos/${username}/${repository}/issues`;
  return issuesLink;
};