import { fetchApi } from './api';

export const getOverview = () => fetchApi('/data/overview');
export const getRunTypes = () => fetchApi('/data/run-types');
export const getRewards = () => fetchApi('/data/rewards');
export const getShirtData = () => fetchApi('/data/shirts');
export const getMapData = () => fetchApi('/data/map');
export const getSchedule = () => fetchApi('/data/schedule');
export const getRules = () => fetchApi('/data/rules');
export const getContact = () => fetchApi('/data/contact');
