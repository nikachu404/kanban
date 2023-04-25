import React from 'react';
import { Link } from 'react-router-dom';

import { capitalizeFirstLetter, formatStars } from '../../helpers';

import './Breadcrumbs.scss';

const GITHUB_URL = 'https://github.com';
const STAR_ICON_URL = 'https://raw.githubusercontent.com/nikachu404/kanban/main/src/assets/images/star.svg';

interface Props {
  owner: string;
  repoName: string;
  stars: string;
}

export const Breadcrumbs: React.FC<Props> = ({ owner, repoName, stars }) => {
  return (
    <div className="breadcrumbs mt-1">
      <Link to={`${GITHUB_URL}/${owner}`} target="_blank">{capitalizeFirstLetter(owner)}</Link> &gt;{' '}
      <Link to={`${GITHUB_URL}/${owner}/${repoName}`} target="_blank">{capitalizeFirstLetter(repoName)}</Link> &gt;{' '}
      <span>
        <img src={STAR_ICON_URL} alt="star" className="breadcrumbs__icon me-1" />
        {formatStars(Number(stars))} stars
      </span>
    </div>
  );
};
