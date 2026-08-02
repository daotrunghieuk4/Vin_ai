import { useState, useEffect, useCallback } from 'react';
import { api, getImageUrl } from '@/lib/api';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import VehicleShowcase from '@/components/VehicleShowcase';
import CompareBar from '@/components/CompareBar';
import AIChatWidget from '@/components/AIChatWidget';
import StaffDrawer from '@/components/StaffDrawer';
import AdminDashboardModal from '@/components/AdminDashboardModal';
import AdminPortalModal from '@/components/AdminPortalModal';
import AuthModal from '@/components/AuthModal';
import UserProfileModal from '@/components/UserProfileModal';
import AftersalesPage from '@/pages/AftersalesPage';
import ChargingPage from '@/pages/ChargingPage';
import EnergyPage from '@/pages/EnergyPage';
import VehicleDetailModal from '@/components/VehicleDetailModal';
import CompareModal from '@/components/CompareModal';
import logoVinFast from '/VIN png/Pin/VinFast-logo.png';
import type { Role, Vehicle, FilterCategory, UserAccount } from '@/types';

export default function App() {
  const [role, setRole] = useState<Role>('customer');
  const [compareList, setCompareList] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [staffDrawerOpen, setStaffDrawerOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [currentView, setCurrentView] = useState<'home' | 'aftersales' | 'charging' | 'energy'>('home');

  // Detail Modal States
  const [detailVehicle, setDetailVehicle] = useState<Vehicle | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Auth & Profile Modal States
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<Role>('customer');

  const handleViewDetail = useCallback((vehicle: Vehicle) => {
    setDetailVehicle(vehicle);
    setDetailModalOpen(true);
    window.history.pushState({ modal: 'detail', vehicleId: vehicle.id }, '', `#detail-${vehicle.id}`);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailModalOpen(false);
    if (window.location.hash.startsWith('#detail')) {
      window.history.back();
    }
  }, []);

  const handleOpenCompare = useCallback(() => {
    setCompareModalOpen(true);
    if (!window.location.hash.startsWith('#compare')) {
      window.history.pushState({ modal: 'compare' }, '', '#compare');
    }
  }, []);

  const handleCloseCompare = useCallback(() => {
    setCompareModalOpen(false);
    if (window.location.hash.startsWith('#compare')) {
      window.history.back();
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (!window.location.hash.startsWith('#detail')) {
        setDetailModalOpen(false);
      }
      if (!window.location.hash.startsWith('#compare')) {
        setCompareModalOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (window.location.hash.startsWith('#compare')) {
      setCompareModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if (window.location.hash.startsWith('#detail-') && vehicles.length > 0) {
      const targetIdOrCode = window.location.hash.replace('#detail-', '');
      const found = vehicles.find((v) => v.id === targetIdOrCode || v.code === targetIdOrCode);
      if (found) {
        setDetailVehicle(found);
        setDetailModalOpen(true);
      }
    }
  }, [vehicles]);

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

  const handleAddCompare = useCallback((id: string) => {
    setCompareList((prev) => {
      let currentList = [...prev];
      if (currentList.length < 2 && vehicles.length >= 2) {
        const defaultIds = vehicles.slice(0, 2).map((v) => v.id);
        currentList = Array.from(new Set([...defaultIds, ...currentList]));
      }
      if (currentList.includes(id)) return currentList;
      if (currentList.length >= 3) return currentList;
      return [...currentList, id];
    });
  }, [vehicles]);

  const handleReplaceCompare = useCallback((oldId: string, newId: string) => {
    setCompareList((prev) => {
      let currentList = [...prev];
      if (currentList.length < 2 && vehicles.length >= 2) {
        const defaultIds = vehicles.slice(0, 2).map((v) => v.id);
        currentList = Array.from(new Set([...defaultIds, ...currentList]));
      }
      return currentList.map((item) => (item === oldId ? newId : item));
    });
  }, [vehicles]);

  useEffect(() => {
    if (compareModalOpen && compareList.length < 2 && vehicles.length >= 2) {
      setCompareList(vehicles.slice(0, 2).map((v) => v.id));
    }
  }, [compareModalOpen, compareList.length, vehicles]);

  const handleNavClick = useCallback((section: string) => {
    if (section === 'chat') {
      setChatOpen(true);
      return;
    }

    if (section === 'compare') {
      handleOpenCompare();
      return;
    }

    // When clicking logo, hero, or any other section, close compare modal and return home
    setCompareModalOpen(false);
    if (window.location.hash.startsWith('#compare')) {
      window.history.pushState(null, '', window.location.pathname);
    }

    if (section === 'aftersales' || section === 'charging' || section === 'energy') {
      setCurrentView(section);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Switch back to home view if in a subpage
    setCurrentView('home');

    setTimeout(() => {
      const targetId = section === 'hero' ? 'top' : section;
      const el = document.getElementById(targetId) ?? document.documentElement;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, [handleOpenCompare]);

  const handleSelectCategory = useCallback((category: FilterCategory) => {
    setActiveCategory(category);
    handleNavClick('showcase');
  }, [handleNavClick]);

  const handleRoleChange = useCallback((newRole: Role) => {
    setRole(newRole);
    if (newRole === 'customer') setStaffDrawerOpen(false);
  }, []);

  const handleOpenAuthModal = useCallback((defaultRole?: Role) => {
    setAuthDefaultRole(defaultRole || role);
    setAuthModalOpen(true);
  }, [role]);

  useEffect(() => {
    Promise.all([
      api.getCars<any[]>().catch(() => []),
      api.getEScooters<any[]>().catch(() => []),
    ]).then(([dbCars, dbScooters]) => {
      const carList: Vehicle[] = (dbCars || []).map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        tagline: c.description || 'Mẫu ô tô điện thông minh VinFast',
        category: 'suv',
        image: getImageUrl(c.image_url),
        basePrice: c.base_price,
        batteryBuyPrice: c.battery_buy_price,
        batteryRentMonthly: c.battery_rent_monthly,
        range: c.specs?.engine_drivetrain?.items?.range_km || c.specs?.driving_range || 400,
        battery: `${c.specs?.engine_drivetrain?.items?.battery_capacity_kwh || c.specs?.battery_capacity || 87} kWh`,
        acceleration: '5.5s (0-100 km/h)',
        topSpeed: 200,
        seats: c.specs?.dimensions_weight?.items?.seats || c.specs?.seating_capacity || 5,
        isNew: true,
        colors: ['#0F172A', '#DC2626', '#FFFFFF', '#2563EB'],
        description: c.description || '',
        highlights: ['Hệ thống ADAS thông minh', 'Trợ lý ảo tiếng Việt ViVi', 'Sạc siêu nhanh 10-70%', 'Khung gầm bảo vệ 5 sao'],
        rawSpecs: c.specs,
      }));

      const scooterList: Vehicle[] = (dbScooters || []).map((s) => ({
        id: s.id,
        code: s.code,
        name: s.name,
        tagline: s.description || 'Mẫu xe máy điện thông minh VinFast',
        category: 'scooter',
        image: getImageUrl(s.image_url),
        basePrice: s.base_price,
        batteryBuyPrice: s.battery_buy_price,
        batteryRentMonthly: s.battery_rent_monthly,
        range: s.specs?.range_km || 198,
        battery: 'Pin LFP chống cháy',
        acceleration: 'Vận tốc max: ' + (s.specs?.top_speed || '78 km/h'),
        topSpeed: 80,
        seats: 2,
        isNew: true,
        colors: ['#0F172A', '#DC2626', '#FFFFFF', '#2563EB'],
        description: s.description || '',
        highlights: ['Khung sườn chịu lực', 'Kháng nước IP67', 'Pin LFP tuổi thọ cao', 'Định vị GPS & Khóa Smartkey'],
        rawSpecs: s.specs,
      }));

      setVehicles([...carList, ...scooterList]);
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('vinfast_token');
    if (token) {
      api.getMe<any>()
        .then((me) => {
          const userAcc: UserAccount = {
            id: me.id,
            name: me.full_name,
            email: me.email,
            phone: me.phone,
            role: me.role === 'admin' ? 'admin' : (me.role === 'consultant' ? 'staff' : 'customer'),
            staffRole: me.role === 'admin' ? 'Quản trị viên Hệ thống' : 'Tư vấn bán hàng',
            employeeId: 'VF-ADMIN',
            showroom: 'VinFast Landmark 81',
            memberLevel: 'Gold',
          };
          setCurrentUser(userAcc);
          setRole(userAcc.role);
        })
        .catch(() => {
          localStorage.removeItem('vinfast_token');
        });
    }
  }, []);

  const handleLoginSuccess = useCallback((user: UserAccount) => {
    setCurrentUser(user);
    setRole(user.role);
    if (user.role === 'admin') {
      setAdminDashboardOpen(true);
    } else if (user.role === 'staff') {
      setStaffDrawerOpen(true);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('vinfast_token');
    setCurrentUser(null);
    setRole('customer');
    setStaffDrawerOpen(false);
    setAdminDashboardOpen(false);
    setProfileModalOpen(false);
  }, []);


  const handleRequestQuote = useCallback((_vehicle: Vehicle) => {
    setChatOpen(true);
  }, []);

  return (
    <div id="top" className="min-h-screen bg-white font-sans antialiased">
      <Header
        role={role}
        onRoleChange={handleRoleChange}
        onOpenStaff={() => {
          if (currentUser?.role === 'admin') {
            setAdminDashboardOpen(true);
          } else {
            setStaffDrawerOpen(true);
          }
        }}
        onNavClick={handleNavClick}
        onSelectCategory={handleSelectCategory}
        currentView={currentView}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenAdminPortal={() => setAdminPortalOpen(true)}
        onOpenProfileModal={() => setProfileModalOpen(true)}
        onLogout={handleLogout}
      />

      <main>
        {currentView === 'aftersales' && (
          <AftersalesPage
            onBackToHome={() => handleNavClick('top')}
            onOpenChat={() => setChatOpen(true)}
          />
        )}

        {currentView === 'charging' && (
          <ChargingPage
            onBackToHome={() => handleNavClick('top')}
            onOpenChat={() => setChatOpen(true)}
          />
        )}

        {currentView === 'energy' && (
          <EnergyPage
            onBackToHome={() => handleNavClick('top')}
            onOpenChat={() => setChatOpen(true)}
          />
        )}

        {currentView === 'home' && (
          <>
            <Hero
              onExplore={() => handleNavClick('showcase')}
              onChat={() => setChatOpen(true)}
            />

            <VehicleShowcase
              compareList={compareList}
              onToggleCompare={handleToggleCompare}
              onRequestQuote={handleRequestQuote}
              onViewDetail={handleViewDetail}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {/* Pricing section */}
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
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ fontFamily: '"Mulish", serif' }} className="bg-slate-950 text-white pt-14 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Quick Navigation Links */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <img src={logoVinFast} alt="VinFast Logo" className="h-8 w-auto object-contain brightness-0 invert" />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm font-bold text-slate-300">
              <button onClick={() => handleNavClick('top')} className="hover:text-white transition-colors uppercase">VỀ VINFAST</button>
              <span className="text-slate-700">|</span>
              <a href="https://vingroup.net" target="_blank" rel="noreferrer" className="hover:text-white transition-colors uppercase">VỀ VINGROUP</a>
              <span className="text-slate-700">|</span>
              <button onClick={() => handleNavClick('top')} className="hover:text-white transition-colors uppercase">TIN TỨC</button>
              <span className="text-slate-700">|</span>
              <button onClick={() => handleNavClick('top')} className="hover:text-white transition-colors uppercase">SHOWROOM & ĐẠI LÝ</button>
              <span className="text-slate-700">|</span>
              <button onClick={() => handleNavClick('top')} className="hover:text-white transition-colors uppercase">ĐIỀU KHOẢN CHÍNH SÁCH</button>
            </div>
          </div>

          {/* Main Footer Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-10 text-xs text-slate-400 leading-relaxed border-b border-slate-800">
            {/* Column 1: Legal Company Info */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-sm">Công ty TNHH Kinh doanh Thương mại và Dịch vụ VinFast</h4>
              <p>
                <strong>MST/MSDN:</strong> 0108926276 do Sở KHĐT TP Hà Nội cấp lần đầu ngày 01/10/2019 và các lần thay đổi tiếp theo.
              </p>
              <p>
                <strong>Địa chỉ trụ sở chính:</strong> Số 7, Đường Bằng Lăng 1, Khu đô thị Vinhomes Riverside, Phường Phúc Lợi, Thành phố Hà Nội, Việt Nam.
              </p>
              <p>
                <strong>Người đại diện theo pháp luật:</strong> Nguyễn Mai Hoa.
              </p>
              <p>
                <strong>Chức vụ:</strong> Chủ tịch Hội đồng thành viên.
              </p>
            </div>

            {/* Column 2: Customer Service & Speak-Up */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Dịch Vụ Khách Hàng</h4>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="text-white font-bold">📞 Tổng đài CSKH 24/7</div>
                <div className="text-blue-400 text-sm font-extrabold">1900 23 23 89 - Nhánh 1</div>
                <div>Email: <a href="mailto:support.vn@vinfastauto.com" className="text-slate-300 hover:text-white underline">support.vn@vinfastauto.com</a></div>
              </div>

              <div className="pt-1">
                <h4 className="font-bold text-white text-xs mb-1 uppercase tracking-wider">SPEAK-UP HOTLINE</h4>
                <p>Website: <a href="https://vinfast.ethicspoint.com/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">vinfast.ethicspoint.com</a></p>
                <p>Email: <a href="mailto:v.speakup@vinfast.vn" className="text-slate-300 hover:text-white underline">v.speakup@vinfast.vn</a></p>
              </div>
            </div>

            {/* Column 3: Vingroup Ecosystem */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Hệ Sinh Thái Vingroup</h4>
              <ul className="space-y-2 text-sm text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <a href="https://vinhomes.vn" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Vinhomes</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <a href="https://vinmec.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Vinmec</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <a href="https://vinpearl.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Vinpearl</a>
                </li>
              </ul>
            </div>

            {/* Column 4: Social & MoIT Certification */}
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white text-sm mb-2">Kết Nối Với VinFast</h4>
                <div className="flex flex-wrap gap-1.5">
                  {['Facebook', 'YouTube', 'TikTok', 'LinkedIn'].map((social) => (
                    <span key={social} className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 rounded-md">
                      {social}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <div className="inline-flex items-center gap-2.5 p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="w-7 h-7 rounded-full bg-red-600/20 border border-red-500 text-red-500 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="text-white font-bold text-[11px]">Đã Đăng Ký Bộ Công Thương</div>
                    <div className="text-[10px] text-slate-400">Chứng nhận thương mại điện tử</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>© Copyright 2025 VinFast. All rights reserved.</div>
            <div>Tiên phong tương lai di chuyển xanh</div>
          </div>
        </div>
      </footer>

      {/* Compare bar */}
      <CompareBar
        compareList={compareList}
        allVehicles={vehicles}
        onClear={handleClearCompare}
        onRemove={handleRemoveCompare}
        onOpenCompare={handleOpenCompare}
      />

      {/* Compare Modal Matrix */}
      <CompareModal
        open={compareModalOpen}
        onClose={handleCloseCompare}
        selectedIds={compareList}
        allVehicles={vehicles}
        onRemoveVehicle={handleRemoveCompare}
        onAddVehicle={handleAddCompare}
        onReplaceVehicle={handleReplaceCompare}
        onRequestQuote={handleRequestQuote}
        onOpenChatWithCompare={() => setChatOpen(true)}
      />

      {/* AI Chat */}
      <AIChatWidget
        externalOpen={chatOpen}
        onExternalOpenChange={setChatOpen}
        onRequestQuote={handleRequestQuote}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        open={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
      />

      {/* Staff drawer */}
      <StaffDrawer
        open={staffDrawerOpen}
        onClose={() => setStaffDrawerOpen(false)}
      />

      {/* Auth Modal for Customers */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        defaultRole={authDefaultRole}
      />

      {/* Admin & Corporate Staff Portal Modal */}
      <AdminPortalModal
        isOpen={adminPortalOpen}
        onClose={() => setAdminPortalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* User Profile Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          user={currentUser}
          onLogout={handleLogout}
          onOpenStaffConsole={() => {
            if (currentUser.role === 'admin') {
              setAdminDashboardOpen(true);
            } else {
              setStaffDrawerOpen(true);
            }
          }}
          onOpenChat={() => setChatOpen(true)}
        />
      )}

      {/* Vehicle Detail Modal for Guest */}
      <VehicleDetailModal
        vehicle={detailVehicle}
        allVehicles={vehicles}
        open={detailModalOpen}
        onClose={handleCloseDetail}
        onRequestQuote={handleRequestQuote}
        onOpenChat={() => setChatOpen(true)}
      />
    </div>
  );
}


