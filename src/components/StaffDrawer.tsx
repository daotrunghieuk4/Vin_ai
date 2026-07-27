import { useState, useEffect, useCallback } from 'react';
import {
  X, Clock, CheckCircle2, XCircle, RefreshCw, Search,
  User, Phone, Mail, Car, Calendar, ChevronDown, Loader2,
  TrendingUp, AlertCircle, FileText,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Quote } from '@/types';

interface StaffDrawerProps {
  open: boolean;
  onClose: () => void;
}

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected';

const STATUS_CONFIG = {
  pending: { label: 'Chờ duyệt', color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-500', icon: Clock },
  approved: { label: 'Đã duyệt', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle2 },
  rejected: { label: 'Từ chối', color: 'text-red-600 bg-red-50 border-red-200', dot: 'bg-red-500', icon: XCircle },
};

function formatPrice(p: number) {
  return p >= 1000
    ? `${(p / 1000).toFixed(3).replace('.', ',')} tỷ`
    : `${p.toLocaleString('vi-VN')} triệu`;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function StaffDrawer({ open, onClose }: StaffDrawerProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setQuotes(data as Quote[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) fetchQuotes();
  }, [open, fetchQuotes]);

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    setUpdating(id);
    const { error } = await supabase
      .from('quotes')
      .update({ status, notes: noteText || null, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      setQuotes((prev) => prev.map((q) => q.id === id ? { ...q, status, notes: noteText || q.notes } : q));
      setExpandedId(null);
      setNoteText('');
    }
    setUpdating(null);
  }

  const filtered = quotes.filter((q) => {
    const matchTab = filterTab === 'all' || q.status === filterTab;
    const matchSearch =
      !search ||
      q.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      q.vehicle_name.toLowerCase().includes(search.toLowerCase()) ||
      q.customer_phone.includes(search);
    return matchTab && matchSearch;
  });

  const stats = {
    total: quotes.length,
    pending: quotes.filter((q) => q.status === 'pending').length,
    approved: quotes.filter((q) => q.status === 'approved').length,
    rejected: quotes.filter((q) => q.status === 'rejected').length,
  };

  const filterTabs: { id: FilterTab; label: string; count: number }[] = [
    { id: 'all', label: 'Tất cả', count: stats.total },
    { id: 'pending', label: 'Chờ duyệt', count: stats.pending },
    { id: 'approved', label: 'Đã duyệt', count: stats.approved },
    { id: 'rejected', label: 'Từ chối', count: stats.rejected },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[720px] xl:w-[800px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-5 flex items-center gap-4 shrink-0">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">Quản lý báo giá</h2>
            <p className="text-blue-300 text-sm mt-0.5">Duyệt và xử lý yêu cầu từ khách hàng</p>
          </div>
          <button
            onClick={fetchQuotes}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            title="Làm mới"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 border-b border-gray-100 bg-gray-50 shrink-0">
          {[
            { label: 'Tổng', value: stats.total, icon: FileText, color: 'text-blue-600' },
            { label: 'Chờ duyệt', value: stats.pending, icon: Clock, color: 'text-amber-600' },
            { label: 'Đã duyệt', value: stats.approved, icon: CheckCircle2, color: 'text-emerald-600' },
            { label: 'Từ chối', value: stats.rejected, icon: XCircle, color: 'text-red-600' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center py-4 border-r border-gray-100 last:border-r-0">
              <stat.icon size={16} className={stat.color} />
              <div className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters + search */}
        <div className="px-5 py-3 border-b border-gray-100 flex flex-col sm:flex-row gap-3 shrink-0">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filterTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${filterTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 focus-within:border-blue-400 transition-colors">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, xe, số điện thoại..."
              className="flex-1 py-2 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 size={28} className="text-blue-500 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center px-6">
              <AlertCircle size={36} className="text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">Không có báo giá nào</p>
              <p className="text-gray-400 text-sm mt-1">
                {search ? 'Thử tìm kiếm với từ khóa khác' : 'Báo giá từ khách hàng sẽ hiển thị ở đây'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((quote) => {
                const cfg = STATUS_CONFIG[quote.status];
                const StatusIcon = cfg.icon;
                const isExpanded = expandedId === quote.id;

                return (
                  <div key={quote.id} className="hover:bg-gray-50/70 transition-colors">
                    <div className="px-5 py-4">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <User size={16} className="text-blue-700" />
                        </div>

                        {/* Main info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-gray-900">{quote.customer_name}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.color}`}>
                              <StatusIcon size={11} />
                              {cfg.label}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-2">
                            <span className="flex items-center gap-1.5">
                              <Phone size={12} />
                              {quote.customer_phone}
                            </span>
                            {quote.customer_email && (
                              <span className="flex items-center gap-1.5">
                                <Mail size={12} />
                                {quote.customer_email}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5">
                              <Car size={12} />
                              {quote.vehicle_name}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar size={12} />
                              {formatDate(quote.created_at)}
                            </span>
                          </div>

                          {/* Price row */}
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-500">Gốc: <span className="text-gray-700 font-medium">{formatPrice(quote.base_price)}</span></span>
                            {quote.discount > 0 && (
                              <span className="text-emerald-600 font-medium flex items-center gap-1">
                                <TrendingUp size={12} />
                                −{formatPrice(quote.discount)}
                              </span>
                            )}
                            <span className="text-blue-700 font-bold">= {formatPrice(quote.final_price)}</span>
                          </div>

                          {quote.ai_summary && (
                            <p className="mt-1.5 text-xs text-gray-500 italic line-clamp-2">{quote.ai_summary}</p>
                          )}
                          {quote.notes && (
                            <p className="mt-1 text-xs text-blue-600 font-medium">Ghi chú: {quote.notes}</p>
                          )}
                        </div>

                        {/* Actions */}
                        {quote.status === 'pending' && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : quote.id)}
                              className="w-8 h-8 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all"
                            >
                              <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            <button
                              onClick={() => updateStatus(quote.id, 'rejected')}
                              disabled={updating === quote.id}
                              className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              {updating === quote.id ? <Loader2 size={12} className="animate-spin" /> : 'Từ chối'}
                            </button>
                            <button
                              onClick={() => updateStatus(quote.id, 'approved')}
                              disabled={updating === quote.id}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                            >
                              {updating === quote.id ? <Loader2 size={12} className="animate-spin" /> : 'Duyệt'}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Expanded notes */}
                      {isExpanded && quote.status === 'pending' && (
                        <div className="mt-3 ml-14 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <label className="text-xs font-medium text-gray-600 block mb-1.5">Ghi chú duyệt (tuỳ chọn)</label>
                          <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Ví dụ: Áp dụng ưu đãi tháng 7, giảm thêm 10tr..."
                            className="w-full text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-400 resize-none"
                            rows={2}
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button onClick={() => updateStatus(quote.id, 'rejected')} className="px-4 py-1.5 border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors">
                              Từ chối
                            </button>
                            <button onClick={() => updateStatus(quote.id, 'approved')} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors">
                              Duyệt báo giá
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
          <span className="text-xs text-gray-400">
            Hiển thị {filtered.length} / {quotes.length} báo giá
          </span>
          <span className="text-xs text-gray-400">
            Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}
          </span>
        </div>
      </div>
    </>
  );
}
