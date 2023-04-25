export const getRepoUrl = (githubLink: string) => {
  const parts = githubLink.split('/');

  //the third part is taken because it is always username,
  // fourth because it is always the name of the repo
  return [parts[3], parts[4]];
};