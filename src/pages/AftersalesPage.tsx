import { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Wrench,
  PhoneCall,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Truck,
  BatteryCharging,
  Car,
  Bike,
  Sparkles,
  Phone,
  Mail,
  Award
} from 'lucide-react';

// Import image assets from VIN png/haumai
import imgBannerHauMai from '/VIN png/haumai/banner.png';
import imgHauMaiXeMay from '/VIN png/haumai/Dịch vụ hậu mãi của VinFast cho xe máy điện.png';
import imgHauMaiXeMay3 from '/VIN png/haumai/Dịch vụ hậu mãi của VinFast cho xe máy điện 3.png';
import imgCapNhatPhanMem from '/VIN png/haumai/Người dùng xe máy điện VinFast được cập nhật phần mềm thường xuyên, đáp ứng nhu cầu sử dụng .png';
import imgHauMaiOToDien from '/VIN png/haumai/Dịch vụ hậu mãi của VinFast cho ô tô điện.png';
import imgCuuHoPin from '/VIN png/haumai/Dịch vụ cứu hộ pin 247 giúp người dùng an tâm hơn khi gặp những tình huống bất ngờ.png';
import imgHauMaiOToXang from '/VIN png/haumai/Dịch vụ hậu mãi của VinFast riêng cho ô tô xăng.png';

interface AftersalesPageProps {
  onBackToHome: () => void;
  onOpenChat: () => void;
}

