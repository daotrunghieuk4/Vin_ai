import { useState } from 'react';
import {
  X, User, UserCog, Mail, Lock, Phone, ArrowRight, CheckCircle2,
  Building2, KeyRound, ShieldCheck, LogIn, Eye, EyeOff
} from 'lucide-react';
import logoVinFast from '/VIN png/Pin/VinFast-logo.png';
import type { Role, UserAccount } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  defaultRole?: Role;
}

const SHOWROOM_LIST = [
  'VinFast Landmark 81 (TP.HCM)',
  'VinFast Ocean Park (Hà Nội)',
  'VinFast Thảo Điền (TP.HCM)',
  'VinFast Phạm Văn Đồng (Hà Nội)',
  'VinFast Đà Nẵng (Đà Nẵng)',
  'VinFast Cần Thơ (Cần Thơ)',
];

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  defaultRole = 'customer',
}: AuthModalProps) {
  const [activeRole, setActiveRole] = useState<Role>(defaultRole);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'otp'>('login');
  
  // Form States
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [showroom, setShowroom] = useState(SHOWROOM_LIST[0]);
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleRoleSwitch = (role: Role) => {
    setActiveRole(role);
    setErrorMsg('');
    setSuccessMsg('');
    setAuthMode('login');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (authMode === 'forgot') {
      if (!emailOrPhone) {
        setErrorMsg('Vui lòng nhập Email hoặc Số điện thoại.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg('Mã xác thực đã được gửi đến email/SĐT của bạn!');
      }, 600);
      return;
    }

    if (authMode === 'otp') {
      if (otpCode.length !== 6) {
        setErrorMsg('Vui lòng nhập đủ 6 chữ số mã OTP.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const loggedUser: UserAccount = {
          id: `usr_${Date.now()}`,
          name: 'Khách hàng VinFast',
          email: 'khachhang@vinfast.vn',
          phone: emailOrPhone || '0901 234 567',
          role: 'customer',
          memberLevel: 'Standard',
        };
        onLoginSuccess(loggedUser);
        onClose();
      }, 600);
      return;
    }

    if (activeRole === 'customer') {
      if (!emailOrPhone) {
        setErrorMsg('Vui lòng nhập Email hoặc Số điện thoại.');
        return;
      }
      if (!password) {
        setErrorMsg('Vui lòng nhập mật khẩu.');
        return;
      }

      if (authMode === 'register') {
        if (!fullName) {
          setErrorMsg('Vui lòng nhập Họ và tên.');
          return;
        }
        if (password !== confirmPassword) {
          setErrorMsg('Mật khẩu xác nhận không khớp.');
          return;
        }
      }

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const loggedUser: UserAccount = {
          id: `usr_${Date.now()}`,
          name: fullName || (emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Khách hàng VinFast'),
          email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@vinfast.vn`,
          phone: emailOrPhone.includes('@') ? '0908 123 456' : emailOrPhone,
          role: 'customer',
          memberLevel: 'Standard',
        };
        onLoginSuccess(loggedUser);
        onClose();
      }, 600);

    } else {
      if (!employeeId && !emailOrPhone) {
        setErrorMsg('Vui lòng nhập Mã nhân viên hoặc Email.');
        return;
      }
      if (!password) {
        setErrorMsg('Vui lòng nhập mật khẩu.');
        return;
      }

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const staffUser: UserAccount = {
          id: `stf_${Date.now()}`,
          name: employeeId.toUpperCase() === 'VF-1002' ? 'Lê Hoàng Nam' : 'Trần Thị Bích',
          email: emailOrPhone || 'nhanvien@vinfast.vn',
          phone: '0988 777 666',
          role: 'staff',
          employeeId: employeeId || 'VF-8892',
          showroom: showroom,
          position: employeeId.toUpperCase() === 'VF-1002' ? 'Giám đốc Showroom' : 'Tư vấn Bán hàng',
        };
        onLoginSuccess(staffUser);
        onClose();
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto my-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Box */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-200/80 max-h-[88vh] flex flex-col my-auto transition-all">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white px-5 py-4 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <img src={logoVinFast} alt="VinFast" className="h-6 w-auto brightness-0 invert" />
            <div className="h-3.5 w-px bg-white/20" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
              {activeRole === 'customer' ? 'Khách hàng VinFast' : 'Cổng Sales Nội bộ'}
            </span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">
            {authMode === 'login' && (activeRole === 'customer' ? 'Đăng nhập tài khoản' : 'Đăng nhập Nhân viên')}
            {authMode === 'register' && 'Đăng ký tài khoản VinFast'}
            {authMode === 'forgot' && 'Khôi phục mật khẩu'}
            {authMode === 'otp' && 'Xác thực OTP SMS'}
          </h2>
        </div>

        {/* Role Switcher Tab */}
        <div className="px-5 pt-3 pb-1 flex-shrink-0 bg-slate-50/80 border-b border-slate-100">
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-200/70 rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => handleRoleSwitch('customer')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                activeRole === 'customer'
                  ? 'bg-white text-blue-900 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User size={14} className={activeRole === 'customer' ? 'text-blue-700' : ''} />
              Khách hàng
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch('staff')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                activeRole === 'staff'
                  ? 'bg-blue-900 text-white shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCog size={14} className={activeRole === 'staff' ? 'text-blue-300' : ''} />
              Nhân viên / Staff
            </button>
          </div>
        </div>

        {/* Form Body - Scrollable */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3.5">

          {/* Alert Messages */}
          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg flex items-center gap-2">
              <ShieldCheck size={15} className="text-red-500 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-lg flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Customer Sub-mode selector (Đăng nhập vs Đăng ký) */}
            {activeRole === 'customer' && authMode !== 'forgot' && authMode !== 'otp' && (
              <div className="flex border-b border-slate-200 mb-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`pb-1.5 text-xs font-bold mr-4 transition-colors relative ${
                    authMode === 'login'
                      ? 'text-blue-700 border-b-2 border-blue-700'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`pb-1.5 text-xs font-bold transition-colors relative ${
                    authMode === 'register'
                      ? 'text-blue-700 border-b-2 border-blue-700'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Tạo tài khoản mới
                </button>
              </div>
            )}

            {/* Form Fields: Register Full Name */}
            {activeRole === 'customer' && authMode === 'register' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Họ và tên
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-xs font-medium transition-all"
                  />
                </div>
              </div>
            )}

            {/* Form Fields: Customer Identifier vs Staff Employee ID */}
            {activeRole === 'customer' ? (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Email hoặc Số điện thoại
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="email@example.com hoặc 0901234567"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-xs font-medium transition-all"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Mã nhân viên / Email VinFast
                  </label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="VD: VF-8892 hoặc nhanvien@vinfast.vn"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 text-xs font-medium transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Showroom / Chi nhánh công tác
                  </label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={showroom}
                      onChange={(e) => setShowroom(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 text-xs font-medium bg-white transition-all appearance-none cursor-pointer"
                    >
                      {SHOWROOM_LIST.map((sr) => (
                        <option key={sr} value={sr}>
                          {sr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Password input */}
            {authMode !== 'otp' && authMode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Mật khẩu
                  </label>
                  {authMode === 'login' && activeRole === 'customer' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-[11px] text-blue-600 hover:underline font-semibold"
                    >
                      Quên mật khẩu?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-xs font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password for Registration */}
            {activeRole === 'customer' && authMode === 'register' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Xác nhận Mật khẩu
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-xs font-medium transition-all"
                  />
                </div>
              </div>
            )}

            {/* OTP Input Mode */}
            {authMode === 'otp' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 text-center">
                  Nhập mã 6 chữ số từ SMS
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.4em] text-xl font-extrabold py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}

            {/* Remember Me Checkbox */}
            {authMode === 'login' && (
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Ghi nhớ đăng nhập
                </label>

                {activeRole === 'customer' && (
                  <button
                    type="button"
                    onClick={() => setAuthMode('otp')}
                    className="text-[11px] text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1"
                  >
                    <Phone size={11} />
                    OTP SMS
                  </button>
                )}
              </div>
            )}

            {/* Back button for secondary modes */}
            {(authMode === 'forgot' || authMode === 'otp') && (
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-[11px] text-slate-500 hover:text-slate-800 font-bold block mx-auto pt-0.5"
              >
                ← Quay lại đăng nhập
              </button>
            )}

            {/* Main Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider text-white shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] mt-3 ${
                activeRole === 'staff'
                  ? 'bg-blue-900 hover:bg-slate-900'
                  : 'bg-blue-700 hover:bg-blue-800'
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={15} />
                  <span>
                    {authMode === 'login' && (activeRole === 'customer' ? 'Đăng nhập' : 'Truy cập CRM Sales')}
                    {authMode === 'register' && 'Đăng ký ngay'}
                    {authMode === 'forgot' && 'Gửi mã khôi phục'}
                    {authMode === 'otp' && 'Xác thực OTP'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Social Auth Footer for Customers */}
          {activeRole === 'customer' && authMode === 'login' && (
            <div className="pt-3 border-t border-slate-100">
              <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Đăng nhập qua
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onLoginSuccess({
                      id: `usr_${Date.now()}`,
                      name: 'Khách hàng VinFast',
                      email: 'user.google@vinfast.vn',
                      phone: '0901 234 567',
                      role: 'customer',
                      memberLevel: 'Standard',
                    });
                    onClose();
                  }}
                  className="flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.36 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLoginSuccess({
                      id: `usr_${Date.now()}`,
                      name: 'Khách hàng VinFast',
                      email: 'user.apple@vinfast.vn',
                      phone: '0901 234 567',
                      role: 'customer',
                      memberLevel: 'Standard',
                    });
                    onClose();
                  }}
                  className="flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-slate-900" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.54c.66-.8 1.11-1.92.99-3.04-.96.04-2.13.64-2.82 1.44-.61.71-1.14 1.86-.99 2.97 1.07.08 2.16-.57 2.82-1.37z"/>
                  </svg>
                  Apple ID
                </button>
              </div>
            </div>
          )}

          <div className="text-center pt-1">
            <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
              <ShieldCheck size={12} className="text-emerald-600" />
              Bảo mật 256-bit SSL VinFast Auto
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
