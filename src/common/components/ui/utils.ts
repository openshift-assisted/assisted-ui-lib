import { DASH } from '../constants';

export const getHumanizedDateTime = (dateTime?: string) => {
  if (!dateTime) return DASH;
  const date = new Date(dateTime);
  return date.toLocaleString();
};

export const getHumanizedTime = (dateTime?: string) => {
  if (!dateTime) return DASH;
  const date = new Date(dateTime);
  return date.toLocaleTimeString();
};
