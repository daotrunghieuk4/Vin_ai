import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import VehicleShowcase from '@/components/VehicleShowcase';
import CompareBar from '@/components/CompareBar';
import AIChatWidget from '@/components/AIChatWidget';
import StaffDrawer from '@/components/StaffDrawer';
import type { Role, Vehicle } from '@/types';

export default function App() {
  const [role, setRole] = useState<Role>('customer');
  const [compareList, setCompareList] = useState<string[]>([]);
  const [staffDrawerOpen, setStaffDrawerOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const handleToggleCompare = useCallback((id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, []);

  const handleRemoveCompare = useCallback((id: string) => {
    setCompareList((prev) => prev.filter((v) => v !== id));
  }, []);

  const handleClearCompare = useCallback(() => setCompareList([]), []);

  const handleNavClick = useCallback((section: string) => {
    if (section === 'chat') {
      setChatOpen(true);
      return;
    }
    const el = document.getElementById(section) ?? document.documentElement;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleRoleChange = useCallback((newRole: Role) => {
    setRole(newRole);
    if (newRole === 'customer') setStaffDrawerOpen(false);
  }, []);

  const handleRequestQuote = useCallback((vehicle: Vehicle) => {
    setChatOpen(true);
    // The chat widget will handle quote flow
  }, []);

  return (
    <div id="top" className="min-h-screen bg-white font-sans antialiased">
      <Header
        role={role}
        onRoleChange={handleRoleChange}
        onOpenStaff={() => setStaffDrawerOpen(true)}
        onNavClick={handleNavClick}
      />

      <main>
        <Hero
          onExplore={() => handleNavClick('showcase')}
          onChat={() => setChatOpen(true)}
        />

        <VehicleShowcase
          compareList={compareList}
          onToggleCompare={handleToggleCompare}
          onRequestQuote={handleRequestQuote}
        />

        {/* Pricing section placeholder */}
        <section id="pricing" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full bg-blue-600" />
              <span className="text-xs font-bold text-blue-600 tracking-widest uppercase">Bảng giá</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Giá bán lẻ đề xuất</h2>
            <p className="text-gray-500 mb-10 max-w-xl mx-auto">Giá chưa bao gồm phí đăng ký, bảo hiểm. Liên hệ showroom để biết ưu đãi mới nhất.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    {['Dòng xe', 'Phiên bản', 'Giá niêm yết', 'Pin', 'Phạm vi', 'Ghế'].map((h) => (
                      <th key={h} className="px-5 py-3.5 font-semibold first:rounded-tl-xl last:rounded-tr-xl">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['VF 3', 'Standard', '235.000.000', '19,6 kWh', '210 km', '4'],
                    ['VF 5', 'Plus', '458.000.000', '37,23 kWh', '326 km', '5'],
                    ['VF 6', 'Eco / Plus', '675.000.000', '59,6 kWh', '399 km', '5'],
                    ['VF 7', 'Eco / Plus', '850.000.000', '75,3 kWh', '431 km', '5'],
                    ['VF 8', 'Eco / Plus', '1.057.000.000', '87,7 kWh', '447 km', '5'],
                    ['VF 9', 'Eco / Plus', '1.478.000.000', '92 kWh', '438 km', '7'],
                    ['Klara S', 'Standard', '30.000.000', '1,6 kWh', '65 km', '2'],
                    ['Theon S', 'Standard', '50.000.000', '3,28 kWh', '100 km', '2'],
                  ].map((row, i) => (
                    <tr key={row[0]} className={`border-b border-gray-100 hover:bg-blue-50/40 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      {row.map((cell, j) => (
                        <td key={j} className={`px-5 py-3.5 ${j === 0 ? 'font-bold text-blue-800' : 'text-gray-700'} ${j === 2 ? 'font-semibold text-gray-900' : ''}`}>
                          {j === 2 ? `${parseInt(cell.replace(/\./g, '')).toLocaleString('vi-VN')} ₫` : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Test drive section */}
        <section id="testdrive" className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="absolute rounded-full border-2 border-white"
                style={{ width: `${200 + i * 150}px`, height: `${200 + i * 150}px`, left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} />
            ))}
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3 py-1 bg-white/10 text-blue-200 text-xs font-bold rounded-full tracking-widest uppercase mb-4 border border-white/20">
              Lái thử miễn phí
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Trải nghiệm VinFast<br />tại showroom gần bạn
            </h2>
            <p className="text-blue-200 text-base mb-8 max-w-xl mx-auto">
              Đặt lịch lái thử ngay hôm nay — hoàn toàn miễn phí. Chúng tôi sẽ liên hệ xác nhận trong vòng 2 giờ.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setChatOpen(true)}
                className="px-8 py-4 bg-white text-blue-900 text-base font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:scale-105"
              >
                Đặt lịch qua AI Advisor
              </button>
              <button
                onClick={() => handleNavClick('showcase')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-base font-semibold rounded-xl border border-white/25 transition-all hover:scale-105"
              >
                Xem dòng xe
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-xs">V</span>
                </div>
                <span className="font-bold text-lg">VinFast</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Tiên phong trong ngành xe điện Việt Nam — hướng tới tương lai xanh, bền vững.
              </p>
            </div>
            {[
              { title: 'Dòng xe', links: ['VF 3', 'VF 5', 'VF 6', 'VF 7', 'VF 8', 'VF 9'] },
              { title: 'Hỗ trợ', links: ['Bảo hành & bảo dưỡng', 'Mạng lưới sạc', 'Ứng dụng VinFast', 'Liên hệ showroom'] },
              { title: 'Thông tin', links: ['Về VinFast', 'Tuyển dụng', 'Tin tức', 'Chính sách bảo mật'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-white mb-3 text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-gray-500 text-xs">
            <span>© {new Date().getFullYear()} VinFast Trading & Investment JSC. Bảo lưu mọi quyền.</span>
            <span>Hotline: 1800 2345 · support@vinfast.vn</span>
          </div>
        </div>
      </footer>

      {/* Compare bar */}
      <CompareBar
        compareList={compareList}
        onClear={handleClearCompare}
        onRemove={handleRemoveCompare}
      />

      {/* AI Chat */}
      <AIChatWidget
        externalOpen={chatOpen}
        onExternalOpenChange={setChatOpen}
        onRequestQuote={handleRequestQuote}
      />

      {/* Staff drawer */}
      <StaffDrawer
        open={staffDrawerOpen}
        onClose={() => setStaffDrawerOpen(false)}
      />
    </div>
  );
}
