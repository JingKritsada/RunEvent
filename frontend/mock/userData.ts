import { User } from '../types/index';

// Extended type for mock data to include password
export interface MockUser extends User {
	password?: string;
}

export const MOCK_USERS: MockUser[] = [
	{
		id: 'user01',
		username: 'user01',
		password: '12345678',
		firstName: 'สมชาย',
		lastName: 'ใจดี',
		name: 'สมชาย ใจดี',
		email: 'user01@example.com',
		phone: '0812345678',
		birthDate: '1990-01-01',
		gender: 'male',
		hasRegisteredRun: true,
		profileImage:
			'https://ui-avatars.com/api/?name=สมชาย+ใจดี&background=random',
		runDetails: {
			firstName: 'สมชาย',
			lastName: 'ใจดี',
			age: '34',
			gender: 'male',
			phone: '0812345678',
			email: 'user01@example.com',
			category: 'mini',
			shirtSize: 'L',
			status: 'approved',
			bib: '1024',
		},
	},
	{
		id: 'user02',
		username: 'user02',
		password: '12345678',
		firstName: 'สมหญิง',
		lastName: 'รักวิ่ง',
		name: 'สมหญิง รักวิ่ง',
		email: 'user02@example.com',
		phone: '0898765432',
		birthDate: '1995-05-15',
		gender: 'female',
		profileImage:
			'https://ui-avatars.com/api/?name=สมหญิง+รักวิ่ง&background=random',
		hasRegisteredRun: false,
	},
	{
		id: 'user03',
		username: 'user03',
		password: '12345678',
		firstName: 'มานะ',
		lastName: 'อดทน',
		name: 'มานะ อดทน',
		email: 'user03@example.com',
		phone: '0855555555',
		birthDate: '1985-12-30',
		gender: 'male',
		profileImage:
			'https://ui-avatars.com/api/?name=มานะ+อดทน&background=random',
		hasRegisteredRun: false,
	},
];
