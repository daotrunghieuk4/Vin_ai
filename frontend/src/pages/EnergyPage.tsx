import { useState } from 'react';
import {
  ArrowLeft,
  Zap,
  Building2,
  Home,
  Container,
  Factory,
  ShieldCheck,
  TrendingUp,
  Activity,
  Sun,
  DollarSign,
  CheckCircle2,
  Layers,
  Cpu,
  Send,
  HelpCircle,
  FileText
} from 'lucide-react';

// Import assets from VIN png/nangluong
import imgBanner from '/VIN png/nangluong/banner.png';
import imgGioiThieuChung from '/VIN png/nangluong/giới thiệu chung.png';
import imgDanDung from '/VIN png/nangluong/Giải pháp lưu trữ năng lượng dân dụng.png';
import imgDangTu from '/VIN png/nangluong/Giải pháp lưu trữ năng lượng dạng tủ.png';
import img20FTContainer from '/VIN png/nangluong/Giải pháp lưu trữ năng lượng 20FT Container.png';
import videoNhaMay from '/VIN png/nangluong/Khám phá nhà máy sản xuất.mp4';

interface EnergyPageProps {
  onBackToHome: () => void;
  onOpenChat: () => void;
}

export default function EnergyPage({ onBackToHome, onOpenChat }: EnergyPageProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    industry: '',
    jobTitle: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.phone && formData.email) {
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
            className="flex items-center gap-2 text-sm font-bold text-purple-700 hover:text-purple-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Quay lại</span>
          </button>
        </div>
      </div>

      {/* Hero Section Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
        <div className="relative overflow-hidden bg-slate-950 text-white py-16 lg:py-20 rounded-3xl px-6 sm:px-10 lg:px-14 shadow-2xl border border-slate-800">
          {/* Full Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={imgBanner}
              alt="VinFast Energy Banner"
              className="w-full h-full object-cover object-[70%_center] sm:object-center opacity-100"
            />
            {/* Lighter Gradient Overlay for Brighter Banner Image */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/30 to-transparent pointer-events-none" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 max-w-2xl py-2">
            <span className="inline-block px-3.5 py-1.5 bg-slate-900/90 text-emerald-300 text-xs font-extrabold rounded-full tracking-wider uppercase mb-4 border border-emerald-500/40 backdrop-blur-md">
              TIÊN PHONG GIẢI PHÁP LƯU TRỮ XANH (BESS)
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-lg">
              Giải Pháp Lưu Trữ Năng Lượng VinFast Energy
            </h1>
            <p className="text-gray-100 text-base sm:text-lg leading-relaxed mb-6 font-medium drop-shadow">
              VinFast Energy là đơn vị hàng đầu về cung cấp giải pháp lưu trữ năng lượng với năng lực toàn diện từ nghiên cứu phát triển đến sản xuất. Ứng dụng công nghệ pin Lithium-ion hiện đại đạt tiêu chuẩn quốc tế.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#consulting"
                className="px-6 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105 text-sm"
              >
                Khám phá giải pháp & Đăng ký tư vấn
              </a>
              <button
                onClick={onOpenChat}
                className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all"
              >
                Tư vấn AI Energy Advisor
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* SECTION 1: GIỚI THIỆU CHUNG & LỢI ÍCH CỐT LÕI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-10">
            <div>
              <span className="text-xs font-extrabold text-purple-700 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                GIỚI THIỆU CHUNG
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-3 mb-4">
                Năng Lực Toàn Diện Từ Nghiên Cứu Đến Sản Xuất
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                VinFast Energy là đơn vị hàng đầu về cung cấp giải pháp lưu trữ năng lượng với năng lực toàn diện từ nghiên cứu phát triển đến sản xuất. VinFast Energy ứng dụng công nghệ pin Lithium-ion hiện đại để cung cấp giải pháp lưu trữ năng lượng đáp ứng các tiêu chuẩn quốc tế về an toàn và hiệu quả.
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-md">
              <img
                src={imgGioiThieuChung}
                alt="Giới thiệu chung VinFast Energy"
                className="w-full h-auto max-h-[340px] object-contain rounded-xl hover:scale-102 transition-transform duration-300 mx-auto"
              />
              <div className="pt-2.5 pb-0.5 px-2 text-center border-t border-gray-100 mt-2">
                <span className="text-xs font-semibold text-gray-600">Hệ thống Nghiên cứu & Sản xuất BESS VinFast Energy</span>
              </div>
            </div>
          </div>

          {/* 4 Key Benefit Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Benefit 1 */}
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80 hover:border-purple-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <DollarSign size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tối Ưu Chi Phí Sử Dụng Điện</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Nhu cầu tiêu thụ điện ngày càng tăng thúc đẩy xu hướng sử dụng điện hiệu quả hơn. Giải pháp của VinFast Energy đem lại cơ hội cho khách hàng chủ động hơn trong việc sử dụng điện năng, từ đó góp phần tối ưu chi phí sử dụng.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80 hover:border-blue-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ổn Định Nguồn Cung Điện</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Sở hữu nguồn điện ổn định, chủ động ngày càng quan trọng trong các hoạt động sản xuất, kinh doanh khi nhu cầu tiêu thụ điện ngày càng tăng. Giải pháp BESS VinFast Energy có thể được ứng dụng như một nguồn điện thứ cấp, với thời gian phản ứng nhanh, hỗ trợ ổn định hoạt động sản xuất, kinh doanh.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80 hover:border-indigo-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <Layers size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Điều Hoà Hoạt Động Lưới Điện</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Nhu cầu tiêu thụ điện ngày càng tăng đi cùng với sự phát triển của năng lượng tái tạo (NLTT) luôn tạo ra áp lực lên hệ thống lưới điện. Giải pháp của VinFast Energy có thể hỗ trợ lưới điện thông qua nhiều ứng dụng (điều hoà tần số, điện áp,...). Từ đó giúp tối ưu chi phí đầu tư, giảm áp lực và ổn định hoạt động lâu dài của lưới điện.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80 hover:border-emerald-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Sun size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tối Ưu Năng Lượng Tái Tạo</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Các nhà đầu tư năng lượng tái tạo (NLTT) thường đối mặt với rủi ro thất thoát, gây ảnh hưởng tới hiệu quả đầu tư. Giải pháp BESS VinFast Energy đem lại lợi ích trong việc lưu trữ nguồn NLTT, gia tăng tỷ lệ sử dụng điện sạch và tối ưu hiệu quả dự án.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: ỨNG DỤNG */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-purple-800">
          <span className="text-xs font-extrabold text-purple-300 uppercase tracking-widest bg-purple-500/20 px-3 py-1 rounded-full border border-purple-400/30">
            ỨNG DỤNG BESS
          </span>
          <h2 className="text-3xl font-bold text-white mt-3 mb-4">
            Giải Pháp Phổ Biến Trong Công Cuộc Năng Lượng Sạch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-6">
            <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
              Pin lưu trữ năng lượng (BESS) được xem là giải pháp đóng vai trò then chốt trong việc thúc đẩy công cuộc sử dụng Năng lượng tái tạo - nguồn năng lượng sạch tại Việt Nam và trên toàn cầu.
              <br /><br />
              Bên cạnh đó, pin lưu trữ năng lượng còn là giải pháp được nhiều quốc gia trên thế giới ứng dụng thành công và hiệu quả trong hỗ trợ hoạt động của lưới điện. Giải pháp BESS của VinFast Energy có thể linh hoạt mở rộng quy mô để đáp ứng tất cả các nhu cầu từ sản xuất, truyền tải và phân phối đến tiêu thụ điện năng.
            </p>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-4">
              <h4 className="font-bold text-white text-base mb-3">Lĩnh vực ứng dụng chính:</h4>
              {[
                'Sản xuất điện năng lượng mặt trời & điện gió',
                'Hệ thống truyền tải & phân phối lưới điện quốc gia',
                'Khu công nghiệp & nhà máy chế biến sản xuất',
                'Tòa nhà thương mại, trung tâm dữ liệu & hộ gia đình',
              ].map((app, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-purple-200">
                  <CheckCircle2 size={18} className="text-purple-400 flex-shrink-0" />
                  <span>{app}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: DẢI SẢN PHẨM */}
      <div id="product-lineup" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-extrabold text-purple-700 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              DẢI SẢN PHẨM VINFAST ENERGY
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3 mb-2">
              Nhóm Giải Pháp Đa Dạng Đáp Ứng Mọi Nhu Cầu Của Khách Hàng
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">Từ quy mô hộ gia đình dân dụng đến quy mô công nghiệp container 20FT</p>
          </div>

          {/* Render All 3 Solutions Sequentially */}
          <div className="space-y-10">
            {/* SOLUTION 1: RESIDENTIAL */}
            <div id="solution-residential" className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 scroll-mt-36">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs font-extrabold text-purple-700 uppercase tracking-wider bg-purple-100 px-3 py-1 rounded-full">
                    Gia Đình & Biệt Thự
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-3 mb-3">
                    Giải Pháp Lưu Trữ Năng Lượng Dân Dụng
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    Thiết kế nhỏ gọn, thẩm mỹ cao thích hợp lắp đặt trong nhà hoặc gara. Tự động dự trữ điện từ năng lượng mặt trời ban ngày để sử dụng vào giờ cao điểm hoặc khi mất điện khẩn cấp.
                  </p>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700 font-semibold mb-6">
                    <li className="flex items-center gap-2">✓ Dung lượng linh hoạt từ 5kWh – 20kWh</li>
                    <li className="flex items-center gap-2">✓ Tương thích với tất cả các dòng biến tần (Inverter) phổ biến</li>
                    <li className="flex items-center gap-2">✓ Tích hợp hệ thống quản lý ứng dụng di động 24/7</li>
                    <li className="flex items-center gap-2">✓ Tuổi thọ pin Lithium-ion đạt trên 15 năm (6000+ chu kỳ sạc)</li>
                  </ul>
                  <a href="#consulting" className="inline-block px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm">
                    Đăng ký tư vấn giải pháp Dân dụng
                  </a>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 text-center shadow-md">
                  <div className="overflow-hidden rounded-xl bg-gray-50/80 p-4 mb-4 border border-gray-200/80">
                    <img
                      src={imgDanDung}
                      alt="Giải pháp lưu trữ năng lượng dân dụng"
                      className="w-full h-64 sm:h-72 object-contain mx-auto hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-bold text-gray-900 text-base">VinFast Energy Residential BESS</h4>
                  <p className="text-xs text-gray-500 mt-1">An toàn tuyệt đối - Vận hành êm ái - Không khí thải</p>
                </div>
              </div>
            </div>

            {/* SOLUTION 2: CABINET */}
            <div id="solution-cabinet" className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 scroll-mt-36">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider bg-indigo-100 px-3 py-1 rounded-full">
                    Tòa Nhà & Thương Mại
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-3 mb-3">
                    Giải Pháp Lưu Trữ Năng Lượng Dạng Tủ (Cabinet)
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    Giải pháp tích hợp dạng tủ mô-đun công suất trung bình dành cho tòa nhà văn phòng, trung tâm thương mại, khách sạn và các xưởng sản xuất nhỏ.
                  </p>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700 font-semibold mb-6">
                    <li className="flex items-center gap-2">✓ Dung lượng lưu trữ từ 50kWh – 250kWh</li>
                    <li className="flex items-center gap-2">✓ Thiết kế Modular dễ nâng cấp mở rộng dung lượng</li>
                    <li className="flex items-center gap-2">✓ Tích hợp hệ thống PCCC tự động an toàn tiêu chuẩn quốc tế</li>
                    <li className="flex items-center gap-2">✓ Giảm đáng kể tiền điện giờ cao điểm cho doanh nghiệp</li>
                  </ul>
                  <a href="#consulting" className="inline-block px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm">
                    Đăng ký tư vấn giải pháp Dạng Tủ
                  </a>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 text-center shadow-md">
                  <div className="overflow-hidden rounded-xl bg-gray-50/80 p-4 mb-4 border border-gray-200/80">
                    <img
                      src={imgDangTu}
                      alt="Giải pháp lưu trữ năng lượng dạng tủ"
                      className="w-full h-64 sm:h-72 object-contain mx-auto hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-bold text-gray-900 text-base">VinFast Energy Cabinet BESS</h4>
                  <p className="text-xs text-gray-500 mt-1">Tối ưu hiệu suất kinh doanh - Phản ứng điện khẩn cấp cực nhanh</p>
                </div>
              </div>
            </div>

            {/* SOLUTION 3: 20FT CONTAINER */}
            <div id="solution-container" className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 scroll-mt-36">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
                    Khu Công Nghiệp & Quy Mô Lưới Điện
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-3 mb-3">
                    Giải Pháp Lưu Trữ Năng Lượng 20FT Container
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    Giải pháp công nghiệp quy mô lớn MWh đóng gói trong chuẩn 20FT Container. Phù hợp cho các nhà máy sản xuất công nghiệp nặng, trang trại điện mặt trời/điện gió và điều hòa lưới điện.
                  </p>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700 font-semibold mb-6">
                    <li className="flex items-center gap-2">✓ Dung lượng cực đại từ 1MWh – 3.4MWh mỗi container</li>
                    <li className="flex items-center gap-2">✓ Tích hợp hệ thống làm mát bằng chất lỏng Liquid Cooling hiện đại</li>
                    <li className="flex items-center gap-2">✓ Chuẩn kháng nước bụi IP55/IP65 lắp đặt ngoài trời chịu thời tiết khắc nghiệt</li>
                    <li className="flex items-center gap-2">✓ Tương thích hòa lưới điện quốc tế & hệ thống SCADA/EMS tập trung</li>
                  </ul>
                  <a href="#consulting" className="inline-block px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm">
                    Đăng ký tư vấn giải pháp 20FT Container
                  </a>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 text-center shadow-md">
                  <div className="overflow-hidden rounded-xl bg-gray-50/80 p-4 mb-4 border border-gray-200/80">
                    <img
                      src={img20FTContainer}
                      alt="Giải pháp lưu trữ năng lượng 20FT Container"
                      className="w-full h-64 sm:h-72 object-contain mx-auto hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-bold text-gray-900 text-base">VinFast Energy 20FT Container BESS</h4>
                  <p className="text-xs text-gray-500 mt-1">Sức chứa MWh - Độ bền công nghiệp - Đáp ứng tiêu chuẩn ESG</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: VINFAST ENERGY - NHÀ CUNG CẤP ĐÁNG TIN CẬY (5 LÝ DO) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-extrabold text-purple-700 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              VINFAST ENERGY
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3 mb-2">
              Nhà Cung Cấp Giải Pháp Lưu Trữ Năng Lượng Đáng Tin Cậy
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">Cam kết mang lại giá trị bền vững và dài hạn cho khách hàng</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Reason 1 */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center font-bold mb-3">
                01
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Giải Pháp Phù Hợp Với Nhu Cầu</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                VinFast Energy cung cấp giải pháp lưu trữ năng lượng được thiết kế riêng và tinh chỉnh theo nhu cầu của từng khách hàng.
              </p>
            </div>

            {/* Reason 2 */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold mb-3">
                02
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Chế Độ Bảo Hành Toàn Diện</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Giải pháp của VinFast Energy đi cùng gói bảo hành toàn diện với đội ngũ kỹ thuật ngay tại Việt Nam và dịch vụ chăm sóc khách hàng chất lượng.
              </p>
            </div>

            {/* Reason 3 */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold mb-3">
                03
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Tương Thích Cao Và Đa Ứng Dụng</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Giải pháp của VinFast Energy có khả năng đáp ứng đa dạng các nhu cầu của khách hàng, từ quy mô dân dụng đến quy mô lưới điện và có thể tích hợp với nhiều loại biến tần (PCS).
              </p>
            </div>

            {/* Reason 4 */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold mb-3">
                04
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Thiết Kế Linh Hoạt Dễ Mở Rộng</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Giải pháp của VinFast Energy được thiết kế giúp công tác tích hợp và triển khai có thể diễn ra nhanh chóng và có thể dễ dàng mở rộng quy mô hệ thống một cách đơn giản.
              </p>
            </div>

            {/* Reason 5 */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 md:col-span-2">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-bold mb-3">
                05
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Chi Phí Cạnh Tranh & Tối Ưu Đầu Tư</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Giải pháp của VinFast Energy cam kết mang lại giá trị dài hạn cho khách hàng, giúp tối ưu hiệu quả đầu tư dự án và rút ngắn thời gian thu hồi vốn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: NHÀ MÁY & DÂY CHUYỀN SẢN XUẤT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-widest bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                NHÀ MÁY & DÂY CHUYỀN
              </span>
              <h2 className="text-3xl font-bold text-white mt-3 mb-4">
                Khám Phá Nhà Máy Sản Xuất Pin VinFast Energy
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Nhà máy sản xuất pin VinFast Energy được đầu tư trang thiết bị tự động hóa tiên tiến hàng đầu thế giới, quy trình kiểm soát chất lượng nghiêm ngặt đảm bảo từng cell pin và pack pin BESS xuất xưởng đều đạt chuẩn an toàn quốc tế.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs">
                  <strong className="block text-purple-400 font-bold text-base mb-0.5">Tự Động Hóa 95%+</strong>
                  Dây chuyền sản xuất robot hiện đại
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs">
                  <strong className="block text-emerald-400 font-bold text-base mb-0.5">Tiêu Chuẩn UN38.3</strong>
                  Đạt chứng nhận an toàn quốc tế
                </div>
              </div>
            </div>
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
              <video
                src={videoNhaMay}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto max-h-[340px] object-cover rounded-2xl"
              />
              <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-center">
                <h4 className="font-bold text-white text-xs sm:text-sm">Video thực tế Nhà Máy Sản Xuất Pin VinFast Energy</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: FORM ĐĂNG KÝ TƯ VẤN (Khám phá Giải pháp của Chúng tôi) */}
      <div id="consulting" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-xl">
          <div className="text-center mb-8">
            <span className="text-xs font-extrabold text-purple-700 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              ĐĂNG KÝ TƯ VẤN BESS
            </span>
            <h3 className="text-2xl font-bold text-gray-900 mt-2">Khám Phá Giải Pháp Của Chúng Tôi</h3>
            <p className="text-xs text-gray-500 mt-1">Điền thông tin của bạn bên dưới, chuyên gia VinFast Energy sẽ liên hệ trực tiếp</p>
          </div>

          {submitted ? (
            <div className="bg-purple-50 border border-purple-200 text-purple-900 p-6 rounded-2xl text-center">
              <CheckCircle2 size={48} className="mx-auto text-purple-700 mb-3" />
              <h4 className="font-bold text-lg">Đã gửi thông tin yêu cầu thành công!</h4>
              <p className="text-sm text-purple-800 mt-1">
                Cảm ơn ông/bà <strong>{formData.fullName}</strong> ({formData.company || 'Quý khách'}). Đội ngũ kỹ sư VinFast Energy sẽ liên hệ lại qua Email <strong>{formData.email}</strong> và SĐT <strong>{formData.phone}</strong> trong thời gian sớm nhất.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Họ và Tên *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Công ty</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Tên công ty / Tổ chức"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Ngành</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="Sản xuất / Năng lượng / Thương mại..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Chức danh</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="Giám đốc / Quản lý dự án / Kỹ sư..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Số điện thoại liên hệ *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0912 345 678"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Thông tin yêu cầu (Nếu có)</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Chi tiết công suất MWh, địa điểm triển khai hoặc thắc mắc cần tư vấn..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-purple-700 hover:bg-purple-800 text-white font-bold text-base rounded-xl transition-all shadow-md mt-4 flex items-center justify-center gap-2 hover:scale-101"
              >
                <Send size={18} />
                <span>Gửi Yêu Cầu Tư Vấn Giải Pháp BESS</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