export default function AftersalesPage({ onBackToHome, onOpenChat }: AftersalesPageProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', city: '', serviceType: 'maintenance', modelType: 'ev_car' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      setSubmitted(true);
    }
  };

  return (
    <div style={{ fontFamily: '"Mulish", serif' }} className="min-h-screen bg-gray-50 text-gray-900 pt-20 pb-16">
      {/* Sticky Sub-Header Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors"
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
              src={imgBannerHauMai}
              alt="Dịch vụ hậu mãi VinFast Banner"
              className="w-full h-full object-cover object-[70%_center] sm:object-center opacity-100"
            />
            {/* Lighter Gradient Overlay for Brighter Banner Image */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/30 to-transparent pointer-events-none" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 max-w-2xl py-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-500/40 backdrop-blur-md mb-4">
              <Award size={14} className="text-blue-400" />
              Chính sách bảo hành & chăm sóc khách hàng hàng đầu Việt Nam
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-lg">
              Dịch Vụ Hậu Mãi Của VinFast Chi Tiết Cho Từng Dòng Sản Phẩm
            </h1>
            <p className="text-gray-100 text-base sm:text-lg leading-relaxed mb-6 font-medium drop-shadow">
              Dịch vụ hậu mãi của VinFast dành cho ô tô điện, ô tô xăng, xe máy điện luôn được đánh giá cao. Các chính sách như bảo hành 10 năm cho ô tô, dịch vụ bảo dưỡng lưu động, dịch vụ cứu hộ pin 24/7, ưu đãi trong hệ sinh thái Vingroup giúp khách hàng cảm thấy luôn được quan tâm và góp phần nâng cao giá trị của sản phẩm.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#booking"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all hover:scale-105"
              >
                Đặt lịch bảo dưỡng trực tuyến
              </a>
              <button
                onClick={onOpenChat}
                className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all"
              >
                Tư vấn AI Advisor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Intro Lead Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 font-bold text-xl">
              💡
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Dịch Vụ Hậu Mãi Của VinFast Là Yếu Tố "Then Chốt" Giúp Thương Hiệu Nổi Bật Trên Thị Trường
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Bên cạnh những dòng sản phẩm chất lượng, dịch vụ hậu mãi của VinFast là một trong những yếu tố then chốt giúp thương hiệu xe Việt nổi bật trên thị trường. Các chính sách đưa ra cho từng dòng sản phẩm không chỉ bảo vệ quyền lợi tốt nhất mà còn giúp khách hàng cảm thấy an tâm khi sử dụng phương tiện.
              </p>
            </div>
          </div>
        </div>

        {/* Table of Contents Box (Mục Lục) */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm mb-12">
          <div className="flex items-center gap-2 mb-4 font-extrabold text-lg text-blue-950">
            <FileText size={20} className="text-blue-700" />
            <span>MỤC LỤC BÀI VIẾT</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold text-blue-900">
            <a href="#section-bike" className="p-3.5 bg-white rounded-xl border border-blue-200/80 hover:border-blue-500 hover:text-blue-700 hover:shadow-sm transition-all flex items-center gap-3">
              <Bike className="text-blue-600 flex-shrink-0" size={18} />
              <span>1. Dịch vụ hậu mãi VinFast cho xe máy điện</span>
            </a>
            <a href="#section-electric-car" className="p-3.5 bg-white rounded-xl border border-blue-200/80 hover:border-blue-500 hover:text-blue-700 hover:shadow-sm transition-all flex items-center gap-3">
              <BatteryCharging className="text-emerald-600 flex-shrink-0" size={18} />
              <span>2. Dịch vụ hậu mãi VinFast cho ô tô điện</span>
            </a>
            <a href="#section-gas-car" className="p-3.5 bg-white rounded-xl border border-blue-200/80 hover:border-blue-500 hover:text-blue-700 hover:shadow-sm transition-all flex items-center gap-3">
              <Car className="text-amber-600 flex-shrink-0" size={18} />
              <span>3. Dịch vụ hậu mãi VinFast riêng cho ô tô xăng</span>
            </a>
            <a href="#section-contact" className="p-3.5 bg-white rounded-xl border border-blue-200/80 hover:border-blue-500 hover:text-blue-700 hover:shadow-sm transition-all flex items-center gap-3">
              <PhoneCall className="text-purple-600 flex-shrink-0" size={18} />
              <span>4. Tổng đài tư vấn & Hỗ trợ khách hàng</span>
            </a>
          </div>
        </div>

        {/* SECTION 1: XE MÁY ĐIỆN */}
        <div id="section-bike" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm mb-12 scroll-mt-28">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-lg">
              1
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Dịch Vụ Hậu Mãi Của VinFast Cho Xe Máy Điện</h2>
          </div>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
            Ra mắt thị trường đã lâu, xe máy điện VinFast luôn được người dùng đánh giá cao về thiết kế trẻ trung, năng động cùng công năng vượt trội. Các sản phẩm hướng tới đối tượng học sinh, sinh viên, người đi làm với mong muốn sở hữu một chiếc xe điện chắc chắn, dễ sử dụng và thân thiện với môi trường.
          </p>

          {/* Image Banner: Dịch vụ hậu mãi cho xe máy điện */}
          <div className="my-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 flex justify-center p-2 shadow-sm">
            <img
              src={imgHauMaiXeMay}
              alt="Dịch vụ hậu mãi VinFast cho xe máy điện"
              className="max-h-96 w-auto object-contain rounded-xl"
            />
          </div>

          <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-100 text-xs sm:text-sm text-blue-950 font-medium mb-6">
            💡 Xe máy điện VinFast hướng tới phân khúc người trẻ, được đánh giá cao về cả thiết kế và công năng sử dụng. VinFast đưa ra hàng loạt các chính sách hậu mãi với mục đích tối ưu chi phí cho người dùng. Khách hàng khi mua các dòng xe máy điện của VinFast sẽ được bảo hành theo chính sách cụ thể như sau:
          </div>

          {/* Bike Warranty Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="font-bold text-gray-900 text-base mb-2 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>Quyền Lợi Bảo Hành & Phần Mềm</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Được sửa chữa, thay thế, cập nhật phần mềm do lỗi phần mềm hoặc thay thế phụ kiện bị lỗi do nhà sản xuất (với điều kiện sản phẩm được sử dụng và bảo dưỡng đúng cách).
              </p>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="font-bold text-gray-900 text-base mb-2 flex items-center gap-2">
                <Clock size={18} className="text-blue-600" />
                <span>Thời Gian Bảo Hành Khung & Động Cơ</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Thời gian bảo hành <strong>3 năm và không giới hạn quãng đường sử dụng</strong>, áp dụng từ ngày bán lẻ cho khách hàng ghi trên hoá đơn.
              </p>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="font-bold text-gray-900 text-base mb-2 flex items-center gap-2">
                <ShieldCheck size={18} className="text-purple-600" />
                <span>Bảo Hành Ắc Quy Chì</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Thời gian bảo hành ắc quy chì là <strong>12 tháng, không giới hạn số km</strong>.
              </p>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="font-bold text-gray-900 text-base mb-2 flex items-center gap-2">
                <Wrench size={18} className="text-amber-600" />
                <span>Phạm Vi Áp Dụng Toàn Quốc</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Phạm vi bảo hành trên toàn lãnh thổ Việt Nam, tại các showroom hoặc các đại lý ủy quyền của VinFast.
              </p>
            </div>
          </div>

          {/* Image Banner 2: Dịch vụ hậu mãi cho xe máy trên toàn quốc */}
          <div className="my-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 flex justify-center p-2 shadow-sm">
            <img
              src={imgHauMaiXeMay3}
              alt="Dịch vụ hậu mãi cho xe máy trên toàn quốc"
              className="max-h-96 w-auto object-contain rounded-xl"
            />
          </div>

          {/* Exclusions Box */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 mb-8">
            <h4 className="font-bold text-rose-900 text-base mb-3 flex items-center gap-2">
              <AlertTriangle size={20} className="text-rose-600" />
              <span>Các Hạng Mục Không Thuộc Phạm Vi Bảo Hành Xe Máy Điện VinFast:</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-rose-950 font-medium list-disc pl-5">
              <li>
                Hư hỏng do nguyên nhân của việc sửa chữa, điều chỉnh, đấu nối phụ kiện không chính hãng, hoán cải trái phép so với thiết kế ban đầu như thay đổi công suất, thay đổi cấu trúc, v.v.
              </li>
              <li>
                Hư hỏng xảy ra có nguyên nhân do sử dụng sai chức năng và lạm dụng xe như: Lái xe trong điều kiện khắc nghiệt như đua xe, chạy xe trên đường gồ ghề, chở quá tải, sử dụng và bảo quản không theo chỉ dẫn trong sách hướng dẫn sử dụng.
              </li>
            </ul>
          </div>

          {/* Image Banner 3: Người dùng xe máy điện VinFast được cập nhật phần mềm */}
          <div className="my-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 flex justify-center p-2 shadow-sm">
            <img
              src={imgCapNhatPhanMem}
              alt="Chính sách hậu mãi của VinFast cho xe máy điện"
              className="max-h-96 w-auto object-contain rounded-xl"
            />
          </div>

          {/* Periodic Maintenance Notice */}
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-xs sm:text-sm text-emerald-950 font-medium">
            💚 <strong>Lịch bảo dưỡng định kỳ:</strong> Các dòng xe máy điện của VinFast đều được bảo dưỡng định kỳ theo 1 chu kỳ nhất định (quãng đường hoặc thời gian sử dụng), thường là <strong>mỗi 6 tháng/chi tiết</strong>. Đối với trường hợp hư hỏng cần sửa chữa, khách hàng có thể đưa xe đến các xưởng dịch vụ của VinFast trên toàn quốc để được tư vấn và đưa ra phương án khắc phục tối ưu nhất.
          </div>
        </div>

        {/* SECTION 2: Ô TÔ ĐIỆN */}
        <div id="section-electric-car" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm mb-12 scroll-mt-28">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-lg">
              2
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Dịch Vụ Hậu Mãi Của VinFast Cho Ô Tô Điện</h2>
          </div>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
            Do có sự khác biệt về nhiên liệu và thiết kế động học giữa ô tô điện và xe xăng, nên dịch vụ hậu mãi của VinFast đối với dòng ô tô điện được bổ sung chính sách bảo hành về pin. Cụ thể, chủ sở hữu xe sẽ được hưởng những chế độ bảo hành hấp dẫn:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-2xl shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Bảo hành chính hãng</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white my-2">10 Năm / 200.000 km</div>
              <p className="text-xs text-emerald-100">
                Áp dụng cho VF e34, VF 8 và VF 9. Riêng VF 5 Plus áp dụng bảo hành <strong>7 năm hoặc 140.000 km</strong>. Đây được xem là mức bảo hành hấp dẫn mà rất ít hãng xe nào trên thị trường làm được.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Bảo hành phụ tùng</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 my-2">2 Năm</div>
              <p className="text-xs text-gray-600">
                Phụ tùng ô tô (không bao gồm ắc quy 12V và Pin cao áp) được bảo hành 2 năm và <strong>không giới hạn số km</strong>.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Bảo hành ắc quy 12V</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 my-2">1 Năm</div>
              <p className="text-xs text-gray-600">
                Thời hạn bảo hành tiêu chuẩn dành cho ắc quy 12V trang bị trên ô tô điện VinFast.
              </p>
            </div>
          </div>

          {/* Image Banner: Dịch vụ hậu mãi VinFast cho ô tô điện */}
          <div className="my-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 flex justify-center p-2 shadow-sm">
            <img
              src={imgHauMaiOToDien}
              alt="Dịch vụ hậu mãi VinFast cho ô tô điện"
              className="max-h-96 w-auto object-contain rounded-xl"
            />
          </div>

          {/* Battery Rental Warranty Policy */}
          <div className="bg-emerald-50/70 rounded-2xl p-6 border border-emerald-200 mb-8">
            <h3 className="font-bold text-gray-900 text-base mb-2 flex items-center gap-2">
              <BatteryCharging size={20} className="text-emerald-700" />
              <span>Chính Sách Bảo Hành Pin Thuê Cho Ô Tô Điện VinFast</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 mb-4">
              Ngoài ra, khách hàng lựa chọn các gói thuê pin xe ô tô điện VinFast sẽ được áp dụng chính sách bảo hành pin. Pin cho thuê được hỗ trợ thay thế, sửa chữa, bảo dưỡng trong các trường hợp:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-bold text-emerald-950">
              <div className="p-3.5 bg-white rounded-xl border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={18} />
                <span>Pin bị hư hỏng, bị lỗi do Nhà sản xuất</span>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={18} />
                <span>Dung lượng pin tối đa dưới 70% (SOH &lt; 70%)</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-4 italic">
              * Tương tự như xe máy điện, quy trình bảo dưỡng ô tô điện VinFast cũng được thực hiện theo chu kỳ tính theo quãng đường và thời gian. Tùy vào từng chi tiết và bộ phận sẽ có chu kỳ bảo dưỡng khác nhau.
            </p>
          </div>

          {/* Image Banner: Dịch vụ cứu hộ pin 24/7 */}
          <div className="my-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 flex justify-center p-2 shadow-sm">
            <img
              src={imgCuuHoPin}
              alt="Cứu hộ pin - dịch vụ hậu mãi VinFast cho ô tô điện"
              className="max-h-96 w-auto object-contain rounded-xl"
            />
          </div>

          {/* Special Support Services */}
          <h3 className="font-bold text-gray-900 text-lg mb-4">Các Chương Trình Hỗ Trợ Độc Quyền Dành Cho Ô Tô Điện</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                  <Truck size={20} />
                </div>
                <h4 className="font-bold text-gray-900 text-base mb-1">Cứu Hộ Miễn Phí 24/7</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Dịch vụ cứu hộ miễn phí 24/7 trong suốt thời gian bảo hành.
                </p>
              </div>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <BatteryCharging size={20} />
                </div>
                <h4 className="font-bold text-gray-900 text-base mb-1">Cứu Hộ Pin 24/7 tận nơi</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Dịch vụ cứu hộ pin 24/7 tại địa điểm khách hàng yêu cầu khi xảy ra sự cố bất ngờ.
                </p>
              </div>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                  <Wrench size={20} />
                </div>
                <h4 className="font-bold text-gray-900 text-base mb-1">Mobile Service Lưu Động</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Dịch vụ sửa chữa, bảo dưỡng lưu động Mobile Service đến tận nơi phục vụ khách hàng.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Ô TÔ XĂNG */}
        <div id="section-gas-car" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm mb-12 scroll-mt-28">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-lg">
              3
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Dịch Vụ Hậu Mãi Của VinFast Riêng Cho Ô Tô Xăng</h2>
          </div>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
            Đầu năm 2022, VinFast đã chính thức nâng mức bảo hành lên <strong>10 năm hoặc 200.000 km</strong> đối với tất cả các mẫu xe ô tô xăng gồm VinFast Fadil, VinFast Lux A2.0, VinFast Lux SA2.0 và VinFast President. Các hạng mục bảo hành và bảo dưỡng xe xăng tương tự như xe ô tô điện (ngoại trừ các chính sách về pin).
          </p>

          {/* Image Banner: Dịch vụ hậu mãi cho xe xăng */}
          <div className="my-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 flex justify-center p-2 shadow-sm">
            <img
              src={imgHauMaiOToXang}
              alt="Dịch vụ hậu mãi của VinFast cho xe xăng"
              className="max-h-96 w-auto object-contain rounded-xl"
            />
          </div>

          {/* President Privileges */}
          <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-widest mb-2">
              <Sparkles size={16} />
              <span>Đặc quyền VIP đẳng cấp</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-4">
              Đặc Quyền Dành Riêng Cho Chủ Xe VinFast President
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm font-medium text-amber-100">
              <div className="p-4 bg-white/10 rounded-xl border border-amber-400/20 backdrop-blur-sm flex items-start gap-3">
                <span className="text-amber-400 font-bold">✓</span>
                <div>
                  <strong className="block text-white mb-0.5">Hội viên Pearl Club 3 năm</strong>
                  Quyền lợi trở thành Hội viên Pearl Club 3 năm của Vinpearl.
                </div>
              </div>
              <div className="p-4 bg-white/10 rounded-xl border border-amber-400/20 backdrop-blur-sm flex items-start gap-3">
                <span className="text-amber-400 font-bold">✓</span>
                <div>
                  <strong className="block text-white mb-0.5">Ưu tiên dịch vụ không hẹn trước</strong>
                  Đặc quyền ưu tiên phục vụ khi vào xưởng dịch vụ VinFast không cần đặt lịch hẹn trước.
                </div>
              </div>
              <div className="p-4 bg-white/10 rounded-xl border border-amber-400/20 backdrop-blur-sm flex items-start gap-3">
                <span className="text-amber-400 font-bold">✓</span>
                <div>
                  <strong className="block text-white mb-0.5">Giao nhận xe tại nhà</strong>
                  Hỗ trợ nhận và giao xe tại nhà khi bảo dưỡng, sửa chữa.
                </div>
              </div>
              <div className="p-4 bg-white/10 rounded-xl border border-amber-400/20 backdrop-blur-sm flex items-start gap-3">
                <span className="text-amber-400 font-bold">✓</span>
                <div>
                  <strong className="block text-white mb-0.5">Xe mượn thay thế VinFast Lux SA2.0</strong>
                  Được quyền sử dụng xe VinFast Lux SA2.0 thay thế trong quá trình sửa chữa xe.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: CONTACT & SUPPORT */}
        <div id="section-contact" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm mb-12 scroll-mt-28">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-extrabold text-lg">
              4
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Liên Hệ & Kênh Hỗ Trợ Khách Hàng VinFast</h2>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Với phương châm <strong>“Đặt lợi ích khách hàng lên hàng đầu”</strong>, các dịch vụ hậu mãi của VinFast đã góp phần củng cố niềm tin vững chắc, để người dùng tiếp tục tin tưởng sử dụng sản phẩm của VinFast ở thời điểm hiện tại và trong tương lai.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-md">
                <Phone size={28} />
              </div>
              <div>
                <span className="text-xs text-blue-700 font-bold uppercase tracking-wider">Tổng đài tư vấn 24/7</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-950 mt-0.5">1900 23 23 89</div>
                <span className="text-xs text-gray-500">Miễn cước cho mọi cuộc gọi tư vấn & hỗ trợ</span>
              </div>
            </div>

            <div className="p-6 bg-purple-50 rounded-2xl border border-purple-200 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-md">
                <Mail size={28} />
              </div>
              <div>
                <span className="text-xs text-purple-700 font-bold uppercase tracking-wider">Email Chăm sóc khách hàng</span>
                <div className="text-lg sm:text-xl font-extrabold text-purple-950 mt-1 break-all">support.vn@vinfastauto.com</div>
                <span className="text-xs text-gray-500">Phản hồi yêu cầu trong vòng 24 giờ làm việc</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 text-xs sm:text-sm text-gray-700 leading-relaxed">
            📢 Khách hàng có nhu cầu tìm hiểu thông tin, đặt mua xe máy điện và đặt cọc ô tô điện VinFast qua website để có cơ hội sở hữu mẫu ô tô điện mới nhất thị trường và nhận những ưu đãi hấp dẫn từ VinFast.
          </div>
        </div>

        {/* Online Appointment Booking Form Section */}
        <div id="booking" className="max-w-3xl mx-auto mt-12 scroll-mt-28">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm">
            <div className="text-center mb-8">
              <span className="text-xs font-extrabold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                ĐẶT LỊCH HẬU MÃI TRỰC TUYẾN
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">Đăng Ký Dịch Vụ Bảo Dưỡng & Sửa Chữa</h3>
              <p className="text-xs text-gray-500 mt-1">Kỹ thuật viên VinFast sẽ liên hệ xác nhận trong vòng 30 phút</p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center">
                <CheckCircle2 size={48} className="mx-auto text-emerald-600 mb-3" />
                <h4 className="font-bold text-lg">Đăng ký dịch vụ thành công!</h4>
                <p className="text-sm text-emerald-700 mt-1">
                  Cảm ơn <strong>{formData.name}</strong>. Chúng tôi đã nhận được thông tin và sẽ gọi cho bạn qua SĐT <strong>{formData.phone}</strong> trong ít phút nữa.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Họ và tên *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0912 345 678"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Dòng phương tiện</label>
                    <select
                      value={formData.modelType}
                      onChange={(e) => setFormData({ ...formData, modelType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="ev_car">Ô tô điện VinFast</option>
                      <option value="gas_car">Ô tô xăng VinFast</option>
                      <option value="bike">Xe máy điện VinFast</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Tỉnh / Thành phố *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Hà Nội / TP.HCM..."
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Loại dịch vụ</label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="maintenance">Bảo dưỡng định kỳ</option>
                      <option value="repair">Sửa chữa & Thay thế</option>
                      <option value="mobile">Mobile Service tận nhà</option>
                      <option value="battery">Cứu hộ / Bảo hành Pin</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold text-base rounded-xl transition-all shadow-md mt-4 hover:scale-101"
                >
                  Xác Nhận Đặt Lịch Bảo Dưỡng VinFast
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
