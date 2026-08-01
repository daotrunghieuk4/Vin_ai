import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, User, UserCog, LogIn, LogOut, ShieldCheck, Sparkles, LayoutDashboard } from 'lucide-react';
import logoVinFast from '/VIN png/Pin/VinFast-logo.png';
import type { Role, FilterCategory, UserAccount } from '@/types';

interface HeaderProps {
  role: Role;
  onRoleChange: (role: Role) => void;
  onOpenStaff: () => void;
  onNavClick: (section: string) => void;
  onSelectCategory?: (category: FilterCategory) => void;
  currentView?: 'home' | 'aftersales' | 'charging' | 'energy';
  currentUser?: UserAccount | null;
  onOpenAuthModal?: (defaultRole?: Role) => void;
  onOpenAdminPortal?: () => void;
  onOpenProfileModal?: () => void;
  onLogout?: () => void;
}

export default function Header({
  role,
  onRoleChange,
  onOpenStaff,
  onNavClick,
  onSelectCategory,
  currentView = 'home',
  currentUser,
  onOpenAuthModal,
  onOpenAdminPortal,
  onOpenProfileModal,
  onLogout,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileVehicleOpen, setMobileVehicleOpen] = useState(true);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [vehicleMenuOpen, setVehicleMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const isSolid = scrolled || currentView !== 'home';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
        setVehicleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVehicleMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setVehicleMenuOpen(false);
    }, 200);
  };

  const navItems = [
    { label: 'Bảng giá', section: 'pricing' },
    { label: 'So sánh xe', section: 'compare' },
    { label: 'Dịch vụ hậu mãi', section: 'aftersales' },
    { label: 'Pin và trạm sạc', section: 'charging' },
    { label: 'Lưu trữ năng lượng', section: 'energy' },
  ];

  return (
    <header
      style={{ fontFamily: '"Mulish", serif' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolid
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      {role === 'staff' && (
        <div className="bg-blue-900 text-white text-xs text-center py-1.5 tracking-wide font-bold uppercase flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-amber-400" />
          <span>CHẾ ĐỘ NHÂN VIÊN — Bạn đang xem với quyền quản lý showroom</span>
          {currentUser?.employeeId && (
            <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-mono">
              [{currentUser.employeeId}]
            </span>
          )}
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20" ref={navRef}>
          {/* Logo */}
          <div
            onClick={() => onNavClick('hero')}
            className="flex items-center cursor-pointer group shrink-0"
          >
            <img
              src={logoVinFast}
              alt="VinFast Logo"
              className={`h-7 sm:h-9 w-auto object-contain transition-all group-hover:scale-105 filter drop-shadow-md ${isSolid ? '' : 'brightness-0 invert'}`}
            />
          </div>

          {/* Nav items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-shrink">
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 px-2 xl:px-2.5 py-1.5 text-xs xl:text-xs font-extrabold uppercase tracking-wide whitespace-nowrap transition-colors ${
                  isSolid
                    ? 'text-gray-700 hover:text-blue-700'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                <span>Dòng xe</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    vehicleMenuOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {vehicleMenuOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 text-xs font-bold text-gray-700 animate-fadeIn z-50">
                  <div className="px-3 py-1.5 text-[10px] text-gray-400 uppercase tracking-widest">
                    Danh mục xe VinFast
                  </div>
                  <button
                    onClick={() => {
                      onSelectCategory?.('all');
                      setVehicleMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center justify-between"
                  >
                    <span>Tất cả các dòng xe</span>
                    <Sparkles size={14} className="text-amber-500" />
                  </button>
                  <button
                    onClick={() => {
                      onSelectCategory?.('suv');
                      setVehicleMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    Ô tô điện SUV (VF 3 - VF 9)
                  </button>
                  <button
                    onClick={() => {
                      onSelectCategory?.('scooter');
                      setVehicleMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    Xe máy điện Thể thao & Đô thị
                  </button>
                </div>
              )}
            </div>

            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => onNavClick(item.section)}
                className={`px-2 xl:px-2.5 py-1.5 text-xs xl:text-xs font-extrabold uppercase tracking-wide whitespace-nowrap transition-colors ${
                  isSolid
                    ? 'text-gray-700 hover:text-blue-700'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            <div className="relative">
              <button
                onClick={() => {
                  setRoleMenuOpen((o) => !o);
                  setVehicleMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-extrabold uppercase tracking-wider transition-all whitespace-nowrap ${
                  isSolid
                    ? 'border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-700 bg-white shadow-sm'
                    : 'border-white/30 text-white hover:border-white bg-white/10'
                }`}
              >
                {currentUser ? (
                  <>
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                      alt={currentUser.name}
                      className="w-5 h-5 rounded-full object-cover border border-white/50 shrink-0"
                    />
                    <span className="max-w-[90px] truncate">{currentUser.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold shrink-0 ${
                      currentUser.role === 'staff' ? 'bg-amber-500 text-white' : currentUser.role === 'admin' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {currentUser.role === 'admin' ? 'ADMIN' : currentUser.role === 'staff' ? 'NV' : 'KH'}
                    </span>
                  </>
                ) : (
                  <>
                    <User size={15} />
                    <span>TÀI KHOẢN</span>
                  </>
                )}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    roleMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 py-1">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                        <div className="text-xs font-extrabold text-slate-800 truncate">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                      </div>

                      <button
                        onClick={() => {
                          setRoleMenuOpen(false);
                          onOpenProfileModal?.();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <User size={15} />
                        Tài khoản của tôi
                      </button>

                      {(role === 'staff' || role === 'admin') && (
                        <button
                          onClick={() => {
                            setRoleMenuOpen(false);
                            onOpenStaff();
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-colors ${
                            role === 'admin'
                              ? 'text-red-700 bg-red-50/70 hover:bg-red-100'
                              : 'text-amber-700 bg-amber-50/50 hover:bg-amber-100'
                          }`}
                        >
                          <LayoutDashboard size={15} />
                          {role === 'admin' ? 'Mở Trang Quản trị Admin' : 'Bảng quản trị Sales CRM'}
                        </button>
                      )}

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={() => {
                          setRoleMenuOpen(false);
                          onLogout?.();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} />
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Cổng đăng nhập hệ thống
                      </div>
                      <button
                        onClick={() => {
                          setRoleMenuOpen(false);
                          onOpenAuthModal?.('customer');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <User size={16} className="text-blue-600" />
                        <div className="text-left">
                          <div className="font-black text-slate-900">Đăng nhập Khách hàng</div>
                          <div className="text-[10px] text-slate-400 font-normal">Mua xe & theo dõi báo giá</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setRoleMenuOpen(false);
                          onOpenAdminPortal?.();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-700 bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                      >
                        <ShieldCheck size={16} className="text-blue-400" />
                        <div className="text-left">
                          <div className="font-black text-white">Cổng Cán bộ VinFast</div>
                          <div className="text-[10px] text-slate-400 font-normal">Quản trị Admin & Tư vấn viên</div>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {currentUser?.role === 'admin' ? (
              <button
                onClick={onOpenStaff}
                className="px-3.5 lg:px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                <LayoutDashboard size={15} />
                <span>TRANG QUẢN TRỊ ADMIN</span>
              </button>
            ) : currentUser?.role === 'staff' ? (
              <button
                onClick={onOpenStaff}
                className="px-3.5 lg:px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                <LayoutDashboard size={15} />
                <span>BẢNG SALES CRM</span>
              </button>
            ) : (
              <button
                onClick={() => onNavClick('testdrive')}
                className="px-3.5 lg:px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs xl:text-sm font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-md hover:scale-105 shrink-0 whitespace-nowrap"
              >
                ĐĂNG KÝ LÁI THỬ
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className={`lg:hidden p-2 rounded-lg transition-colors flex-shrink-0 ${
              isSolid
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {/* Dòng xe mobile expander */}
            <div>
              <button
                onClick={() => setMobileVehicleOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-bold text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <span>Dòng xe</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    mobileVehicleOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {mobileVehicleOpen && (
                <div className="flex items-center gap-2 pl-4 py-1.5 mb-2">
                  <button
                    onClick={() => {
                      onSelectCategory?.('suv');
                      setMobileOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    Ô tô điện
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => {
                      onSelectCategory?.('scooter');
                      setMobileOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    Xe máy điện
                  </button>
                </div>
              )}
            </div>

            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => {
                  onNavClick(item.section);
                  setMobileOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                {item.label}
              </button>
            ))}

            <div className="pt-3 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  if (currentUser) {
                    onOpenProfileModal?.();
                  } else {
                    onOpenAuthModal?.(role);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-extrabold uppercase tracking-wider text-gray-700 hover:border-blue-300 hover:text-blue-700 transition-colors"
              >
                {currentUser ? (
                  <>
                    <User size={14} />
                    {currentUser.name.split(' ').slice(-1)[0]}
                  </>
                ) : (
                  <>
                    <LogIn size={14} />
                    ĐĂNG NHẬP
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  onNavClick('testdrive');
                  setMobileOpen(false);
                }}
                className="flex-1 px-4 py-2.5 bg-blue-700 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-blue-800 transition-colors"
              >
                ĐĂNG KÝ LÁI THỬ
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

