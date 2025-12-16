export interface User {
	id: string;
	username?: string; // For login
	firstName: string;
	lastName: string;
	name: string; // Display name (full name)
	email: string;
	phone?: string;
	birthDate?: string;
	gender?: 'male' | 'female' | '';
	profileImage?: string;
	hasRegisteredRun?: boolean;
	runDetails?: RunnerData;
}

export interface RunnerData {
	firstName: string;
	lastName: string;
	age: string;
	gender: 'male' | 'female' | '';
	phone: string;
	email: string;
	category: 'funrun' | 'mini' | 'half' | '';
	shirtSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '';
	status?: 'pending' | 'paid' | 'approved' | 'rejected';
	bib?: string;
	paymentProof?: string;
}

export enum TabKey {
	OVERVIEW = 'overview',
	TYPES = 'types',
	REWARDS = 'rewards',
	SHIRT = 'shirt',
	MAP = 'map',
	SCHEDULE = 'schedule',
	RULES = 'rules',
	CONTACT = 'contact',
}

export interface TabItem {
	key: TabKey;
	label: string;
}

export interface Coordinate {
	lat: number;
	lng: number;
	name: string;
}

export interface RouteInfo {
	title: string;
	start: Coordinate;
	end: Coordinate;
	distance: string;
}

export type MapDataCollection = Record<string, RouteInfo>;
