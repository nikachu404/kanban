import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRepoApiLink } from '../../helpers/getRepoApiLink';
import axios from 'axios';

import star from '../../assets/images/star.svg';
import './Breadcrumbs.scss';

interface Props {
  repoUrl: string;
}

export const Breadcrumbs: React.FC<Props> = ({ repoUrl }) => {
  const [owner, setOwner] = useState('');
  const [repoName, setRepoName] = useState('');
  const [stars, setStars] = useState('');

  useEffect(() => {
    const getRepoData = async () => {
      const normalizedRepoUrl = getRepoApiLink(repoUrl);
      const response = await axios.get(normalizedRepoUrl);
      setOwner(response.data.owner.login);
      setRepoName(response.data.name);
      setStars(response.data.stargazers_count);
    };
    getRepoData();
  }, [repoUrl]);

  return (
    <div className="breadcrumbs mt-1">
      <Link to={`https://github.com/${owner}`} target="_blank">{owner.charAt(0).toLocaleUpperCase() + owner.slice(1)}</Link> &gt;{' '}
      <Link to={`https://github.com/${owner}/${repoName}`} target="_blank">{repoName.charAt(0).toLocaleUpperCase() + repoName.slice(1)}</Link> &gt;{' '}
      <span>
        <img src={star} alt="star" className="breadcrumbs__icon me-1" />
        {stars} stars
      </span>
    </div>
  );
};