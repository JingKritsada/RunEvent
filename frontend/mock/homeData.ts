export const MOCK_OVERVIEW = {
	bannerUrl: 'https://picsum.photos/1200/600',
	title: 'Phitsanulok Cooperative Run 2024 (Official)',
	description:
		'ขอเชิญชวนสมาชิกสหกรณ์และประชาชนทั่วไป ร่วมเดิน-วิ่ง การกุศล "Phitsanulok Coop Run 2024" เพื่อส่งเสริมสุขภาพและนำรายได้ส่วนหนึ่งสมทบทุนจัดซื้ออุปกรณ์ทางการแพทย์ให้กับโรงพยาบาลในจังหวัดพิษณุโลก พบกับบรรยากาศยามเช้าที่สดชื่น และเส้นทางวิ่งที่สวยงาม เลียบแม่น้ำน่าน',
	date: 'วันอาทิตย์ที่ 15 ธันวาคม 2567',
};

export const MOCK_RUN_TYPES = [
	{
		title: 'Fun Run',
		dist: '5 KM',
		price: '450 บาท',
		color: 'bg-blue-500',
		benefits: [
			'เสื้อที่ระลึก 1 ตัว',
			'เหรียญรางวัลเมื่อเข้าเส้นชัย',
			'อาหารและเครื่องดื่ม',
		],
	},
	{
		title: 'Mini Marathon',
		dist: '10.5 KM',
		price: '550 บาท',
		color: 'bg-green-500',
		benefits: [
			'เสื้อที่ระลึก 1 ตัว',
			'เหรียญรางวัลเมื่อเข้าเส้นชัย',
			'อาหารและเครื่องดื่ม',
			'ชิพจับเวลา',
		],
	},
	{
		title: 'Half Marathon',
		dist: '21.1 KM',
		price: '750 บาท',
		color: 'bg-purple-500',
		benefits: [
			'เสื้อที่ระลึก 1 ตัว',
			'เหรียญรางวัลเมื่อเข้าเส้นชัย',
			'อาหารและเครื่องดื่ม',
			'ชิพจับเวลา',
			'Finisher Shirt',
		],
	},
];

export const MOCK_REWARDS = {
	overall: {
		title: 'Over All',
		prize: 'เงินรางวัล 5,000 บาท พร้อมถ้วยเกียรติยศจากผู้ว่าราชการจังหวัด',
	},
	ageGroup: {
		title: 'รุ่นกลุ่มอายุ',
		prize: 'ถ้วยรางวัล อันดับ 1-5 ของทุกรุ่นอายุ',
	},
	description:
		'การตัดสินใช้ระบบ Gun Time สำหรับ Overall และ Chip Time สำหรับรุ่นอายุ',
};

export const MOCK_SHIRT_DATA = {
	sizes: [
		{ size: 'XS', chest: 34, len: 25 },
		{ size: 'S', chest: 36, len: 26 },
		{ size: 'M', chest: 38, len: 27 },
		{ size: 'L', chest: 40, len: 28 },
		{ size: 'XL', chest: 42, len: 29 },
		{ size: '2XL', chest: 44, len: 30 },
		{ size: '3XL', chest: 46, len: 31 },
	],
	images: {
		front: 'https://picsum.photos/400/400?random=1',
		back: 'https://picsum.photos/400/400?random=2',
	},
};

// Updated to use multiple routes
export const MOCK_MAP_DATA = {
	funrun: {
		title: 'Fun Run 5 KM',
		start: {
			lat: 16.8243,
			lng: 100.2608,
			name: 'สหกรณ์ออมทรัพย์ครูพิษณุโลก',
		},
		end: {
			lat: 16.829,
			lng: 100.265,
			name: 'จุดกลับตัว 2.5 กม.',
		},
		distance: '5 KM',
	},
	mini: {
		title: 'Mini Marathon 10.5 KM',
		start: {
			lat: 16.8243,
			lng: 100.2608,
			name: 'สหกรณ์ออมทรัพย์ครูพิษณุโลก',
		},
		end: {
			lat: 16.815,
			lng: 100.262,
			name: 'สวนชมน่านเฉลิมพระเกียรติ',
		},
		distance: '10.5 KM',
	},
	half: {
		title: 'Half Marathon 21.1 KM',
		start: {
			lat: 16.8243,
			lng: 100.2608,
			name: 'สหกรณ์ออมทรัพย์ครูพิษณุโลก',
		},
		end: {
			lat: 16.8,
			lng: 100.25,
			name: 'วัดพระศรีรัตนมหาธาตุ (วัดใหญ่)',
		},
		distance: '21.1 KM',
	},
};

export const MOCK_SCHEDULE = [
	{ time: '04:00 น.', event: 'เปิดพื้นที่ รับฝากของ' },
	{ time: '04:45 น.', event: 'วอร์มอัพร่างกาย' },
	{ time: '05:00 น.', event: 'ปล่อยตัวระยะ 21.1 KM' },
	{ time: '05:30 น.', event: 'ปล่อยตัวระยะ 10.5 KM' },
	{ time: '05:45 น.', event: 'ปล่อยตัวระยะ 5 KM' },
	{ time: '07:30 น.', event: 'พิธีมอบรางวัล' },
	{ time: '09:00 น.', event: 'ปิดการจราจร คืนพื้นที่' },
];

export const MOCK_RULES = [
	'การตัดสินของคณะกรรมการถือเป็นที่สิ้นสุด',
	'ต้องติด BIB ด้านหน้าให้เห็นชัดเจน หากไม่มี BIB จะไม่มีสิทธิ์รับรางวัล',
	'การประท้วงผลการแข่งขัน ต้องทำภายใน 30 นาที หลังประกาศผล',
	'นักวิ่งต้องวิ่งผ่านจุด Checkpoint ครบทุกจุด',
	'ห้ามให้น้ำเกลือระหว่างการแข่งขัน',
];

export const MOCK_CONTACT = {
	phone: '055-244-666 (เวลาทำการ)',
	facebook: 'Phitsanulok Coop Run Official',
	line: '@phitsanulokcoop',
	address: '999 ถ.สีหราชเดโชชัย ต.ในเมือง อ.เมือง จ.พิษณุโลก',
};
