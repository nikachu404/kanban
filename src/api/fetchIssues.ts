import { Issue } from '../types/Issue';

const fetchIssues = (url: string): Promise<Issue[]> => {
  return fetch(url)
    .then((response) => response.json());
};

export { fetchIssues };
