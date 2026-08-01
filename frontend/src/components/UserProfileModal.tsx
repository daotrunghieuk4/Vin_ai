import { useState, useEffect } from 'react';
import {
  X, User, ShieldCheck, Mail, Phone, Calendar, Car, FileText,
  LogOut, Award, CheckCircle2, Clock, Sparkles, Building2, UserCog, ExternalLink
} from 'lucide-react';
import type { UserAccount, Quote } from '@/types';
import { supabase } from '@/lib/supabase';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onLogout: () => void;
  onOpenStaffConsole?: () => void;
  onOpenChat?: () => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  user,
  onLogout,
  onOpenStaffConsole,
  onOpenChat,
}: UserProfileModalProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'quotes'>('info');

  useEffect(() => {
    if (isOpen && user.role === 'customer') {
      fetchUserQuotes();
    }
  }, [isOpen, user]);

  const fetchUserQuotes = async () => {
    setLoadingQuotes(true);
    const { data } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setQuotes(data as Quote[]);
    }
    setLoadingQuotes(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto my-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-200/80 max-h-[88vh] flex flex-col my-auto">
        
        {/* Header Profile Cover */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-5 sm:p-6 relative overflow-hidden flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all"
          >
            <X size={16} />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 relative z-10">
            <div className="relative">
              <img
                src={
                  user.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                }
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-white/20 shadow-lg"
              />
              <span
                className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm ${
                  user.role === 'staff' ? 'bg-amber-500' : 'bg-blue-600'
                }`}
              >
                {user.role === 'staff' ? 'Nhân viên' : 'Khách hàng'}
              </span>
            </div>

            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-0.5">
                <h3 className="text-xl font-extrabold">{user.name}</h3>
                {user.role === 'staff' ? (
                  <UserCog size={16} className="text-amber-400" />
                ) : (
                  <ShieldCheck size={16} className="text-blue-300" />
                )}
              </div>
              <p className="text-blue-200 text-xs font-medium">{user.email}</p>

              {user.role === 'staff' ? (
                <div className="mt-2 flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/15 rounded text-[11px] font-semibold text-white">
                    <Building2 size={12} />
                    {user.showroom || 'VinFast Landmark 81'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[11px] font-bold border border-amber-400/30">
                    Mã NV: {user.employeeId || 'VF-8892'}
                  </span>
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-1.5 justify-center sm:justify-start text-xs text-blue-200 font-medium">
                  <User size={13} className="text-blue-300" />
                  <span>Tài khoản Khách hàng VinFast</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-5 bg-slate-50/70 flex-shrink-0">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-2.5 px-3 font-bold text-xs border-b-2 transition-colors ${
              activeTab === 'info'
                ? 'border-blue-700 text-blue-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Thông tin tài khoản
          </button>
          {user.role === 'customer' && (
            <button
              onClick={() => setActiveTab('quotes')}
              className={`py-2.5 px-3 font-bold text-xs border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'quotes'
                  ? 'border-blue-700 text-blue-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Yêu cầu báo giá của tôi
              {quotes.length > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-blue-100 text-blue-700 font-bold rounded-full">
                  {quotes.length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Tab Content - Scrollable */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-0.5 flex items-center gap-1">
                    <Mail size={13} className="text-blue-600" /> Email liên hệ
                  </div>
                  <div className="text-xs font-extrabold text-slate-800 truncate">{user.email}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-0.5 flex items-center gap-1">
                    <Phone size={13} className="text-blue-600" /> Số điện thoại
                  </div>
                  <div className="text-xs font-extrabold text-slate-800">{user.phone}</div>
                </div>
              </div>

              {user.role === 'staff' ? (
                <div className="p-4 bg-gradient-to-r from-blue-950 to-indigo-950 rounded-xl text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={15} className="text-amber-400" />
                      <span className="font-bold text-xs">Bảng Quản trị Báo giá CRM</span>
                    </div>
                    <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-bold">
                      Quyền Staff
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-200 mb-3">
                    Truy cập danh sách yêu cầu báo giá từ khách hàng, duyệt chiết khấu và cập nhật hợp đồng.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenStaffConsole?.();
                    }}
                    className="w-full py-2.5 bg-white text-blue-950 hover:bg-blue-50 font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink size={14} />
                    Mở Bảng Điều Khiển Sales CRM
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl">
                  <h4 className="text-xs font-extrabold text-blue-900 mb-1.5 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-blue-600" /> Dịch vụ dành cho Khách hàng VinFast
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                      Tra cứu thông tin hệ thống trạm sạc V-GREEN toàn quốc
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                      Theo dõi tiến độ yêu cầu báo giá & bảo dưỡng xe
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                      Tư vấn thiết kế gói tài chính ưu đãi trả góp
                    </li>
                  </ul>
                  {onOpenChat && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenChat();
                      }}
                      className="mt-3 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Car size={14} />
                      Tư vấn mua xe với AI Advisor ngay
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'quotes' && user.role === 'customer' && (
            <div>
              {loadingQuotes ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Đang tải danh sách báo giá...
                </div>
              ) : quotes.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Bạn chưa gửi yêu cầu báo giá nào. Vui lòng chọn xe và nhấn "Nhận báo giá".
                </div>
              ) : (
                <div className="space-y-2.5">
                  {quotes.map((q) => (
                    <div
                      key={q.id}
                      className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-extrabold text-xs text-slate-900">
                            {q.vehicle_name}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              q.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-700'
                                : q.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {q.status === 'approved' ? 'Đã duyệt' : q.status === 'rejected' ? 'Hết hạn' : 'Đang xử lý'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Giá niêm yết: {q.base_price.toLocaleString('vi-VN')} ₫
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-extrabold text-blue-700">
                          {q.final_price.toLocaleString('vi-VN')} ₫
                        </div>
                        <div className="text-[9px] text-slate-400">
                          {new Date(q.created_at).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-red-200"
          >
            <LogOut size={14} />
            Đăng xuất
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-all"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
