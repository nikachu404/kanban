import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRepoApiLink } from '../../helpers/getRepoApiLink';
import axios from 'axios';

import { capitalizeFirstLetter } from '../../helpers/capitalizeFirstLetter';
import { formatStars } from '../../helpers/formatStars';

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
      try {
        const response = await axios.get(normalizedRepoUrl);
        setOwner(response.data.owner.login);
        setRepoName(response.data.name);
        setStars(response.data.stargazers_count);
      } catch (error) {
        console.log(error);
      }
    };
    getRepoData();
  }, [repoUrl]);

  return (
    <div className="breadcrumbs mt-1">
      <Link to={`https://github.com/${owner}`} target="_blank">{capitalizeFirstLetter(owner)}</Link> &gt;{' '}
      <Link to={`https://github.com/${owner}/${repoName}`} target="_blank">{capitalizeFirstLetter(repoName)}</Link> &gt;{' '}
      <span>
        {/* <img src="/kanban/src/assets/images/star.svg" alt="star" className="breadcrumbs__icon me-1" /> */}
        {formatStars(Number(stars))} stars
      </span>
    </div>
  );
};
