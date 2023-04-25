import { getRepoUrl } from './getRepoUrl';

export const getRepoApiLink = (githubLink: string) => {
  const [username, repository] = getRepoUrl(githubLink);
  return `https://api.github.com/repos/${username}/${repository}`;
};