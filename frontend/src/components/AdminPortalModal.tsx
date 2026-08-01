import { useState } from 'react';
import { api } from '@/lib/api';
import {
  X, ShieldCheck, KeyRound, Lock, Mail, ArrowRight, Loader2, AlertCircle, Building2, CheckCircle2
} from 'lucide-react';
import logoVinFast from '/VIN png/Pin/VinFast-logo.png';
import type { UserAccount } from '@/types';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

export default function AdminPortalModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: AdminPortalModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const loginEmail = email.trim();
    if (!loginEmail) {
      setErrorMsg('Vui lòng nhập Email hoặc Mã cán bộ VinFast.');
      return;
    }
    if (!password) {
      setErrorMsg('Vui lòng nhập mật khẩu.');
      return;
    }

    try {
      setLoading(true);
      const emailFormatted = loginEmail.includes('@') ? loginEmail.toLowerCase() : `${loginEmail.toLowerCase()}@vinfast.vn`;
      const authRes = await api.login({ email: emailFormatted, password });
      
      if (authRes.access_token) {
        localStorage.setItem('vinfast_token', authRes.access_token);
      }

      const me = await api.getMe<any>();

      if (me.role !== 'admin' && me.role !== 'consultant') {
        localStorage.removeItem('vinfast_token');
        setErrorMsg('Tài khoản Khách hàng không được truy cập Cổng Nội bộ VinFast.');
        setLoading(false);
        return;
      }

      const userAcc: UserAccount = {
        id: me.id,
        name: me.full_name,
        email: me.email,
        phone: me.phone,
        role: me.role === 'admin' ? 'admin' : 'staff',
        staffRole: me.role === 'admin' ? 'Quản trị viên Hệ thống' : 'Tư vấn bán hàng',
        employeeId: 'VF-INTERNAL',
        showroom: 'VinFast Landmark 81',
        memberLevel: 'Gold',
      };

      setSuccessMsg('Đăng nhập Cổng Nội bộ thành công! Đang vào trang Quản trị...');
      
      setTimeout(() => {
        onLoginSuccess(userAcc);
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLoginAdmin = () => {
    setEmail('admin@vinfast.vn');
    setPassword('admin123');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col text-white relative">
        
        {/* Header decoration bar */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-red-600 w-full" />

        {/* Top Header */}
        <div className="p-6 pb-4 flex items-start justify-between relative border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-blue-400 uppercase">VINFAST PORTAL</span>
                <span className="text-[9px] font-extrabold uppercase bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-md">Internal Only</span>
              </div>
              <h3 className="text-lg font-black text-white tracking-tight mt-0.5">Cổng Cán bộ VinFast</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {errorMsg && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs font-bold text-red-400 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 animate-bounce" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
              Email / Mã Cán bộ VinFast
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                placeholder="admin@vinfast.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
              Mật khẩu Hệ thống
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Đang xác thực Cổng...</span>
              </>
            ) : (
              <>
                <span>Vào Trang Quản Trị</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Quick Login Helper */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
              Truy cập nhanh thử nghiệm
            </div>
            <button
              type="button"
              onClick={handleQuickLoginAdmin}
              className="w-full py-2 px-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-[11px] font-bold text-slate-300 flex items-center justify-center gap-1.5 transition-all"
            >
              <KeyRound size={13} className="text-amber-400" />
              <span>Đăng nhập sẵn quyền Admin (`admin@vinfast.vn`)</span>
            </button>
          </div>

        </form>

        <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 text-center text-[10px] text-slate-500 font-medium">
          Dành riêng cho Quản trị viên & Tư vấn bán hàng VinFast. Tất cả thao tác được ghi log bảo mật.
        </div>

      </div>
    </div>
  );
}
