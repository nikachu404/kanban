import { Issue } from '../types/Issue';

const fetchIssues = (url: string): Promise<Issue[]> => {
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

export { fetchIssues };
