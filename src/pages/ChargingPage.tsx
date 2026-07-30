import { useState } from 'react';
import {
  ArrowLeft,
  Zap,
  ShieldAlert,
  Calendar,
  DollarSign,
  AlertTriangle,
  BatteryCharging,
  CheckCircle2,
  HelpCircle,
  Smartphone,
  MapPin,
  Clock,
  ShieldCheck,
  FileText
} from 'lucide-react';

// Import image assets from VIN png/Pin
import imgBoSacDiDong from '/VIN png/Pin/bộ sạc di động 2,2 kW (ô tô điện).png';
import imgBoSacTheoXe from '/VIN png/Pin/bộ sạc theo xe 3,5 kW (ô tô điện).png';
import imgBoSacTreoTuong from '/VIN png/Pin/bộ sạc treo tường AC 7,4 kW.png';
import imgHuongDanThueSac from '/VIN png/Pin/hướng dẫn thuê sạc.png';
import imgLoiIchThuePin from '/VIN png/Pin/lợi ích việc thuê pin.png';
import imgQuyHoachVinfast from '/VIN png/Pin/quy hoạch trạm sạc vinfast.png';
import imgQuyHoachTramSac from '/VIN png/Pin/quy hoạch trạm sạc.png';
import imgQuyDinhSuDungPin from '/VIN png/Pin/quy định sử dungj pin.png';
import imgTruSac150kW from '/VIN png/Pin/trụ sạc ô tô - sạc siêu nhanh DC 150kW.png';
import imgTruSac250kW from '/VIN png/Pin/trụ sạc ô tô - sạc siêu nhanh DC 250kW.png';
import imgTruSac30kW from '/VIN png/Pin/trụ sạc ô tô - sạc siêu nhanh DC 30kW.png';
import imgTruSac60kW from '/VIN png/Pin/trụ sạc ô tô - sạc siêu nhanh DC 60kW.png';
import imgDaDangGiaiPhap from '/VIN png/Pin/đa dạng giải pháp sạc.png';
import imgBannerPin from '/VIN png/Pin/banner.png';

interface ChargingPageProps {
  onBackToHome: () => void;
  onOpenChat: () => void;
}

