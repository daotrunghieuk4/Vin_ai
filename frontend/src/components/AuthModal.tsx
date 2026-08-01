import { useState } from 'react';
import { api } from '@/lib/api';
import {
  X, User, Mail, Lock, Phone, ArrowRight, CheckCircle2,
  ShieldCheck, LogIn, Eye, EyeOff, Sparkles
} from 'lucide-react';
import logoVinFast from '/VIN png/Pin/VinFast-logo.png';
import type { UserAccount } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'otp'>('login');
  
  // Form States
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
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
        setSuccessMsg('Mã xác thực khôi phục mật khẩu đã được gửi!');
      }, 600);
      return;
    }

    const identifier = emailOrPhone.trim();

    if (!identifier) {
      setErrorMsg('Vui lòng nhập Email hoặc Số điện thoại.');
      return;
    }
    if (!password) {
      setErrorMsg('Vui lòng nhập mật khẩu.');
      return;
    }

    const email = identifier.includes('@') ? identifier.toLowerCase() : `${identifier}@customer.vinfast.vn`;

    try {
      setLoading(true);

      if (authMode === 'register') {
        if (!fullName) {
          setErrorMsg('Vui lòng nhập Họ và tên.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMsg('Mật khẩu xác nhận không khớp.');
          setLoading(false);
          return;
        }

        // Call Register API
        await api.register({
          email,
          phone: identifier.includes('@') ? '0901234567' : identifier,
          password,
          full_name: fullName,
          role: 'customer',
        });
      }

      // Call Login API
      const loginRes = await api.login<{ access_token: string; user: any }>({
        email,
        password,
      });

      localStorage.setItem('vinfast_token', loginRes.access_token);

      const loggedUser: UserAccount = {
        id: loginRes.user.id,
        name: loginRes.user.full_name,
        email: loginRes.user.email,
        phone: loginRes.user.phone,
        role: 'customer',
        memberLevel: 'Standard',
      };

      setLoading(false);
      onLoginSuccess(loggedUser);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Đăng nhập/Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 overflow-y-auto my-auto font-sans animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Customer Login Box */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100 max-h-[90vh] flex flex-col my-auto transition-all">
        
        {/* Top Gradient Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white px-6 py-5 relative flex-shrink-0 border-b border-blue-900/50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <img src={logoVinFast} alt="VinFast" className="h-6 w-auto brightness-0 invert" />
            <div className="h-3.5 w-px bg-white/25" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">
              CỔNG KHÁCH HÀNG
            </span>
          </div>

          <h2 className="text-xl font-black tracking-tight text-white">
            {authMode === 'login' && 'Chào mừng quý khách!'}
            {authMode === 'register' && 'Tạo tài khoản VinFast mới'}
            {authMode === 'forgot' && 'Khôi phục mật khẩu'}
            {authMode === 'otp' && 'Xác thực OTP SMS'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Theo dõi báo giá xe lăn bánh & điều phối lịch lái thử dễ dàng
          </p>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">

          {/* Alert Messages */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2">
              <ShieldCheck size={16} className="text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-2xl flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Mode Switcher: [ Đăng nhập ] vs [ Tạo tài khoản ] */}
            {authMode !== 'forgot' && authMode !== 'otp' && (
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200/80 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMsg('');
                  }}
                  className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
                    authMode === 'login'
                      ? 'bg-white text-blue-900 shadow-sm font-black'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMsg('');
                  }}
                  className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
                    authMode === 'register'
                      ? 'bg-blue-900 text-white shadow-sm font-black'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Tạo tài khoản mới
                </button>
              </div>
            )}

            {/* Field: Full Name for Register */}
            {authMode === 'register' && (
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                  Họ và tên
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-xs font-medium transition-all"
                  />
                </div>
              </div>
            )}

            {/* Field: Email / Phone */}
            {authMode !== 'otp' && (
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                  Email hoặc Số điện thoại
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="khachhang@example.com hoặc 0901234567"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-xs font-medium transition-all"
                  />
                </div>
              </div>
            )}

            {/* Field: Password */}
            {authMode !== 'forgot' && authMode !== 'otp' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-extrabold text-slate-700 uppercase">
                    Mật khẩu
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-[11px] text-blue-700 hover:underline font-bold"
                    >
                      Quên mật khẩu?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-xs font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password for Registration */}
            {authMode === 'register' && (
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                  Xác nhận Mật khẩu
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-xs font-medium transition-all"
                  />
                </div>
              </div>
            )}

            {/* OTP Input Mode */}
            {authMode === 'otp' && (
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-2 text-center">
                  Nhập mã 6 chữ số từ SMS
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] text-2xl font-black py-3 rounded-2xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}

            {/* Remember Me & OTP Shortcut */}
            {authMode === 'login' && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Ghi nhớ đăng nhập
                </label>

                <button
                  type="button"
                  onClick={() => setAuthMode('otp')}
                  className="text-xs text-blue-700 hover:text-blue-900 font-extrabold flex items-center gap-1"
                >
                  <Phone size={13} />
                  OTP SMS
                </button>
              </div>
            )}

            {/* Back button for secondary modes */}
            {(authMode === 'forgot' || authMode === 'otp') && (
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold block mx-auto pt-1"
              >
                ← Quay lại Đăng nhập
              </button>
            )}

            {/* Main Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-700/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] mt-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  <span>
                    {authMode === 'login' && 'Đăng nhập ngay'}
                    {authMode === 'register' && 'Tạo tài khoản ngay'}
                    {authMode === 'forgot' && 'Gửi mã khôi phục'}
                    {authMode === 'otp' && 'Xác thực OTP'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Social Auth Footer for Customers */}
          {authMode === 'login' && (
            <div className="pt-4 border-t border-slate-100">
              <div className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Hoặc Đăng nhập qua
              </div>
              <div className="grid grid-cols-2 gap-2.5">
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
                  className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.36 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
                  </svg>
                  <span>Google</span>
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
                  className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.54c.66-.8 1.11-1.92.99-3.04-.96.04-2.13.64-2.82 1.44-.61.71-1.14 1.86-.99 2.97 1.07.08 2.16-.57 2.82-1.37z"/>
                  </svg>
                  <span>Apple ID</span>
                </button>
              </div>
            </div>
          )}

          <div className="text-center pt-2">
            <p className="text-[10px] text-slate-400 font-bold flex items-center justify-center gap-1">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>Bảo mật 256-bit SSL VinFast Auto</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
