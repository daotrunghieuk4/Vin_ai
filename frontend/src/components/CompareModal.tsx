import { useState, useMemo } from 'react';
import {
  X, Zap, Shield, Sparkles, CheckCircle2, Award, Calendar, FileText,
  Cpu, Sliders, ArrowRight, MessageSquare, Plus, Trash2, ChevronDown, Check, Search
} from 'lucide-react';
import type { Vehicle } from '@/types';
import { getImageUrl, formatVNDPrice } from '@/lib/api';

interface CompareModalProps {
  open: boolean;
  onClose: () => void;
  selectedIds: string[];
  allVehicles: Vehicle[];
  onRemoveVehicle: (id: string) => void;
  onAddVehicle: (id: string) => void;
  onReplaceVehicle: (oldId: string, newId: string) => void;
  onRequestQuote: (vehicle: Vehicle) => void;
  onOpenChatWithCompare?: (vehicles: Vehicle[]) => void;
}

export default function CompareModal({
  open,
  onClose,
  selectedIds,
  allVehicles,
  onRemoveVehicle,
  onAddVehicle,
  onReplaceVehicle,
  onRequestQuote,
  onOpenChatWithCompare,
}: CompareModalProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'engine' | 'dimensions' | 'safety'>('all');
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null);

  // Picker Modal State for selecting 3rd vehicle
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerCategory, setPickerCategory] = useState<'all' | 'suv' | 'scooter'>('all');
  const [pickerSearch, setPickerSearch] = useState('');

  if (!open) return null;

  // Resolve vehicles from selectedIds
  let currentVehicles = selectedIds
    .map((id) => allVehicles.find((v) => v.id === id))
    .filter((v): v is Vehicle => Boolean(v));

  // Fallback: If less than 2 vehicles selected, pick default 2 vehicles (e.g., first 2 from allVehicles)
  if (currentVehicles.length < 2 && allVehicles.length >= 2) {
    const defaults = allVehicles.slice(0, 2);
    currentVehicles = defaults;
  }

  // Find vehicles not currently selected to allow adding/replacing
  const availableVehicles = allVehicles.filter(
    (v) => !currentVehicles.some((cv) => cv.id === v.id)
  );

  // Filtered available vehicles for picker modal
  const filteredAvailableVehicles = availableVehicles.filter((v) => {
    const matchCat = pickerCategory === 'all' || v.category === pickerCategory;
    const matchSearch = !pickerSearch || v.name.toLowerCase().includes(pickerSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const formatVND = (price: number) => formatVNDPrice(price);

  // Calculate quick comparison highlights (min price, max range)
  const lowestPrice = Math.min(...currentVehicles.map((v) => v.basePrice));
  const maxRange = Math.max(...currentVehicles.map((v) => typeof v.range === 'number' ? v.range : parseInt(String(v.range)) || 0));

  const handleSelectVehicleToAdd = (vehicleId: string) => {
    onAddVehicle(vehicleId);
    setPickerOpen(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 md:top-20 z-40 bg-slate-950/80 backdrop-blur-md flex flex-col overflow-hidden font-sans animate-fadeIn">
      
      {/* BODY - SCROLLABLE CONTAINER */}
      <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6 space-y-6 relative">
        
        {/* Navigation Bar inside Compare View */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all shadow-md active:scale-95 border border-slate-700"
          >
            <ArrowRight size={16} className="rotate-180" />
            <span>Quay lại Trang chủ VinFast</span>
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-xl backdrop-blur-md transition-all active:scale-95 border border-slate-700"
            title="Đóng bảng so sánh"
          >
            <X size={18} />
          </button>
        </div>

        {/* AI SMART COMPARISON SUMMARY BOX */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 rounded-2xl border border-blue-700/50 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5 flex-1">
              <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl font-bold shrink-0 mt-0.5 shadow-md">
                <Sparkles size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider">
                  Góc Phân Tích Nhanh Từ VinFast AI Advisor ({currentVehicles.length}/3 Mẫu xe)
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {currentVehicles.length >= 2 ? (
                    <>
                      So sánh giữa <strong>{currentVehicles.map(v => v.name).join(' vs ')}</strong>: Xe{' '}
                      <span className="text-emerald-400 font-bold">
                        {currentVehicles.find(v => v.basePrice === lowestPrice)?.name}
                      </span>{' '}
                      có mức giá tiếp cận tiết kiệm nhất (từ {formatVND(lowestPrice)}), trong khi xe{' '}
                      <span className="text-blue-300 font-bold">
                        {currentVehicles.find(v => (typeof v.range === 'number' ? v.range : parseInt(String(v.range)) || 0) === maxRange)?.name}
                      </span>{' '}
                      vượt trội về phạm vi di chuyển tối đa lên tới {maxRange} km/lần sạc.
                    </>
                  ) : (
                    'Chọn thêm xe để xem phân tích tự động từ AI.'
                  )}
                </p>
              </div>
            </div>

            {onOpenChatWithCompare && (
              <button
                onClick={() => {
                  onClose();
                  onOpenChatWithCompare(currentVehicles);
                }}
                className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
              >
                <MessageSquare size={16} />
                <span>Nhờ AI Phân tích &amp; So sánh</span>
              </button>
            )}
          </div>
        </div>

        {/* COMPARISON MATRIX TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          
          {/* TAB CATEGORIES */}
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3 overflow-x-auto">
            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: '📌 Tất cả thông số' },
                { id: 'engine', label: '⚡ Động cơ & Vận hành' },
                { id: 'dimensions', label: '📏 Kích thước & Ghế' },
                { id: 'safety', label: '🛡️ An toàn & Tiện nghi' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400 font-medium hidden lg:block">
              * Cuộn xuống để xem chi tiết từng nhóm thông số
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              
              {/* HEADER ROW: VEHICLE CARDS */}
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="p-4 w-48 bg-slate-100/80 text-xs font-black text-slate-700 uppercase tracking-wider align-top border-r border-slate-200">
                    Mẫu xe so sánh
                  </th>

                  {currentVehicles.map((vehicle, index) => {
                    const isLowestPrice = vehicle.basePrice === lowestPrice;
                    const vRange = typeof vehicle.range === 'number' ? vehicle.range : parseInt(String(vehicle.range)) || 0;
                    const isMaxRange = vRange === maxRange && maxRange > 0;

                    return (
                      <th key={vehicle.id} className="p-4 w-72 align-top border-r border-slate-200 relative">
                        <div className="space-y-3">
                          
                          {/* Swap / Change Vehicle Selector */}
                          <div className="relative">
                            <button
                              onClick={() => setDropdownOpenIndex(dropdownOpenIndex === index ? null : index)}
                              className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
                            >
                              <span className="truncate">Đổi mẫu xe khác</span>
                              <ChevronDown size={14} className="text-slate-400 shrink-0" />
                            </button>

                            {dropdownOpenIndex === index && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-56 overflow-y-auto p-1 animate-fadeIn">
                                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                  Chọn xe thay thế
                                </div>
                                {availableVehicles.map((av) => (
                                  <button
                                    key={av.id}
                                    onClick={() => {
                                      onReplaceVehicle(vehicle.id, av.id);
                                      setDropdownOpenIndex(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors flex items-center justify-between"
                                  >
                                    <span className="truncate">{av.name}</span>
                                    <span className="text-[10px] text-slate-400 shrink-0 font-normal ml-1">
                                      {formatVNDPrice(av.basePrice)}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Image */}
                          <div className="relative aspect-[16/10] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group">
                            <img
                              src={getImageUrl(vehicle.image)}
                              alt={vehicle.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {currentVehicles.length > 2 && (
                              <button
                                onClick={() => onRemoveVehicle(vehicle.id)}
                                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-80 hover:opacity-100 shadow-md transition-all"
                                title="Bỏ xe này"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>

                          {/* Vehicle Name & Badges */}
                          <div>
                            <h4 className="text-base font-black text-slate-900">{vehicle.name}</h4>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{vehicle.tagline}</p>
                            
                            <div className="flex flex-wrap gap-1 mt-2">
                              {isLowestPrice && (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md flex items-center gap-1">
                                  <Check size={10} /> Giá tiết kiệm nhất
                                </span>
                              )}
                              {isMaxRange && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded-md flex items-center gap-1">
                                  <Zap size={10} /> Quãng đường xa nhất
                                </span>
                              )}
                            </div>
                          </div>

                          {/* CTA Button */}
                          <button
                            onClick={() => {
                              onClose();
                              onRequestQuote(vehicle);
                            }}
                            className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs uppercase rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <FileText size={14} />
                            <span>Báo giá lăn bánh</span>
                          </button>
                        </div>
                      </th>
                    );
                  })}

                  {/* Add 3rd vehicle column slot if only 2 selected */}
                  {currentVehicles.length < 3 && availableVehicles.length > 0 && (
                    <th className="p-4 w-64 align-top bg-slate-50/40">
                      <div
                        onClick={() => setPickerOpen(true)}
                        className="h-full min-h-[280px] rounded-2xl border-2 border-dashed border-blue-400/80 hover:border-blue-600 bg-blue-50/30 hover:bg-blue-50/70 p-4 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all group shadow-sm hover:shadow-md"
                      >
                        <div className="p-3.5 bg-blue-600 text-white group-hover:scale-110 rounded-full shadow-md transition-transform">
                          <Plus size={26} />
                        </div>
                        <div>
                          <span className="text-sm font-extrabold text-slate-900 block">Thêm xe thứ 3</span>
                          <span className="text-[11px] text-slate-500 font-medium">Bấm vào đây để chọn xe bất kỳ</span>
                        </div>

                        <div className="w-full space-y-1.5 mt-1" onClick={(e) => e.stopPropagation()}>
                          {availableVehicles.slice(0, 2).map((av) => (
                            <button
                              key={av.id}
                              onClick={() => handleSelectVehicleToAdd(av.id)}
                              className="w-full py-2 px-3 bg-white hover:bg-blue-700 hover:text-white border border-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all shadow-sm truncate text-left flex items-center justify-between active:scale-95"
                            >
                              <span>+ {av.name}</span>
                              <span className="text-[10px] opacity-80">{formatVNDPrice(av.basePrice)}</span>
                            </button>
                          ))}

                          <button
                            onClick={() => setPickerOpen(true)}
                            className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 mt-2 active:scale-95"
                          >
                            <Search size={14} />
                            <span>Xem toàn bộ danh mục xe</span>
                          </button>
                        </div>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              {/* BODY MATRIX SECTIONS */}
              <tbody className="divide-y divide-slate-200 text-xs">
                
                {/* SECTION 1: GIÁ BÁN & GÓI PIN */}
                <tr className="bg-slate-100/70 font-black text-slate-800 uppercase">
                  <td colSpan={currentVehicles.length + 2} className="p-3 text-xs tracking-wider border-y border-slate-300">
                    💵 1. Giá Bán Niêm Yết &amp; Gói Thuê Pin
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-600 bg-slate-50 border-r border-slate-200">
                    Giá niêm yết (không kèm pin)
                  </td>
                  {currentVehicles.map((v) => (
                    <td key={v.id} className="p-3 font-black text-red-600 text-sm border-r border-slate-200">
                      {formatVND(v.basePrice)}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-600 bg-slate-50 border-r border-slate-200">
                    Giá mua đứt Pin
                  </td>
                  {currentVehicles.map((v) => (
                    <td key={v.id} className="p-3 font-extrabold text-slate-800 border-r border-slate-200">
                      {formatVND(v.batteryBuyPrice || v.basePrice * 1.2)}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-600 bg-slate-50 border-r border-slate-200">
                    Phí thuê Pin hàng tháng
                  </td>
                  {currentVehicles.map((v) => (
                    <td key={v.id} className="p-3 font-bold text-slate-700 border-r border-slate-200">
                      {v.batteryRentMonthly ? `${(v.batteryRentMonthly / 1000).toLocaleString('vi-VN')}k / tháng` : 'Từ 1,5 triệu / tháng'}
                    </td>
                  ))}
                </tr>

                {/* SECTION 2: ĐỘNG CƠ & VẬN HÀNH */}
                {(activeTab === 'all' || activeTab === 'engine') && (
                  <>
                    <tr className="bg-slate-100/70 font-black text-slate-800 uppercase">
                      <td colSpan={currentVehicles.length + 2} className="p-3 text-xs tracking-wider border-y border-slate-300">
                        ⚡ 2. Thông Số Động Cơ &amp; Vận Hành
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3 font-bold text-slate-600 bg-slate-50 border-r border-slate-200">
                        Quãng đường di chuyển max
                      </td>
                      {currentVehicles.map((v) => {
                        const raw = v.rawSpecs?.engine_drivetrain?.items || v.rawSpecs || {};
                        return (
                          <td key={v.id} className="p-3 font-extrabold text-blue-700 border-r border-slate-200">
                            {raw.range_km || v.range} km / lần sạc
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="p-3 font-bold text-slate-600 bg-slate-50 border-r border-slate-200">
                        Công suất tối đa
                      </td>
                      {currentVehicles.map((v) => {
                        const raw = v.rawSpecs?.engine_drivetrain?.items || v.rawSpecs || {};
                        return (
                          <td key={v.id} className="p-3 font-bold text-slate-800 border-r border-slate-200">
                            {raw.power_hp ? `${raw.power_hp} hp` : (raw.power_w || '201 hp')}
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="p-3 font-bold text-slate-600 bg-slate-50 border-r border-slate-200">
                        Vận tốc tối đa / Tăng tốc
                      </td>
                      {currentVehicles.map((v) => {
                        const raw = v.rawSpecs?.engine_drivetrain?.items || v.rawSpecs || {};
                        return (
                          <td key={v.id} className="p-3 font-medium text-slate-800 border-r border-slate-200">
                            {raw.top_speed_kmh ? `${raw.top_speed_kmh} km/h` : v.acceleration}
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="p-3 font-bold text-slate-600 bg-slate-50 border-r border-slate-200">
                        Thời gian sạc pin (Sạc nhanh)
                      </td>
                      {currentVehicles.map((v) => {
                        const raw = v.rawSpecs?.engine_drivetrain?.items || v.rawSpecs || {};
                        return (
                          <td key={v.id} className="p-3 font-medium text-emerald-700 border-r border-slate-200">
                            {raw.fast_charge_time || raw.charge_time || '30 phút (10-70%)'}
                          </td>
                        );
                      })}
                    </tr>
                  </>
                )}

                {/* SECTION 3: KÍCH THƯỚC & TRỌNG LƯỢNG */}
                {(activeTab === 'all' || activeTab === 'dimensions') && (
                  <>
                    <tr className="bg-slate-100/70 font-black text-slate-800 uppercase">
                      <td colSpan={currentVehicles.length + 2} className="p-3 text-xs tracking-wider border-y border-slate-300">
                        📏 3. Kích Thước, Trọng Lượng &amp; Chỗ Ngồi
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3 font-bold text-slate-600 bg-slate-50 border-r border-slate-200">
                        Số chỗ ngồi
                      </td>
                      {currentVehicles.map((v) => (
                        <td key={v.id} className="p-3 font-extrabold text-slate-900 border-r border-slate-200">
                          {v.seats} chỗ
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-3 font-bold text-slate-600 bg-slate-50 border-r border-slate-200">
                        Kích thước DxRxC (mm)
                      </td>
                      {currentVehicles.map((v) => {
                        const rawDim = v.rawSpecs?.dimensions_weight?.items || {};
                        return (
                          <td key={v.id} className="p-3 font-medium text-slate-800 border-r border-slate-200">
                            {rawDim.dimensions_mm || '4.750 x 1.900 x 1.660'}
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="p-3 font-bold text-slate-600 bg-slate-50 border-r border-slate-200">
                        Khoảng sáng gầm xe (mm)
                      </td>
                      {currentVehicles.map((v) => {
                        const rawDim = v.rawSpecs?.dimensions_weight?.items || {};
                        return (
                          <td key={v.id} className="p-3 font-medium text-slate-800 border-r border-slate-200">
                            {rawDim.ground_clearance_mm ? `${rawDim.ground_clearance_mm} mm` : '175 mm'}
                          </td>
                        );
                      })}
                    </tr>
                  </>
                )}

                {/* SECTION 4: AN TOÀN & TRANG BỊ */}
                {(activeTab === 'all' || activeTab === 'safety') && (
                  <>
                    <tr className="bg-slate-100/70 font-black text-slate-800 uppercase">
                      <td colSpan={currentVehicles.length + 2} className="p-3 text-xs tracking-wider border-y border-slate-300">
                        🛡️ 4. An Toàn, Túi Khí &amp; ADAS
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3 font-bold text-slate-600 bg-slate-50 border-r border-slate-200">
                        Túi khí / Tiêu chuẩn kháng nước
                      </td>
                      {currentVehicles.map((v) => {
                        const rawSafety = v.rawSpecs?.safety_adas?.items || {};
                        return (
                          <td key={v.id} className="p-3 font-bold text-emerald-700 border-r border-slate-200">
                            {v.category === 'scooter' ? 'Kháng nước IP67 (lội sâu 0.5m)' : (rawSafety.airbags ? `${rawSafety.airbags} túi khí` : '6 - 11 túi khí')}
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="p-3 font-bold text-slate-600 bg-slate-50 border-r border-slate-200">
                        Điểm nổi bật tiêu biểu
                      </td>
                      {currentVehicles.map((v) => (
                        <td key={v.id} className="p-3 border-r border-slate-200">
                          <ul className="space-y-1">
                            {v.highlights?.map((hl, i) => (
                              <li key={i} className="flex items-center gap-1.5 text-slate-700 font-medium">
                                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                                <span>{hl}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                  </>
                )}

              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* POPUP SELECTOR MODAL FOR 3RD VEHICLE */}
      {pickerOpen && (
        <div className="fixed inset-0 z-[120] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="text-lg font-black tracking-tight">Chọn Mẫu Xe Thứ 3 Để So Sánh</h3>
                <p className="text-xs text-slate-300">Danh sách toàn bộ các dòng Ô tô điện &amp; Xe máy điện VinFast</p>
              </div>
              <button
                onClick={() => setPickerOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Controls: Search & Category Tabs */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên xe (VF 5, Feliz...)..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => setPickerCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap ${
                    pickerCategory === 'all' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Tất cả ({availableVehicles.length})
                </button>
                <button
                  onClick={() => setPickerCategory('suv')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap ${
                    pickerCategory === 'suv' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Ô tô điện
                </button>
                <button
                  onClick={() => setPickerCategory('scooter')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap ${
                    pickerCategory === 'scooter' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Xe máy điện
                </button>
              </div>
            </div>

            {/* Vehicle List Grid */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-slate-100">
              {filteredAvailableVehicles.length > 0 ? (
                filteredAvailableVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => handleSelectVehicleToAdd(vehicle.id)}
                    className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden mb-2.5 border border-slate-100">
                        <img
                          src={getImageUrl(vehicle.image)}
                          alt={vehicle.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold rounded-md">
                          {vehicle.category === 'scooter' ? 'Xe máy điện' : 'Ô tô điện'}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                        {vehicle.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{vehicle.tagline}</p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-black text-red-600">
                        {formatVNDPrice(vehicle.basePrice)}
                      </span>
                      <button className="px-3 py-1.5 bg-blue-700 group-hover:bg-blue-800 text-white font-extrabold text-[11px] rounded-lg transition-all shadow-sm">
                        + Chọn xe này
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-slate-400 font-bold text-xs">
                  Không tìm thấy xe phù hợp từ khóa tìm kiếm.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