export default function ChargingPage({ onBackToHome, onOpenChat }: ChargingPageProps) {
  const [selectedModel, setSelectedModel] = useState<'vf3' | 'vf5' | 'vf6' | 'vf7' | 'vf8' | 'vf9'>('vf3');

  // Battery Rental Table Data (Effective from 01/01/2025)
  const rentalRates = {
    vf3: {
      under1500: '1.100.000 VNĐ',
      midRange: '1.400.000 VNĐ (1.500 - 2.500 km)',
      overLimit: '3.000.000 VNĐ (> 2.500 km)',
      deposit: '7.000.000 VNĐ',
    },
    vf5: {
      under1500: '1.400.000 VNĐ',
      midRange: '1.900.000 VNĐ (1.500 - 3.000 km)',
      overLimit: '3.200.000 VNĐ (> 3.000 km)',
      deposit: '15.000.000 VNĐ',
    },
    vf6: {
      under1500: '1.700.000 VNĐ',
      midRange: '2.200.000 VNĐ (1.500 - 3.000 km)',
      overLimit: '3.600.000 VNĐ (> 3.000 km)',
      deposit: '25.000.000 VNĐ',
    },
    vf7: {
      under1500: '2.000.000 VNĐ',
      midRange: '3.500.000 VNĐ (1.500 - 3.000 km)',
      overLimit: '5.800.000 VNĐ (> 3.000 km)',
      deposit: '41.000.000 VNĐ',
    },
    vf8: {
      under1500: '2.300.000 VNĐ',
      midRange: '3.500.000 VNĐ (1.500 - 3.000 km)',
      overLimit: '5.800.000 VNĐ (> 3.000 km)',
      deposit: '41.000.000 VNĐ',
    },
    vf9: {
      under1500: '3.200.000 VNĐ',
      midRange: '5.400.000 VNĐ (1.500 - 3.500 km)',
      overLimit: '8.300.000 VNĐ (> 3.500 km)',
      deposit: '60.000.000 VNĐ',
    },
  };

  return (
    <div style={{ fontFamily: '"Mulish", serif' }} className="min-h-screen bg-gray-50 text-gray-900 pt-20 pb-16">
      {/* Sticky Sub-Header Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Quay lại</span>
          </button>
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
        <div className="relative overflow-hidden bg-slate-950 text-white py-16 lg:py-20 rounded-3xl px-6 sm:px-10 lg:px-14 shadow-2xl border border-slate-800">
          {/* Full Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={imgBannerPin}
              alt="Pin & Trạm Sạc VinFast Banner"
              className="w-full h-full object-cover object-[70%_center] sm:object-center opacity-100"
            />
            {/* Lighter Gradient Overlay for Brighter Banner Image */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/30 to-transparent pointer-events-none" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 max-w-2xl py-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/40 backdrop-blur-md mb-4">
              <Zap size={14} />
              Cập nhật chính sách & Hạ tầng sạc 2025
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-lg">
              Pin & Trạm Sạc Ô Tô Điện VinFast
            </h1>
            <p className="text-gray-100 text-base sm:text-lg leading-relaxed mb-6 font-medium drop-shadow">
              Tổng hợp đầy đủ quy định sạc công cộng, biểu phí sạc, chính sách cho thuê pin & thông số kỹ thuật các thiết bị sạc chính hãng VinFast.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onOpenChat}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all hover:scale-105"
              >
                Hỏi trợ lý AI về giá thuê pin
              </button>
              <a
                href="#notice"
                className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all"
              >
                Xem thông báo dịch vụ
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Important Alert Notice Banner */}
      <div id="notice" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-sm text-amber-950 space-y-3">
          <div className="flex items-center gap-2 font-extrabold text-lg text-amber-900">
            <AlertTriangle size={22} className="text-amber-600 flex-shrink-0" />
            <span>THÔNG BÁO QUAN TRỌNG VỀ DỊCH VỤ THUÊ PIN VINFAST</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm leading-relaxed text-amber-900 font-medium">
            <div className="p-3.5 bg-amber-100/60 rounded-xl border border-amber-200">
              <strong className="block font-bold text-amber-950 mb-1">📌 Từ ngày 01/03/2025:</strong>
              VinFast <strong>chính thức dừng cung cấp dịch vụ cho thuê pin</strong> đối với ô tô điện. Các khách hàng hiện đang sử dụng dịch vụ thuê pin vẫn tiếp tục sử dụng bình thường theo hợp đồng đã ký.
            </div>
            <div className="p-3.5 bg-amber-100/60 rounded-xl border border-amber-200">
              <strong className="block font-bold text-amber-950 mb-1">📌 Từ ngày 01/05/2026:</strong>
              VinFast <strong>chấm dứt hỗ trợ chuyển đổi từ thuê pin sang mua pin</strong> (bao gồm cả trả thẳng và trả góp). Khách hàng đang tham gia trả góp mua pin sẽ không bị ảnh hưởng.
            </div>
          </div>
        </div>
      </div>

      {/* Sequential 1-Page Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="space-y-16">
          {/* SECTION 1: POLICY & RENTAL RATES */}
          <div id="section-policy" className="space-y-10 scroll-mt-36">
            <div className="border-b border-gray-200 pb-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-extrabold text-lg">
                1
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Chính Sách & Bảng Giá Thuê Pin</h2>
            </div>

            {/* Image Banner: Lợi ích việc thuê pin */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-6 bg-emerald-600 rounded-full" />
                <h3 className="text-xl font-bold text-gray-900">Lợi Ích Của Việc Thuê Pin Ô Tô Điện VinFast</h3>
              </div>
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 flex justify-center p-2">
                <img
                  src={imgLoiIchThuePin}
                  alt="Lợi ích việc thuê pin VinFast"
                  className="max-h-96 w-auto object-contain rounded-xl"
                />
              </div>
            </div>

            {/* Highlights benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold mb-3">
                  01
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">Tiết Chi Phí Bảo Dưỡng</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Khách hàng thuê pin không tốn chi phí sửa chữa, thay thế hay bảo dưỡng bộ pin trong suốt vòng đời sử dụng.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold mb-3">
                  02
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">Chi Phí Vận Hành Rẻ Hơn Xăng</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Với những khách hàng di chuyển nhiều hàng tháng, tổng tiền sạc điện + phí thuê pin rẻ hơn nhiều so với xe xăng cùng phân khúc.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center font-bold mb-3">
                  03
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">Cố Định Giá Thuê Pin Trọn Đời</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Khách hàng ký hợp đồng trước ngày 01.11.2023 được cố định mức giá thuê pin suốt vòng đời sản phẩm theo thời điểm nhận xe.
                </p>
              </div>
            </div>

            {/* ODO Billing Details Box */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="text-emerald-600" size={20} />
                <span>Quy Định Chốt Cước & Lấy Dữ Liệu ODO</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <strong className="block font-bold text-gray-900 mb-1">📅 Chu kỳ tính cước:</strong>
                  Từ ngày 26 của tháng trước đến ngày 25 của tháng hiện tại. Hạn thanh toán trước ngày 15 của tháng tiếp theo.
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <strong className="block font-bold text-gray-900 mb-1">⏱️ Thời điểm chốt ODO:</strong>
                  Vào <strong>22h00 ngày 25 hàng tháng</strong>. Dữ liệu ODO phát sinh sau thời điểm này sẽ tính vào kỳ cước tháng tiếp theo.
                </div>
              </div>
            </div>

            {/* Battery Rental Rate Table Selector */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Bảng Giá Thuê Pin Áp Dụng Từ 01/01/2025
                </h3>
                <p className="text-xs text-gray-500 mt-1">Chọn dòng xe để xem chi tiết mức phí thuê pin theo các mốc km</p>
              </div>

              {/* Model tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(['vf3', 'vf5', 'vf6', 'vf7', 'vf8', 'vf9'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedModel(m)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold uppercase transition-all ${
                      selectedModel === m
                        ? 'bg-emerald-700 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Selected Model Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-emerald-900 text-white">
                      <th className="p-4 font-bold rounded-tl-xl">Mốc Quãng Đường</th>
                      <th className="p-4 font-bold">Mức Phí Thuê Pin / Tháng</th>
                      <th className="p-4 font-bold rounded-tr-xl">Phí Cọc Thuê Pin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                    <tr className="hover:bg-emerald-50/50">
                      <td className="p-4">Dưới 1.500 km / tháng</td>
                      <td className="p-4 font-bold text-emerald-700">{rentalRates[selectedModel].under1500}</td>
                      <td className="p-4 font-bold text-gray-900" rowSpan={3}>
                        {rentalRates[selectedModel].deposit}
                      </td>
                    </tr>
                    <tr className="hover:bg-emerald-50/50">
                      <td className="p-4">Mốc trung bình</td>
                      <td className="p-4 font-bold text-emerald-700">{rentalRates[selectedModel].midRange}</td>
                    </tr>
                    <tr className="hover:bg-emerald-50/50">
                      <td className="p-4">Mốc cao nhất / Không giới hạn</td>
                      <td className="p-4 font-bold text-emerald-700">{rentalRates[selectedModel].overLimit}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-xl text-xs text-gray-600 leading-relaxed border border-gray-100">
                * Note: Đối với mốc thuê pin ≤ 1.500 km/tháng, Khách hàng đang dùng gói cũ có thể chuyển sang gói mới miễn phí chuyển đổi. Các gói cũ sẽ hết hiệu lực sau khi chuyển đổi.
              </div>
            </div>

            {/* Image Banner: Hướng dẫn thuê sạc */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-6 bg-blue-600 rounded-full" />
                <h3 className="text-xl font-bold text-gray-900">Hướng Dẫn Quy Trình Thuê & Sạc Pin VinFast</h3>
              </div>
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 flex justify-center p-2">
                <img
                  src={imgHuongDanThueSac}
                  alt="Hướng dẫn thuê sạc pin"
                  className="max-h-96 w-auto object-contain rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PRICING & PLANNING */}
          <div id="section-pricing" className="space-y-10 scroll-mt-36">
            <div className="border-b border-gray-200 pb-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-extrabold text-lg">
                2
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Đơn Giá Sạc & Quy Hoạch Trạm Sạc</h2>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-bold text-xl">
                  ⚡
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Đơn Giá Sạc Ô Tô Điện Công Cộng</h3>
                  <p className="text-xs text-gray-500">Áp dụng chính thức tại toàn bộ hệ thống trạm sạc VinFast 63 tỉnh thành</p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-emerald-200">Đơn giá sạc công cộng</span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">3.858 VNĐ / kWh</div>
                  <span className="text-xs text-emerald-200 mt-1 block">(Giá đã bao gồm 10% VAT)</span>
                </div>
                <div className="bg-white/10 p-4 rounded-xl text-xs text-emerald-100 border border-white/20 max-w-xs">
                  Thanh toán trả sau trước ngày 15 hàng tháng qua App VinFast hoặc ví điện tử liên kết.
                </div>
              </div>

              {/* Overtime Idle Fee Section */}
              <h4 className="font-bold text-gray-900 text-lg mb-3">Phí Sử Dụng Dịch Vụ Trạm Sạc Bổ Sung (Sau khi sạc xong)</h4>
              <p className="text-xs text-gray-500 mb-4">
                Nhằm tránh tình trạng đỗ xe quá giờ gây cản trở người sạc tiếp theo tại các trụ sạc nhanh DC:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                  <div className="text-xs text-emerald-700 font-bold">Phút 1 - 10</div>
                  <div className="text-base font-extrabold text-emerald-900 mt-1">MIỄN PHÍ</div>
                  <div className="text-[11px] text-emerald-600 mt-1">Thời gian chuẩn bị di chuyển xe</div>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-center">
                  <div className="text-xs text-amber-700 font-bold">Phút 11 - 60</div>
                  <div className="text-base font-extrabold text-amber-900 mt-1">1.000 ₫ / phút</div>
                  <div className="text-[11px] text-amber-600 mt-1">Tính từ phút thứ 11</div>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-center">
                  <div className="text-xs text-orange-700 font-bold">Phút 61 - 120</div>
                  <div className="text-base font-extrabold text-orange-900 mt-1">2.000 ₫ / phút</div>
                  <div className="text-[11px] text-orange-600 mt-1">Áp dụng giờ thứ hai</div>
                </div>
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-center">
                  <div className="text-xs text-rose-700 font-bold">Từ phút 121 trở đi</div>
                  <div className="text-base font-extrabold text-rose-900 mt-1">4.000 ₫ / phút</div>
                  <div className="text-[11px] text-rose-600 mt-1">Tối đa 1.000.000 ₫ / lần</div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4 italic">
                * Lưu ý: Phí quá giờ không áp dụng cho xe máy điện và các trụ sạc thường AC 11kW.
              </p>
            </div>

            {/* Image Banners: Quy hoạch trạm sạc VinFast */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-900 text-base mb-4">Quy Hoạch Mạng Lưới Trạm Sạc VinFast</h4>
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 flex justify-center p-2">
                  <img
                    src={imgQuyHoachTramSac}
                    alt="Quy hoạch trạm sạc"
                    className="max-h-72 w-auto object-contain rounded-xl"
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-900 text-base mb-4">Phủ Sóng 150.000+ Cổng Sạc Toàn Quốc</h4>
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 flex justify-center p-2">
                  <img
                    src={imgQuyHoachVinfast}
                    alt="Quy hoạch trạm sạc VinFast"
                    className="max-h-72 w-auto object-contain rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: HARDWARE SPECS WITH IMAGES */}
          <div id="section-hardware" className="space-y-10 scroll-mt-36">
            <div className="border-b border-gray-200 pb-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-extrabold text-lg">
                3
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Thông Số Kỹ Thuật Trụ Sạc & Bộ Sạc</h2>
            </div>

            {/* Banner overview image: Đa dạng giải pháp sạc */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">Đa Dạng Giải Pháp Sạc Cho Khách Hàng</h3>
                <p className="text-xs text-gray-500 mt-0.5">Đáp ứng trọn vẹn mọi nhu cầu sạc từ công cộng đến tại nhà</p>
              </div>
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 flex justify-center p-2">
                <img
                  src={imgDaDangGiaiPhap}
                  alt="Đa dạng giải pháp sạc VinFast"
                  className="max-h-80 w-auto object-contain rounded-xl"
                />
              </div>
            </div>

            {/* Public Chargers Grid with Images */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Trụ Sạc Ô Tô Điện Công Cộng VinFast</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 250kW */}
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-extrabold text-gray-900 text-lg">Trụ Sạc Siêu Nhanh DC 250kW</h4>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md">250 kW Super</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-gray-700 mb-4">
                      <li>• <strong>Kiểu dáng:</strong> Tủ đứng 1 cổng sạc công suất cực đại</li>
                      <li>• <strong>Điện áp đầu ra:</strong> 200 – 1000 VDC</li>
                      <li>• <strong>Công suất:</strong> 250 kW / cổng sạc</li>
                      <li>• <strong>Bảo vệ:</strong> IP54, chống rò điện, ngắn mạch</li>
                    </ul>
                  </div>
                  <div className="mt-2 bg-white p-2 rounded-xl border border-gray-200 flex justify-center">
                    <img
                      src={imgTruSac250kW}
                      alt="Trụ sạc DC 250kW"
                      className="h-44 w-auto object-contain"
                    />
                  </div>
                </div>

                {/* 150kW */}
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-extrabold text-gray-900 text-lg">Trụ Sạc Siêu Nhanh DC 150kW</h4>
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-md">150 kW Dual</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-gray-700 mb-4">
                      <li>• <strong>Kiểu dáng:</strong> Tủ đứng 2 cổng sạc song song</li>
                      <li>• <strong>Điện áp đầu ra:</strong> 200 – 1000 VDC</li>
                      <li>• <strong>Công suất:</strong> 150 kW / cổng sạc</li>
                      <li>• <strong>Bảo vệ:</strong> IP54, chống quá nhiệt</li>
                    </ul>
                  </div>
                  <div className="mt-2 bg-white p-2 rounded-xl border border-gray-200 flex justify-center">
                    <img
                      src={imgTruSac150kW}
                      alt="Trụ sạc DC 150kW"
                      className="h-44 w-auto object-contain"
                    />
                  </div>
                </div>

                {/* 60kW */}
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-extrabold text-gray-900 text-lg">Trụ Sạc Nhanh DC 60kW</h4>
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-md">60 kW City</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-gray-700 mb-4">
                      <li>• <strong>Kiểu dáng:</strong> Tủ đứng 2 cổng sạc công cộng</li>
                      <li>• <strong>Điện áp đầu ra:</strong> 200 – 1000 VDC</li>
                      <li>• <strong>Công suất:</strong> 60 kW / cổng sạc</li>
                    </ul>
                  </div>
                  <div className="mt-2 bg-white p-2 rounded-xl border border-gray-200 flex justify-center">
                    <img
                      src={imgTruSac60kW}
                      alt="Trụ sạc DC 60kW"
                      className="h-44 w-auto object-contain"
                    />
                  </div>
                </div>

                {/* 30kW */}
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-extrabold text-gray-900 text-lg">Trụ Sạc Nhanh DC 30kW</h4>
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-md">30 kW Wall/Stand</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-gray-700 mb-4">
                      <li>• <strong>Kiểu dáng:</strong> Treo tường & Tủ đứng</li>
                      <li>• <strong>Công suất:</strong> 30 kW / cổng sạc</li>
                      <li>• <strong>Ứng dụng:</strong> Bãi đỗ xe & điểm dừng nghỉ</li>
                    </ul>
                  </div>
                  <div className="mt-2 bg-white p-2 rounded-xl border border-gray-200 flex justify-center">
                    <img
                      src={imgTruSac30kW}
                      alt="Trụ sạc DC 30kW"
                      className="h-44 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Home & Portable Chargers with Images */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Thiết Bị Sạc Tại Nhà & Sạc Di Động VinFast</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                {/* Wallbox 7.4kW */}
                <div className="p-5 border border-gray-100 rounded-2xl bg-emerald-50/50 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-base mb-1">Bộ Sạc Treo Tường AC 7.4 kW</h4>
                    <p className="text-xs text-gray-600 mb-3">Sạc AC mức 2 nguồn 1 pha 230VAC. Tự động ngắt khi đầy, chống cháy UL94-V1.</p>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-gray-200 flex justify-center">
                    <img
                      src={imgBoSacTreoTuong}
                      alt="Bộ sạc treo tường 7.4kW"
                      className="h-40 w-auto object-contain"
                    />
                  </div>
                </div>

                {/* Portable 3.5kW */}
                <div className="p-5 border border-gray-100 rounded-2xl bg-blue-50/50 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-base mb-1">Bộ Sạc Theo Xe 3.5 kW</h4>
                    <p className="text-xs text-gray-600 mb-3">Bộ sạc nhỏ gọn cắm ổ 220V gia đình. Thời gian sạc từ 10% – 100% khoảng 13.3 giờ.</p>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-gray-200 flex justify-center">
                    <img
                      src={imgBoSacTheoXe}
                      alt="Bộ sạc theo xe 3.5kW"
                      className="h-40 w-auto object-contain"
                    />
                  </div>
                </div>

                {/* Portable 2.2kW */}
                <div className="p-5 border border-gray-100 rounded-2xl bg-purple-50/50 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-base mb-1">Bộ Sạc Di Động 2.2 kW</h4>
                    <p className="text-xs text-gray-600 mb-3">Dây sạc di động bỏ cốp xe. Đạt chuẩn chống nước IP65/IP55 an toàn tuyệt đối.</p>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-gray-200 flex justify-center">
                    <img
                      src={imgBoSacDiDong}
                      alt="Bộ sạc di động 2.2kW"
                      className="h-40 w-auto object-contain"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* SECTION 4: SAFETY & WARRANTY WITH IMAGE */}
          <div id="section-safety" className="space-y-10 scroll-mt-36">
            <div className="border-b border-gray-200 pb-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-extrabold text-lg">
                4
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Bảo Hành & Quy Định An Toàn Pin</h2>
            </div>

            {/* Image Banner: Quy định sử dụng pin */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-6 bg-rose-600 rounded-full" />
                <h3 className="text-xl font-bold text-gray-900">Quy Định Sử Dụng & An Toàn Pin VinFast</h3>
              </div>
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 flex justify-center p-2">
                <img
                  src={imgQuyDinhSuDungPin}
                  alt="Quy định sử dụng pin VinFast"
                  className="max-h-96 w-auto object-contain rounded-xl"
                />
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="text-emerald-600" size={24} />
                <span>Chính Sách Bảo Hành & Đổi Pin Miễn Phí</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900">
                  <strong className="block font-bold text-base mb-1 text-emerald-950">✓ Đổi Pin Miễn Phí</strong>
                  Pin được thay mới/bảo dưỡng miễn phí nếu bị hỏng/lỗi do NSX hoặc trạng thái sạc (SOH) xuống dưới 70%.
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900">
                  <strong className="block font-bold text-base mb-1 text-blue-950">✓ Pin Thuê Vô Thời Hạn</strong>
                  Hợp đồng thuê pin có thời hạn vô thời hạn đến khi khách hàng hết nhu cầu sử dụng xe.
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-900">
                  <strong className="block font-bold text-base mb-1 text-purple-950">✓ Chặn Sạc Nợ Cước</strong>
                  VinFast sẽ chặn sạc 50% tháng đầu và 70% từ tháng 2 nếu nợ cước. Tự động mở khóa ngay khi thanh toán.
                </div>
              </div>

              {/* Compensation Formula */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-base mb-2">Công Thức Bồi Thường Khi Hỏng Pin Do Lỗi Người Dùng</h4>
                <p className="text-xs text-gray-600 mb-3">
                  Trong trường hợp pin thuê/mượn bị hỏng hoàn toàn do lỗi người sử dụng, mức bồi thường được tính theo công thức:
                </p>
                <div className="p-4 bg-white font-mono text-sm font-bold text-center text-emerald-800 rounded-xl border border-gray-200 mb-3">
                  B = A × (1 - T1 / T2)
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• <strong>B:</strong> Giá trị bồi thường (Quy định: B ≥ 10% × A).</li>
                  <li>• <strong>A:</strong> Giá pin công bố tại thời điểm xảy ra sự cố.</li>
                  <li>• <strong>T1:</strong> Thời gian đã sử dụng (tính theo tháng).</li>
                  <li>• <strong>T2:</strong> Thời hạn bảo hành của bộ pin.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

