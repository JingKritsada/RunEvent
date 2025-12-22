export interface User {
	id: string;
	firstName: string;
	lastName: string;
	name: string;
	email: string;
	phone?: string;
	birthDate?: string;
	age?: number;
	gender?: 'male' | 'female' | '';
	profileImage?: string;
	hasRegisteredRun?: boolean;
	runDetails?: RunDetails;
}

export interface RunDetails {
	category: string;
	shirtSize: string;
	status?: 'pending' | 'approved' | 'rejected';
	bib?: string;
	paymentProof?: string;
}

export interface RegisterFormData {
	firstName: string;
	lastName: string;
	age: string;
	gender: string;
	phone: string;
	email: string;
	category: string;
	shirtSize: string;
	paymentProof: string;
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
