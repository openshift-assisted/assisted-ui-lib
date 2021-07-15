import React from 'react';
import { Redirect } from 'react-router-dom';
import { History } from 'history';
import { routeBasePath } from '../../config';

export const redirectToCluster = (history: History, id: string) => {
  history.push(`${routeBasePath}/clusters/${id}`);
};

const RedirectToCluster: React.FC<{ id: string }> = ({ id }) => (
  <Redirect to={`${routeBasePath}/clusters/${id}`} />
);

export default RedirectToCluster;
