import { getRepoUrl } from './getRepoUrl';

export const getIssuesApiLink = (githubLink: string) => {
  const [username, repository] = getRepoUrl(githubLink);
  return `https://api.github.com/repos/${username}/${repository}/issues?state=all`;
};