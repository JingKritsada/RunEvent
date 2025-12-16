import React from 'react';
import { Facebook, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
	return (
		<footer className="bg-gray-900 text-white pt-12 pb-6">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
					{/* Column 1: Info */}
					<div>
						<div className="flex items-center gap-2 mb-4">
							<div className="bg-brand-500 text-white p-1 rounded">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold">
								Phitsanulok Coop Run
							</h3>
						</div>
						<p className="text-gray-400 text-sm leading-relaxed">
							งานวิ่งการกุศลเพื่อสุขภาพและความสามัคคี
							โดยสหกรณ์ออมทรัพย์ครูพิษณุโลก จำกัด
							มาร่วมเป็นส่วนหนึ่งกับเราในการสร้างสังคมสุขภาพดี
						</p>
					</div>

					{/* Column 2: Links */}
					<div>
						<h3 className="text-lg font-semibold mb-4 text-brand-400">
							ลิงก์ด่วน
						</h3>
						<ul className="space-y-2 text-gray-400 text-sm">
							<li>
								<a
									href="#"
									className="hover:text-white transition-colors"
								>
									หน้าแรก
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-white transition-colors"
								>
									กำหนดการ
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-white transition-colors"
								>
									ตรวจสอบรายชื่อ
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-white transition-colors"
								>
									กติกาการแข่งขัน
								</a>
							</li>
						</ul>
					</div>

					{/* Column 3: Contact */}
					<div>
						<h3 className="text-lg font-semibold mb-4 text-brand-400">
							ติดต่อเรา
						</h3>
						<ul className="space-y-3 text-gray-400 text-sm">
							<li className="flex items-start gap-3">
								<MapPin className="w-5 h-5 text-brand-500 flex-shrink-0" />
								<span>
									สหกรณ์ออมทรัพย์ครูพิษณุโลก จำกัด <br />
									999 ถ.สีหราชเดโชชัย ต.ในเมือง อ.เมือง
									จ.พิษณุโลก
								</span>
							</li>
							<li className="flex items-center gap-3">
								<Phone className="w-5 h-5 text-brand-500" />
								<span>055-244-666</span>
							</li>
							<li className="flex items-center gap-3">
								<Mail className="w-5 h-5 text-brand-500" />
								<span>contact@phitsanulokcoop.com</span>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-gray-500 text-sm">
						© 2024 Phitsanulok Cooperative Run. All rights reserved.
					</p>
					<div className="flex space-x-4">
						<a
							href="#"
							className="text-gray-400 hover:text-white transition-colors"
						>
							<Facebook className="w-5 h-5" />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
