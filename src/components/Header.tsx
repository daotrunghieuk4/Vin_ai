import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, User, UserCog, Zap } from 'lucide-react';
import type { Role } from '@/types';

interface HeaderProps {
  role: Role;
  onRoleChange: (role: Role) => void;
  onOpenStaff: () => void;
  onNavClick: (section: string) => void;
}

export default function Header({ role, onRoleChange, onOpenStaff, onNavClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Dòng xe', section: 'showcase' },
    { label: 'Bảng giá', section: 'pricing' },
    { label: 'Tư vấn AI', section: 'chat' },
    { label: 'Đặt lịch lái thử', section: 'testdrive' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      {role === 'staff' && (
        <div className="bg-blue-900 text-white text-xs text-center py-1.5 tracking-wide font-medium">
          CHẾ ĐỘ NHÂN VIÊN — Bạn đang xem với quyền quản lý showroom
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <button
            onClick={() => onNavClick('top')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-800 transition-colors">
              <Zap className="w-4.5 h-4.5 text-white fill-white" size={18} />
            </div>
            <span
              className={`text-xl font-bold tracking-tight transition-colors ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}
            >
              VinFast
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.section}
                onClick={() => {
                  if (link.section === 'chat') onNavClick('chat');
                  else onNavClick(link.section);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 ${
                  scrolled
                    ? 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Role switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen((o) => !o)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                  scrolled
                    ? 'border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-700 bg-white'
                    : 'border-white/30 text-white hover:border-white bg-white/10'
                }`}
              >
                {role === 'staff' ? (
                  <UserCog size={14} />
                ) : (
                  <User size={14} />
                )}
                <span>{role === 'staff' ? 'Nhân viên' : 'Khách hàng'}</span>
                <ChevronDown size={12} className={`transition-transform ${roleMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <button
                    onClick={() => { onRoleChange('customer'); setRoleMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-blue-50 transition-colors ${role === 'customer' ? 'text-blue-700 font-semibold bg-blue-50' : 'text-gray-700'}`}
                  >
                    <User size={15} />
                    Khách hàng
                    {role === 'customer' && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </button>
                  <button
                    onClick={() => { onRoleChange('staff'); setRoleMenuOpen(false); onOpenStaff(); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-blue-50 transition-colors ${role === 'staff' ? 'text-blue-700 font-semibold bg-blue-50' : 'text-gray-700'}`}
                  >
                    <UserCog size={15} />
                    Nhân viên
                    {role === 'staff' && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </button>
                </div>
              )}
            </div>

            {role === 'staff' && (
              <button
                onClick={onOpenStaff}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
              >
                Dashboard
              </button>
            )}

            {role === 'customer' && (
              <button
                onClick={() => onNavClick('showcase')}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
              >
                Đặt cọc ngay
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.section}
                onClick={() => { onNavClick(link.section); setMobileOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => { onRoleChange(role === 'customer' ? 'staff' : 'customer'); setMobileOpen(false); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 transition-colors"
              >
                {role === 'staff' ? <User size={14} /> : <UserCog size={14} />}
                {role === 'staff' ? 'Khách hàng' : 'Nhân viên'}
              </button>
              <button
                onClick={() => { onNavClick('showcase'); setMobileOpen(false); }}
                className="flex-1 px-4 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
              >
                Khám phá
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
