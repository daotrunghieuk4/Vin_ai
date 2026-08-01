import { useState, useEffect } from 'react';
import {
  X, Zap, Shield, Sparkles, CheckCircle2, Award, Calendar, FileText,
  Cpu, Activity, Layers, ArrowRight, MessageSquare, ChevronRight, Sliders
} from 'lucide-react';
import type { Vehicle } from '@/types';
import { getImageUrl, formatVNDPrice } from '@/lib/api';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  allVehicles?: Vehicle[];
  open: boolean;
  onClose: () => void;
  onRequestQuote: (vehicle: Vehicle) => void;
  onOpenChat?: () => void;
}

export default function VehicleDetailModal({
  vehicle: initialVehicle,
  allVehicles = [],
  open,
  onClose,
  onRequestQuote,
  onOpenChat,
}: VehicleDetailModalProps) {
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(initialVehicle);
  const [selectedColor, setSelectedColor] = useState<string>('#DC2626');
  const [activeTab, setActiveTab] = useState<'engine' | 'dimensions' | 'interior' | 'safety'>('engine');

  useEffect(() => {
    setCurrentVehicle(initialVehicle);
  }, [initialVehicle]);

  if (!open || !currentVehicle) return null;

  // Extract model family e.g. "VF 8", "VF 9", "VF 7"
  const getModelFamily = (name: string) => {
    const match = name.match(/VF\s*\d+/i);
    return match ? match[0].toUpperCase() : name;
  };

  const familyName = getModelFamily(currentVehicle.name);
  const sisterVariants = allVehicles.filter(
    (v) => getModelFamily(v.name) === familyName
  );

  const rawSpecs = currentVehicle.rawSpecs || {};
  const engineItems = rawSpecs.engine_drivetrain?.items || rawSpecs.engine_drivetrain || {};
  const dimItems = rawSpecs.dimensions_weight?.items || rawSpecs.dimensions_weight || {};
  const interiorItems = rawSpecs.interior?.items || rawSpecs.interior || {};
  const safetyItems = rawSpecs.safety_adas?.items || rawSpecs.safety_adas || {};

  const formatVND = (price: number) => {
    return formatVNDPrice(price);
  };

  const colorMap: Record<string, string> = {
    '#0F172A': 'Đen Bạc (Black Slate)',
    '#DC2626': 'Đỏ Crimson (Red Crimson)',
    '#FFFFFF': 'Trắng Ngọc Trai (Pearl White)',
    '#2563EB': 'Xanh VinFast (VinFast Blue)',
  };

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-slate-100 flex flex-col overflow-hidden font-sans">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-4 sm:px-8 sm:py-5 flex items-center justify-between shrink-0 border-b border-slate-800 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-extrabold transition-all border border-white/15 shadow-sm active:scale-95"
            title="Quay lại danh mục xe"
          >
            <ArrowRight size={18} className="rotate-180" />
            <span>Quay lại</span>
          </button>

          <div className="h-6 w-px bg-white/20 hidden sm:block" />

          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 border border-blue-400/40 rounded-xl text-blue-300 hidden sm:block">
              <Zap size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-2xl font-black text-white tracking-tight">{currentVehicle.name}</h2>
                <span className="text-[10px] font-extrabold uppercase bg-blue-600 text-white px-2.5 py-0.5 rounded-md">
                  {currentVehicle.category === 'scooter' ? 'Xe máy điện' : 'Ô ô điện'}
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-1 mt-0.5 hidden sm:block">{currentVehicle.tagline}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all shadow-sm"
          title="Đóng chi tiết"
        >
          <X size={22} />
        </button>
      </div>

        {/* Variant / Trim Switcher Bar */}
        {sisterVariants.length > 1 && (
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 text-white px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-blue-800 shrink-0">
            <div className="flex items-center gap-2 text-xs font-extrabold text-blue-300 uppercase tracking-wider">
              <Sliders size={15} className="text-blue-400" />
              <span>Phiên bản {familyName}:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {sisterVariants.map((v) => {
                const isSelected = v.id === currentVehicle.id;
                const variantLabel = v.name.replace(`VinFast ${familyName}`, '').trim() || v.name;
                return (
                  <button
                    key={v.id}
                    onClick={() => setCurrentVehicle(v)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300 scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                    }`}
                  >
                    <span>{variantLabel}</span>
                    <span className="text-[10px] opacity-80">({formatVNDPrice(v.basePrice)})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50">
          
          {/* TOP SECTION: GALLERY + PRICING */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Image & Color Options (7 cols) */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-blue-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100">
                <img
                  src={getImageUrl(currentVehicle.image)}
                  alt={currentVehicle.name}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles size={11} /> MỚI 2026
                  </span>
                  <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full shadow-sm flex items-center gap-1">
                    <Award size={11} /> CHUẨN 5 SAO
                  </span>
                </div>
              </div>

              {/* Color Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase">Màu sắc ngoại thất:</span>
                <div className="flex items-center gap-2">
                  {currentVehicle.colors?.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center shadow-sm ${
                        selectedColor === c ? 'border-blue-600 scale-110 ring-2 ring-blue-200' : 'border-white hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                      title={colorMap[c] || c}
                    />
                  ))}
                  <span className="text-xs font-medium text-slate-600 ml-1">{colorMap[selectedColor] || 'Tùy chọn màu'}</span>
                </div>
              </div>

              {/* Specs Pills Bar */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 bg-blue-50/70 border border-blue-200/60 rounded-xl">
                  <span className="block text-[10px] text-slate-500 font-bold uppercase">Quãng đường</span>
                  <strong className="text-xs sm:text-sm font-black text-blue-900">{engineItems.range_km || currentVehicle.range} km</strong>
                </div>
                <div className="p-2.5 bg-blue-50/70 border border-blue-200/60 rounded-xl">
                  <span className="block text-[10px] text-slate-500 font-bold uppercase">
                    {currentVehicle.category === 'scooter' ? 'Công suất W' : 'Công suất hp'}
                  </span>
                  <strong className="text-xs sm:text-sm font-black text-blue-900">
                    {currentVehicle.category === 'scooter' ? (engineItems.power_w || '1800 W') : (engineItems.power_hp || '201 hp')}
                  </strong>
                </div>
                <div className="p-2.5 bg-blue-50/70 border border-blue-200/60 rounded-xl">
                  <span className="block text-[10px] text-slate-500 font-bold uppercase">
                    {currentVehicle.category === 'scooter' ? 'Vận tốc max' : 'Số chỗ ngồi'}
                  </span>
                  <strong className="text-xs sm:text-sm font-black text-blue-900">
                    {currentVehicle.category === 'scooter' ? (engineItems.top_speed_kmh || '78 km/h') : `${dimItems.seats || currentVehicle.seats} chỗ`}
                  </strong>
                </div>
                <div className="p-2.5 bg-blue-50/70 border border-blue-200/60 rounded-xl">
                  <span className="block text-[10px] text-slate-500 font-bold uppercase">
                    {currentVehicle.category === 'scooter' ? 'Cốp xe Lít' : 'Dẫn động'}
                  </span>
                  <strong className="text-xs sm:text-sm font-black text-blue-900">
                    {currentVehicle.category === 'scooter' ? (dimItems.trunk_capacity_l || '25 Lít') : (engineItems.drivetrain || 'FWD')}
                  </strong>
                </div>
              </div>
            </div>

            {/* Right: Pricing Card & Action Triggers (5 cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div>
                <div className="text-xs font-extrabold text-blue-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Activity size={14} /> Giá Bán Niêm Yết & Gói Pin
                </div>
                
                {/* Main Price Tag */}
                <div className="bg-gradient-to-br from-red-50 to-amber-50/50 p-4 rounded-2xl border border-red-200/60">
                  <span className="text-xs text-slate-500 font-bold uppercase">Giá xe niêm yết (không kèm pin)</span>
                  <div className="text-2xl sm:text-3xl font-black text-red-600 mt-0.5">
                    {formatVND(currentVehicle.basePrice)}
                  </div>
                </div>

                {/* Battery Buy & Rent Options */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase">Mua đứt Pin</span>
                    <strong className="text-slate-900 font-extrabold">{formatVND(currentVehicle.batteryBuyPrice || currentVehicle.basePrice * 1.2)}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase">Phí thuê Pin/tháng</span>
                    <strong className="text-slate-900 font-extrabold">
                      {currentVehicle.batteryRentMonthly ? `${(currentVehicle.batteryRentMonthly / 1000).toLocaleString('vi-VN')}k / tháng` : 'Từ 1.5 tr / tháng'}
                    </strong>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="mt-4 space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Điểm nổi bật tiêu biểu:</span>
                  <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                    {currentVehicle.highlights?.map((hl, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    onClose();
                    onRequestQuote(currentVehicle);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  <FileText size={16} />
                  <span>Yêu cầu báo giá lăn bánh ngay</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenChat?.();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <MessageSquare size={15} />
                    <span>Hỏi AI tư vấn</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onRequestQuote(currentVehicle);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Calendar size={15} />
                    <span>Đặt lịch lái thử</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* BOTTOM SECTION: DETAILED TECHNICAL SPECS MATRIX */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Cpu className="text-blue-600" size={18} />
                  Bảng Thông số Kỹ thuật Chi tiết mẫu xe {currentVehicle.name}
                </h3>
                <p className="text-xs text-slate-500">Thông số chính thức được cập nhật từ catalog VinFast Auto</p>
              </div>

              {/* Specs Category Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 overflow-x-auto">
                {[
                  { id: 'engine', label: '⚡ Động cơ & Vận hành' },
                  { id: 'dimensions', label: '📏 Kích thước & Ghế' },
                  { id: 'interior', label: '🛋️ Nội thất & Tiện nghi' },
                  { id: 'safety', label: '🛡️ An toàn & ADAS' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-blue-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT TABLES */}
            <div className="text-xs">
              
              {/* Tab 1: Engine & Performance */}
              {activeTab === 'engine' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">
                      {currentVehicle.category === 'scooter' ? 'Loại động cơ' : 'Loại động cơ'}
                    </span>
                    <strong className="text-slate-900 font-extrabold text-xs">
                      {engineItems.motor_type || engineItems.engine_type || (currentVehicle.category === 'scooter' ? 'In-hub (Động cơ bánh sau)' : 'Mô tơ điện đơn')}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">
                      {currentVehicle.category === 'scooter' ? 'Công suất động cơ' : 'Công suất tối đa'}
                    </span>
                    <strong className="text-slate-900 font-extrabold text-xs">
                      {engineItems.power_w || engineItems.power_hp || '201 hp'}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">
                      {currentVehicle.category === 'scooter' ? 'Vận tốc tối đa' : 'Mô-men xoắn cực đại'}
                    </span>
                    <strong className="text-slate-900 font-extrabold text-xs">
                      {engineItems.top_speed_kmh ? `${engineItems.top_speed_kmh} km/h` : (engineItems.torque_nm || '310 Nm')}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">
                      {currentVehicle.category === 'scooter' ? 'Loại Pin' : 'Hệ dẫn động'}
                    </span>
                    <strong className="text-slate-900 font-extrabold text-xs">
                      {engineItems.battery_type || engineItems.drivetrain || 'FWD (Cầu trước)'}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Dung lượng / Công nghệ Pin</span>
                    <strong className="text-slate-900 font-extrabold text-xs">
                      {engineItems.battery_capacity_kwh || currentVehicle.battery || 'Pin LFP thế hệ mới'}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Quãng đường max (km/sạc)</span>
                    <strong className="text-blue-700 font-black text-xs">
                      {engineItems.range_km || currentVehicle.range} km
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2 lg:col-span-3">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">
                      {currentVehicle.category === 'scooter' ? 'Thời gian sạc đầy' : 'Thời gian sạc nhanh (DC fast charge)'}
                    </span>
                    <strong className="text-emerald-700 font-black text-xs">
                      {engineItems.charge_time || engineItems.fast_charge_time || '30 phút (10-70%)'}
                    </strong>
                  </div>
                </div>
              )}

              {/* Tab 2: Dimensions & Weight */}
              {activeTab === 'dimensions' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">
                      {currentVehicle.category === 'scooter' ? 'Thể tích cốp xe' : 'Số chỗ ngồi'}
                    </span>
                    <strong className="text-slate-900 font-extrabold text-xs">
                      {dimItems.trunk_capacity_l || `${dimItems.seats || currentVehicle.seats || 5} chỗ`}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Kích thước DxRxC (mm)</span>
                    <strong className="text-slate-900 font-extrabold text-xs">{dimItems.dimensions_mm || '4.750 x 1.900 x 1.660'}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">
                      {currentVehicle.category === 'scooter' ? 'Chiều cao yên' : 'Chiều dài cơ sở'}
                    </span>
                    <strong className="text-slate-900 font-extrabold text-xs">
                      {dimItems.seat_height_mm || (dimItems.wheelbase_mm ? `${dimItems.wheelbase_mm} mm` : '2950 mm')}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">
                      {currentVehicle.category === 'scooter' ? 'Trọng lượng xe' : 'Khoảng sáng gầm xe'}
                    </span>
                    <strong className="text-slate-900 font-extrabold text-xs">
                      {dimItems.weight_kg || (dimItems.ground_clearance_mm ? `${dimItems.ground_clearance_mm} mm` : '175 mm')}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Kích thước Bánh xe / Lốp</span>
                    <strong className="text-slate-900 font-extrabold text-xs">{dimItems.wheels_rims || 'Lốp không săm cao cấp'}</strong>
                  </div>
                </div>
              )}

              {/* Tab 3: Interior & Comfort */}
              {activeTab === 'interior' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">
                      {currentVehicle.category === 'scooter' ? 'Hệ thống phanh' : 'Màn hình giải trí trung tâm'}
                    </span>
                    <strong className="text-slate-900 font-extrabold text-xs">
                      {interiorItems.brakes || interiorItems.infotainment_screen || 'Phanh đĩa trước & sau'}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">
                      {currentVehicle.category === 'scooter' ? 'Khóa & Tiện ích thông minh' : 'Hệ thống âm thanh'}
                    </span>
                    <strong className="text-slate-900 font-extrabold text-xs">
                      {interiorItems.smart_key || interiorItems.speakers || 'Chìa khóa PKE, Định vị GPS App'}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">
                      {currentVehicle.category === 'scooter' ? 'Chế độ lái' : 'Chất liệu bọc ghế'}
                    </span>
                    <strong className="text-slate-900 font-extrabold text-xs">
                      {interiorItems.riding_modes || interiorItems.seat_material || 'Chế độ Eco / Sport'}
                    </strong>
                  </div>
                </div>
              )}

              {/* Tab 4: Safety & ADAS */}
              {activeTab === 'safety' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">
                      {currentVehicle.category === 'scooter' ? 'Tiêu chuẩn chống nước' : 'Số túi khí an toàn'}
                    </span>
                    <strong className="text-emerald-700 font-extrabold text-xs">
                      {currentVehicle.category === 'scooter' ? 'IP67 (Lội nước sâu 0.5m trong 30 phút)' : (safetyItems.airbags ? `${safetyItems.airbags} túi khí` : '6 - 11 túi khí')}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">
                      {currentVehicle.category === 'scooter' ? 'Đèn chiếu sáng' : 'Hệ thống ADAS thông minh'}
                    </span>
                    <strong className="text-blue-700 font-extrabold text-xs">
                      {currentVehicle.category === 'scooter' ? 'Full LED trước & sau siêu sáng' : 'Cảnh báo chệch làn, cruise control, giữ làn'}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Trợ lý & Kết nối App VinFast</span>
                    <strong className="text-blue-700 font-extrabold text-xs">Quản lý xe, định vị GPS, tìm trạm sạc trên Smartphone</strong>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
  );
}
