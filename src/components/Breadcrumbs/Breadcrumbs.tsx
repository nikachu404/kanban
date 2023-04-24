import React from 'react';
import { Link } from 'react-router-dom';

import { capitalizeFirstLetter } from '../../helpers/capitalizeFirstLetter';
import { formatStars } from '../../helpers/formatStars';

import './Breadcrumbs.scss';

interface Props {
  owner: string;
  repoName: string;
  stars: string;
}

export const Breadcrumbs: React.FC<Props> = ({ owner, repoName, stars }) => {
  return (
    <div className="breadcrumbs mt-1">
      <Link to={`https://github.com/${owner}`} target="_blank">{capitalizeFirstLetter(owner)}</Link> &gt;{' '}
      <Link to={`https://github.com/${owner}/${repoName}`} target="_blank">{capitalizeFirstLetter(repoName)}</Link> &gt;{' '}
      <span>
        <img src="https://raw.githubusercontent.com/nikachu404/kanban/main/src/assets/images/star.svg" alt="star" className="breadcrumbs__icon me-1" />
        {formatStars(Number(stars))} stars
      </span>
    </div>
  );
};
