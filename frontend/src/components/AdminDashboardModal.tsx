import { useState, useEffect, useCallback } from 'react';
import {
  X, Users, Car, FileText, Calendar, Plus, Trash2, Edit3, CheckCircle2,
  XCircle, RefreshCw, ShieldCheck, Search, Loader2, UserPlus, Phone, Mail, Award, Lock, Upload, ArrowRight, Download, Zap
} from 'lucide-react';
import { api, getImageUrl, formatVNDPrice } from '@/lib/api';

interface AdminDashboardModalProps {
  open: boolean;
  onClose: () => void;
}

type TabType = 'users' | 'cars' | 'escooters' | 'quotes' | 'bookings';

export default function AdminDashboardModal({ open, onClose }: AdminDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [users, setUsers] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [escooters, setEscooters] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  // Sub-Filters states
  const [carCategoryFilter, setCarCategoryFilter] = useState<'all' | 'suv' | 'scooter' | 'commercial'>('all');
  const [quoteStatusFilter, setQuoteStatusFilter] = useState<string>('all');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');

  const filteredUsers = users.filter(
    (u) =>
      !searchQuery ||
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.includes(searchQuery) ||
      u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCars = cars.filter(
    (c) =>
      !searchQuery ||
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCarsByCategory = filteredCars.filter((c) => {
    if (carCategoryFilter === 'all') return true;
    const catLower = (c.category || '').toLowerCase();
    if (carCategoryFilter === 'scooter') return catLower.includes('scooter') || catLower.includes('xe máy');
    if (carCategoryFilter === 'commercial') return catLower.includes('commercial') || catLower.includes('dịch vụ') || catLower.includes('thương mại') || catLower.includes('bus');
    return !catLower.includes('scooter') && !catLower.includes('commercial') && !catLower.includes('dịch vụ') && !catLower.includes('bus');
  });

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      !searchQuery ||
      q.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customer_phone?.includes(searchQuery) ||
      q.vehicle_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.status?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (quoteStatusFilter === 'all') return true;
    const st = (q.status || 'pending').toLowerCase();
    return st === quoteStatusFilter.toLowerCase();
  });

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      !searchQuery ||
      b.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer_phone?.includes(searchQuery) ||
      b.vehicle_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.status?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (bookingStatusFilter === 'all') return true;
    const st = (b.status || 'pending').toLowerCase();
    return st === bookingStatusFilter.toLowerCase();
  });

  // Modals state
  const [showCreateStaff, setShowCreateStaff] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [showCarModal, setShowCarModal] = useState(false);
  const [editingCar, setEditingCar] = useState<any | null>(null);

  // Forms state
  const [staffForm, setStaffForm] = useState({
    email: '',
    phone: '',
    password: '',
    full_name: '',
    role: 'consultant',
  });

  const [editUserForm, setEditUserForm] = useState({
    full_name: '',
    phone: '',
    role: 'consultant',
    password: '',
  });

  const [carForm, setCarForm] = useState({
    name: '',
    code: '',
    category: 'suv',
    base_price: 500000000,
    battery_buy_price: 600000000,
    battery_rent_monthly: 1500000,
    is_available: true,
    description: '',
    image_url: '',

    // Detailed Technical Specs
    engine_type: 'Mô tơ điện',
    power_hp: '201 hp',
    torque_nm: '310 Nm',
    drivetrain: 'FWD',
    battery_capacity_kwh: '59.6 kWh',
    range_km: '400 km',
    fast_charge_time: '30 phút (10-70%)',

    seats: 5,
    dimensions_mm: '4540 x 1890 x 1636 mm',
    wheelbase_mm: '2840 mm',
    ground_clearance_mm: '175 mm',
    wheels_rims: '19 inch',

    infotainment_screen: 'Cảm ứng 15.6 inch',
    speakers: '8 loa',
    seat_material: 'Da cao cấp',
    airbags: 8,
    has_adas: true,
  });

  const [carImageFile, setCarImageFile] = useState<File | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setMsg('');
    try {
      if (activeTab === 'users') {
        const uList = await api.getUsers<any[]>();
        setUsers(uList || []);
      } else if (activeTab === 'cars') {
        const cList = await api.getCars<any[]>();
        setCars(cList || []);
      } else if (activeTab === 'escooters') {
        const sList = await api.getEScooters<any[]>();
        setEscooters(sList || []);
      } else if (activeTab === 'quotes') {
        const qList = await api.getQuotes<any[]>();
        setQuotes(qList || []);
      } else if (activeTab === 'bookings') {
        const bList = await api.getBookings<any[]>();
        setBookings(bList || []);
      }
    } catch (err: any) {
      setMsg(err.message || 'Tải dữ liệu thất bại.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  // USER HANDLERS
  const handleCreateStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      setLoading(true);
      await api.createStaff(staffForm);
      const roleText = staffForm.role === 'admin' ? 'Quản trị viên (Admin)' : 'Tư vấn viên (Staff)';
      setMsg(`Tạo tài khoản ${roleText} thành công! Email: ${staffForm.email} | Mật khẩu cấp: ${staffForm.password}`);
      setShowCreateStaff(false);
      setStaffForm({ email: '', phone: '', password: '', full_name: '', role: 'consultant' });
      fetchData();
    } catch (err: any) {
      setMsg(err.message || 'Tạo tài khoản thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      setLoading(true);
      await api.updateUser(editingUser.id, editUserForm);
      setMsg(`Đã cập nhật tài khoản ${editingUser.email}`);
      setEditingUser(null);
      fetchData();
    } catch (err: any) {
      setMsg(err.message || 'Cập nhật tài khoản thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản ${email}?`)) return;
    try {
      setLoading(true);
      await api.deleteUser(userId);
      setMsg(`Đã xóa thành công tài khoản ${email}`);
      fetchData();
    } catch (err: any) {
      setMsg(err.message || 'Xóa tài khoản thất bại.');
    } finally {
      setLoading(false);
    }
  };

  // CAR HANDLERS
  const handleOpenAddCar = () => {
    setEditingCar(null);
    setCarForm({
      name: '',
      code: '',
      category: 'suv',
      base_price: 500000000,
      battery_buy_price: 600000000,
      battery_rent_monthly: 1500000,
      is_available: true,
      description: '',
      image_url: '',

      engine_type: 'Mô tơ điện',
      power_hp: '201 hp',
      torque_nm: '310 Nm',
      drivetrain: 'FWD',
      battery_capacity_kwh: '59.6 kWh',
      range_km: '400 km',
      fast_charge_time: '30 phút (10-70%)',

      seats: 5,
      dimensions_mm: '4540 x 1890 x 1636 mm',
      wheelbase_mm: '2840 mm',
      ground_clearance_mm: '175 mm',
      wheels_rims: '19 inch',

      infotainment_screen: 'Cảm ứng 15.6 inch',
      speakers: '8 loa',
      seat_material: 'Da cao cấp',
      airbags: 8,
      has_adas: true,
    });
    setCarImageFile(null);
    setShowCarModal(true);
  };

  const handleOpenEditCar = (car: any) => {
    setEditingCar(car);
    const specs = car.specs || {};
    const engine_items = specs.engine_drivetrain?.items || specs.engine_drivetrain || {};
    const dim_items = specs.dimensions_weight?.items || specs.dimensions_weight || {};
    const interior_items = specs.interior?.items || specs.interior || {};
    const safety_items = specs.safety_adas?.items || specs.safety_adas || {};

    const catLower = (car.category || 'suv').toLowerCase();
    const categoryVal = catLower.includes('scooter') || catLower.includes('xe máy')
      ? 'scooter'
      : catLower.includes('commercial') || catLower.includes('dịch vụ') || catLower.includes('thương mại') || catLower.includes('bus')
      ? 'commercial'
      : 'suv';

    if (categoryVal === 'scooter') {
      setCarForm({
        name: car.name || '',
        code: car.code || '',
        category: categoryVal,
        base_price: car.base_price || 0,
        battery_buy_price: car.battery_buy_price || 0,
        battery_rent_monthly: car.battery_rent_monthly || 0,
        is_available: car.is_available ?? true,
        description: car.description || '',
        image_url: car.image_url || '',

        engine_type: String(engine_items.engine_type || engine_items.motor_type || 'Động cơ BLDC In-hub'),
        power_hp: String(engine_items.power_w || engine_items.power_hp || specs.motor_power || '1500 W'),
        torque_nm: String(engine_items.top_speed_kmh || engine_items.torque_nm || '70 km/h'),
        drivetrain: String(engine_items.battery_type || engine_items.drivetrain || 'Pin LFP'),
        battery_capacity_kwh: String(engine_items.battery_capacity_kwh || specs.battery_capacity || '3.5 kWh'),
        range_km: String(engine_items.range_km || specs.driving_range || '203 km'),
        fast_charge_time: String(engine_items.fast_charge_time || engine_items.charge_time || '4 giờ (Sạc tiêu chuẩn)'),

        seats: typeof dim_items.trunk_capacity_l === 'number' ? dim_items.trunk_capacity_l : (parseInt(dim_items.trunk_capacity_l || dim_items.seats) || 22),
        dimensions_mm: String(dim_items.dimensions_mm || '1910 x 692 x 1083 mm'),
        wheelbase_mm: String(dim_items.seat_height_mm || dim_items.wheelbase_mm || '770 mm'),
        ground_clearance_mm: String(dim_items.weight_kg || dim_items.ground_clearance_mm || '100 kg'),
        wheels_rims: String(dim_items.wheels_rims || 'Lốp không ruột 14 inch'),

        infotainment_screen: String(interior_items.brakes || interior_items.infotainment_screen || 'Phanh đĩa / CBS'),
        speakers: String(interior_items.smart_key || interior_items.speakers || 'Khóa Smartkey & Định vị GPS'),
        seat_material: String(interior_items.riding_modes || interior_items.seat_material || 'Eco / Sport'),
        airbags: 0,
        has_adas: false,
      });
    } else if (categoryVal === 'commercial') {
      setCarForm({
        name: car.name || '',
        code: car.code || '',
        category: categoryVal,
        base_price: car.base_price || 0,
        battery_buy_price: car.battery_buy_price || 0,
        battery_rent_monthly: car.battery_rent_monthly || 0,
        is_available: car.is_available ?? true,
        description: car.description || '',
        image_url: car.image_url || '',

        engine_type: String(engine_items.engine_type || 'Động cơ điện Thương mại'),
        power_hp: String(engine_items.power_hp || specs.motor_power || '350 hp'),
        torque_nm: String(engine_items.torque_nm || '1200 Nm'),
        drivetrain: String(engine_items.drivetrain || 'Cầu sau (RWD / Bus)'),
        battery_capacity_kwh: String(engine_items.battery_capacity_kwh || specs.battery_capacity || '281 kWh'),
        range_km: String(engine_items.range_km || specs.driving_range || '260 km'),
        fast_charge_time: String(engine_items.fast_charge_time || '2 giờ (Sạc nhanh DC 150kW)'),

        seats: typeof dim_items.seats === 'number' ? dim_items.seats : (parseInt(dim_items.seats) || 68),
        dimensions_mm: String(dim_items.dimensions_mm || '10480 x 2500 x 3380 mm'),
        wheelbase_mm: String(dim_items.wheelbase_mm || '6000 mm'),
        ground_clearance_mm: String(dim_items.ground_clearance_mm || '230 mm'),
        wheels_rims: String(dim_items.wheels_rims || '22.5 inch (Lốp thương mại)'),

        infotainment_screen: String(interior_items.infotainment_screen || 'Màn hình giám sát hành trình'),
        speakers: String(interior_items.speakers || 'Hệ thống Loa thông báo toàn xe'),
        seat_material: String(interior_items.seat_material || 'Ghế nỉ cao cấp / 68 chỗ'),
        airbags: typeof safety_items.airbags === 'number' ? safety_items.airbags : (parseInt(safety_items.airbags) || 2),
        has_adas: safety_items.has_adas ?? true,
      });
    } else {
      setCarForm({
        name: car.name || '',
        code: car.code || '',
        category: categoryVal,
        base_price: car.base_price || 0,
        battery_buy_price: car.battery_buy_price || 0,
        battery_rent_monthly: car.battery_rent_monthly || 0,
        is_available: car.is_available ?? true,
        description: car.description || '',
        image_url: car.image_url || '',

        engine_type: String(engine_items.engine_type || engine_items.motor_type || 'Mô tơ điện kép (AWD)'),
        power_hp: String(engine_items.power_hp || specs.motor_power || '402 hp'),
        torque_nm: String(engine_items.torque_nm || '620 Nm'),
        drivetrain: String(engine_items.drivetrain || 'AWD'),
        battery_capacity_kwh: String(engine_items.battery_capacity_kwh || specs.battery_capacity || '87.7 kWh'),
        range_km: String(engine_items.range_km || specs.driving_range || '471 km'),
        fast_charge_time: String(engine_items.fast_charge_time || '31 phút (10-70%)'),

        seats: typeof dim_items.seats === 'number' ? dim_items.seats : (parseInt(dim_items.seats) || 5),
        dimensions_mm: String(dim_items.dimensions_mm || '4750 x 1934 x 1667 mm'),
        wheelbase_mm: String(dim_items.wheelbase_mm || '2950 mm'),
        ground_clearance_mm: String(dim_items.ground_clearance_mm || '175 mm'),
        wheels_rims: String(dim_items.wheels_rims || '20 inch hợp kim'),

        infotainment_screen: String(interior_items.infotainment_screen || 'Cảm ứng 15.6 inch'),
        speakers: String(interior_items.speakers || '10 loa cao cấp'),
        seat_material: String(interior_items.seat_material || 'Da Vegan cao cấp'),
        airbags: typeof safety_items.airbags === 'number' ? safety_items.airbags : (parseInt(safety_items.airbags) || 11),
        has_adas: safety_items.has_adas ?? true,
      });
    }
    setCarImageFile(null);
    setShowCarModal(true);
  };

  const handleSaveCarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      setLoading(true);
      const specsJSON = {
        engine_drivetrain: {
          title: 'Động cơ / Hộp số',
          items: {
            engine_type: carForm.engine_type,
            power_hp: carForm.power_hp,
            torque_nm: carForm.torque_nm,
            drivetrain: carForm.drivetrain,
            battery_capacity_kwh: carForm.battery_capacity_kwh,
            range_km: carForm.range_km,
            fast_charge_time: carForm.fast_charge_time,
          },
        },
        dimensions_weight: {
          title: 'Kích thước / Trọng lượng',
          items: {
            seats: Number(carForm.seats),
            dimensions_mm: carForm.dimensions_mm,
            wheelbase_mm: carForm.wheelbase_mm,
            ground_clearance_mm: carForm.ground_clearance_mm,
            wheels_rims: carForm.wheels_rims,
          },
        },
        interior: {
          title: 'Nội thất & Tiện nghi',
          items: {
            infotainment_screen: carForm.infotainment_screen,
            speakers: carForm.speakers,
            seat_material: carForm.seat_material,
          },
        },
        safety_adas: {
          title: 'Công nghệ an toàn & ADAS',
          items: {
            airbags: Number(carForm.airbags),
            has_adas: carForm.has_adas,
          },
        },
        battery_capacity: carForm.battery_capacity_kwh,
        driving_range: carForm.range_km,
        seating_capacity: Number(carForm.seats),
        motor_power: carForm.power_hp,
      };

      const formData = new FormData();
      formData.append('name', carForm.name);
      formData.append('category', carForm.category);
      formData.append('base_price', String(carForm.base_price));
      formData.append('battery_buy_price', String(carForm.battery_buy_price));
      formData.append('battery_rent_monthly', String(carForm.battery_rent_monthly));
      formData.append('is_available', String(carForm.is_available));
      formData.append('description', carForm.description);
      formData.append('specs_json', JSON.stringify(specsJSON));
      if (carImageFile) {
        formData.append('image', carImageFile);
      } else if (carForm.image_url) {
        formData.append('image_url', carForm.image_url);
      }

      if (editingCar) {
        // Edit Car
        await api.updateCar(editingCar.id, formData);
        setMsg(`Đã cập nhật thông tin và hình ảnh mẫu xe ${carForm.name}`);
      } else {
        // Create Car
        formData.append('code', carForm.code);
        await api.createCar(formData);
        setMsg(`Đã thêm mẫu xe mới ${carForm.name} vào PostgreSQL!`);
      }

      setShowCarModal(false);
      fetchData();
    } catch (err: any) {
      setMsg(err.message || 'Lưu thông tin mẫu xe thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async (carId: string, carName: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa mẫu xe ${carName}?`)) return;
    try {
      setLoading(true);
      await api.deleteCar(carId);
      setMsg(`Đã xóa thành công mẫu xe ${carName}`);
      fetchData();
    } catch (err: any) {
      setMsg(err.message || 'Xóa mẫu xe thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCarAvailability = async (car: any) => {
    try {
      const newStatus = !car.is_available;
      const formData = new FormData();
      formData.append('is_available', String(newStatus));
      await api.updateCar(car.id, formData);
      setCars((prev) => prev.map((c) => (c.id === car.id ? { ...c, is_available: newStatus } : c)));
      setMsg(`Đã đổi trạng thái ${car.name} sang: ${newStatus ? 'Đang mở bán' : 'Tạm ngưng'}`);
    } catch {
      setMsg('Lỗi khi cập nhật trạng thái mẫu xe');
    }
  };

  const handleUpdateQuote = async (quoteId: string, status: string) => {
    try {
      setLoading(true);
      await api.updateQuoteStatus(quoteId, { status });
      setMsg(`Đã cập nhật trạng thái báo giá thành: ${status}`);
      fetchData();
    } catch (err: any) {
      setMsg(err.message || 'Cập nhật báo giá thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBooking = async (bookingId: string, status: string) => {
    try {
      setLoading(true);
      await api.updateBookingStatus(bookingId, { status });
      setMsg(`Đã cập nhật trạng thái lịch hẹn thành: ${status}`);
      fetchData();
    } catch (err: any) {
      setMsg(err.message || 'Cập nhật lịch hẹn thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportQuotesCSV = () => {
    if (!quotes || quotes.length === 0) {
      alert('Chưa có dữ liệu báo giá để xuất Excel');
      return;
    }
    let csvContent = '\uFEFFHo va Ten,So Dien Thoai,Mau Xe,Gia Niem Yet,Trang Thai,Ngay Tao\n';
    quotes.forEach((q) => {
      csvContent += `"${q.customer_name || ''}","${q.customer_phone || ''}","${q.vehicle_name || ''}","${q.base_price || 0}","${q.status || 'Chờ xác nhận'}","${q.created_at ? new Date(q.created_at).toLocaleDateString('vi-VN') : ''}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VinFast_BaoGia_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportBookingsCSV = () => {
    if (!bookings || bookings.length === 0) {
      alert('Chưa có dữ liệu lịch hẹn lái thử để xuất Excel');
      return;
    }
    let csvContent = '\uFEFFHo va Ten,So Dien Thoai,Xe Dang Ky,Ngay Hen,Khung Gio,Trang Thai\n';
    bookings.forEach((b) => {
      csvContent += `"${b.customer_name || ''}","${b.customer_phone || ''}","${b.vehicle_name || ''}","${b.preferred_date || ''}","${b.preferred_time || ''}","${b.status || 'Chờ xác nhận'}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VinFast_LaiThu_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showCarModal) {
          setShowCarModal(false);
        } else if (showCreateStaff) {
          setShowCreateStaff(false);
        } else if (open) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, showCarModal, showCreateStaff, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-slate-950 flex flex-col overflow-hidden text-slate-800 font-sans">
      
      {/* Top Navigation Bar */}
      <div className="bg-slate-950 text-white px-6 py-3 flex items-center justify-between shrink-0 border-b border-slate-800/80 shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            {/* VinFast Official V Icon */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center font-black text-white text-base shadow-inner border border-white/20">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-widest text-white uppercase font-sans">VINFAST</span>
                <span className="text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full tracking-wider">
                  Admin Center
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium block">Hệ thống Quản trị Doanh nghiệp</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-blue-400' : 'text-slate-400'} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm border border-red-500/50"
          >
            <X size={15} />
            <span>Thoát</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden bg-slate-100">
        
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-slate-200 p-4 shrink-0 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Danh mục Quản trị
            </div>
            {[
              { id: 'users', label: 'Tài khoản Staff & Admin', icon: Users, count: users.length },
              { id: 'cars', label: 'Catalog Ô tô & Xe Dịch vụ', icon: Car, count: cars.length },
              { id: 'escooters', label: 'Catalog Xe Máy Điện', icon: Zap, count: escooters.length },
              { id: 'quotes', label: 'Quản lý Báo giá (HITL)', icon: FileText, count: quotes.length },
              { id: 'bookings', label: 'Lịch Đặt Lái Thử', icon: Calendar, count: bookings.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-blue-900 text-white shadow-md font-extrabold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={17} className={active ? 'text-blue-300' : 'text-slate-500'} />
                    <span>{tab.label}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 text-xs">
            <div className="font-bold text-slate-800">Database Status</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              PostgreSQL Connected
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">

          {/* Top Search Bar */}
          <div className="bg-white px-6 py-3 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={`Tìm kiếm trong ${activeTab === 'users' ? 'tài khoản nhân viên' : activeTab === 'cars' ? 'catalog xe' : activeTab === 'quotes' ? 'báo giá' : 'lịch lái thử'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-10 pr-8 py-2 border rounded-xl bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none transition-all font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="text-xs font-semibold text-slate-500 hidden sm:block">
              {searchQuery ? (
                <span className="text-blue-700 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Tìm thấy: {activeTab === 'users' ? filteredUsers.length : activeTab === 'cars' ? filteredCars.length : activeTab === 'quotes' ? filteredQuotes.length : filteredBookings.length} kết quả
                </span>
              ) : (
                <span>Tổng số: <strong>{activeTab === 'users' ? users.length : activeTab === 'cars' ? cars.length : activeTab === 'quotes' ? quotes.length : bookings.length}</strong> {activeTab === 'users' ? 'tài khoản' : activeTab === 'cars' ? 'mẫu xe' : activeTab === 'quotes' ? 'báo giá' : 'lịch lái thử'}</span>
              )}
            </div>
          </div>



          {/* Alert Message Banner */}
          {msg && (
            <div className={`mx-6 mt-4 p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between shrink-0 shadow-sm ${
              msg.includes('thành công') ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-red-50 text-red-800 border border-red-300'
            }`}>
              <span>{msg}</span>
              <button onClick={() => setMsg('')} className="text-slate-400 hover:text-slate-700"><X size={14} /></button>
            </div>
          )}

          {/* Scrollable Main Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            
            {/* TAB 1: USERS MANAGEMENT */}
            {activeTab === 'users' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Danh sách Tài khoản & Nhân viên ({users.length})</h3>
                    <p className="text-xs text-slate-500">Quản lý cấp tài khoản, phân quyền và khóa/xóa tài khoản</p>
                  </div>
                  <button
                    onClick={() => setShowCreateStaff(!showCreateStaff)}
                    className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shrink-0"
                  >
                    <UserPlus size={16} />
                    <span>Cấp tài khoản Nhân viên mới</span>
                  </button>
                </div>

                {/* Form Create Staff */}
                {showCreateStaff && (
                  <form onSubmit={handleCreateStaffSubmit} className="p-5 bg-white rounded-2xl border-2 border-blue-600 shadow-xl space-y-4">
                    <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider">Cấp tài khoản Nhân viên / Quản trị viên mới</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email đăng nhập</label>
                        <input
                          type="email"
                          required
                          placeholder="sale@vinfast.vn"
                          value={staffForm.email}
                          onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                          className="w-full text-xs p-2.5 border rounded-xl focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Họ và tên</label>
                        <input
                          type="text"
                          required
                          placeholder="Nguyễn Văn A"
                          value={staffForm.full_name}
                          onChange={(e) => setStaffForm({ ...staffForm, full_name: e.target.value })}
                          className="w-full text-xs p-2.5 border rounded-xl focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Số điện thoại</label>
                        <input
                          type="text"
                          required
                          placeholder="0901234567"
                          value={staffForm.phone}
                          onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                          className="w-full text-xs p-2.5 border rounded-xl focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Vai trò (Role)</label>
                        <select
                          value={staffForm.role}
                          onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                          className="w-full text-xs p-2.5 border rounded-xl bg-white focus:border-blue-600 focus:outline-none font-semibold text-slate-800"
                        >
                          <option value="consultant">Tư vấn viên (Staff)</option>
                          <option value="admin">Quản trị viên (Admin)</option>
                        </select>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-bold text-slate-700 uppercase">Mật khẩu ban đầu</label>
                          <button
                            type="button"
                            onClick={() => {
                              const randPass = 'Vinfast@' + Math.floor(100000 + Math.random() * 900000);
                              setStaffForm({ ...staffForm, password: randPass });
                            }}
                            className="text-[10px] text-blue-600 font-bold hover:underline"
                          >
                            Tạo ngẫu nhiên
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Nhập mật khẩu"
                          value={staffForm.password}
                          onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                          className="w-full text-xs p-2.5 border rounded-xl focus:border-blue-600 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setShowCreateStaff(false)} className="px-4 py-2 text-xs font-bold border rounded-xl">Hủy</button>
                      <button type="submit" disabled={loading} className="px-5 py-2 text-xs bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 shadow-md">
                        {loading ? 'Đang tạo...' : 'Tạo tài khoản ngay'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Edit User Form Modal */}
                {editingUser && (
                  <form onSubmit={handleEditUserSubmit} className="p-5 bg-white rounded-2xl border-2 border-amber-500 shadow-xl space-y-4">
                    <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">Chỉnh sửa tài khoản: {editingUser.email}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Họ và tên</label>
                        <input
                          type="text"
                          value={editUserForm.full_name}
                          onChange={(e) => setEditUserForm({ ...editUserForm, full_name: e.target.value })}
                          className="w-full text-xs p-2.5 border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Số điện thoại</label>
                        <input
                          type="text"
                          value={editUserForm.phone}
                          onChange={(e) => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                          className="w-full text-xs p-2.5 border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Phân quyền (Role)</label>
                        <select
                          value={editUserForm.role}
                          onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
                          className="w-full text-xs p-2.5 border rounded-xl bg-white"
                        >
                          <option value="customer">Khách hàng (Customer)</option>
                          <option value="consultant">Tư vấn viên (Consultant)</option>
                          <option value="admin">Quản trị viên (Admin)</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-xs border rounded-xl">Hủy</button>
                      <button type="submit" disabled={loading} className="px-5 py-2 text-xs bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700">
                        {loading ? 'Đang lưu...' : 'Lưu chỉnh sửa'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Users Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Họ và tên</th>
                        <th className="p-3.5">Email VinFast</th>
                        <th className="p-3.5">Số điện thoại</th>
                        <th className="p-3.5">Vai trò (Role)</th>
                        <th className="p-3.5 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900">{u.full_name}</td>
                          <td className="p-3.5 text-slate-600 font-medium">{u.email}</td>
                          <td className="p-3.5 text-slate-600">{u.phone}</td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              u.role === 'admin'
                                ? 'bg-red-100 text-red-700 border border-red-300'
                                : u.role === 'consultant'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {u.role === 'admin' ? 'ADMIN (Quản trị)' : u.role === 'consultant' ? 'Tư vấn viên (Staff)' : 'Khách hàng'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingUser(u);
                                setEditUserForm({ full_name: u.full_name, phone: u.phone, role: u.role, password: '' });
                              }}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Sửa thông tin"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa tài khoản"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: CARS MANAGEMENT */}
            {activeTab === 'cars' && (
              <div className="space-y-5">
                {/* Header & Add Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Danh mục Mẫu xe VinFast ({cars.length})</h3>
                    <p className="text-xs text-slate-500">Quản lý thông số kỹ thuật, bảng giá và phân loại các dòng xe</p>
                  </div>
                  <button
                    onClick={handleOpenAddCar}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shrink-0"
                  >
                    <Plus size={18} />
                    <span>+ Thêm Mẫu Xe Mới</span>
                  </button>
                </div>

                {/* Sub-Category Filter Tabs */}
                <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                  {[
                    { id: 'all', label: 'Tất cả ô tô (16 mẫu)', count: cars.length },
                    { id: 'suv', label: 'Ô tô điện cá nhân (11 mẫu)', count: cars.filter(c => !c.category?.toLowerCase().includes('commercial') && !c.category?.toLowerCase().includes('dịch vụ')).length },
                    { id: 'commercial', label: 'Xe dịch vụ & Thương mại (5 mẫu)', count: cars.filter(c => c.category?.toLowerCase().includes('commercial') || c.category?.toLowerCase().includes('dịch vụ')).length },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setCarCategoryFilter(tab.id as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                        carCategoryFilter === tab.id
                          ? 'bg-blue-900 text-white shadow-md'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        carCategoryFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Cars Vertical List Layout */}
                <div className="space-y-3">
                  {filteredCarsByCategory.map((c) => {
                    const specs = c.specs || {};
                    const engine_items = specs.engine_drivetrain?.items || specs.engine_drivetrain || {};
                    const dim_items = specs.dimensions_weight?.items || specs.dimensions_weight || {};

                    return (
                      <div key={c.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 grid grid-cols-12 gap-4 items-center hover:shadow-md transition-all">
                        
                        {/* Left: Thumbnail & Main Info (Col 1-5) */}
                        <div className="col-span-12 lg:col-span-5 flex items-center gap-3.5 min-w-0">
                          <div className="w-28 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 relative border border-slate-100 shadow-inner">
                            <img src={getImageUrl(c.image_url)} alt={c.name} className="w-full h-full object-cover" />
                            <span className={`absolute top-1 left-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded text-white shadow-sm uppercase ${c.is_available ? 'bg-emerald-600' : 'bg-slate-600'}`}>
                              {c.is_available ? 'Mở bán' : 'Tạm ngưng'}
                            </span>
                          </div>
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-extrabold text-slate-900 truncate">{c.name}</h4>
                              <span className="text-[10px] font-mono bg-blue-50 text-blue-800 font-bold px-1.5 py-0.5 rounded border border-blue-200 shrink-0">
                                {c.code}
                              </span>
                              <span className="text-[10px] font-extrabold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded uppercase shrink-0">
                                {c.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1">{c.description || 'Chưa có mô tả'}</p>
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-xs font-black text-red-600 shrink-0">{formatVNDPrice(c.base_price)}</span>
                              {c.battery_buy_price > 0 && (
                                <span className="text-[11px] text-slate-500 font-semibold truncate">| Mua: {formatVNDPrice(c.battery_buy_price)}</span>
                              )}
                              {c.battery_rent_monthly > 0 && (
                                <span className="text-[11px] text-slate-400 font-normal shrink-0">| Thuê: {(c.battery_rent_monthly / 1000).toLocaleString('vi-VN')}k/tháng</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Middle: Key Tech Specs Tags (Col 6-9 - Fixed Alignment) */}
                        <div className="col-span-12 lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-4">
                          {(() => {
                            const catLower = (c.category || '').toLowerCase();
                            const isCommercial = catLower.includes('commercial') || catLower.includes('dịch vụ') || catLower.includes('bus');

                            if (isCommercial) {
                              return (
                                <div className="grid grid-cols-4 gap-2 text-xs font-medium text-slate-600">
                                  <div className="bg-slate-100 p-2 rounded-xl border border-slate-200 text-center">
                                    <span className="text-[9px] text-slate-600 font-bold block uppercase truncate">Sức chứa</span>
                                    <strong className="text-slate-900 text-xs font-black truncate block">{dim_items.seats || specs.seating_capacity || 68} chỗ</strong>
                                  </div>
                                  <div className="bg-blue-50 p-2 rounded-xl border border-blue-100 text-center">
                                    <span className="text-[9px] text-blue-600 font-bold block uppercase truncate">Quãng đường</span>
                                    <strong className="text-blue-900 text-xs font-black truncate block">{engine_items.range_km || specs.driving_range || '260'} km</strong>
                                  </div>
                                  <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100 text-center">
                                    <span className="text-[9px] text-emerald-700 font-bold block uppercase truncate">Ứng dụng</span>
                                    <strong className="text-emerald-900 text-xs font-black truncate block">Dịch Vụ</strong>
                                  </div>
                                  <div className="bg-purple-50 p-2 rounded-xl border border-purple-100 text-center">
                                    <span className="text-[9px] text-purple-700 font-bold block uppercase truncate">Chuẩn sạc</span>
                                    <strong className="text-purple-900 text-xs font-black truncate block">{engine_items.fast_charge_time || 'Sạc DC'}</strong>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <div className="grid grid-cols-4 gap-2 text-xs font-medium text-slate-600">
                                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
                                  <span className="text-[9px] text-slate-400 font-bold block uppercase truncate">Công suất</span>
                                  <strong className="text-slate-900 text-xs font-extrabold truncate block">{engine_items.power_hp || specs.motor_power || 'N/A'}</strong>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
                                  <span className="text-[9px] text-slate-400 font-bold block uppercase truncate">Quãng đường</span>
                                  <strong className="text-blue-700 text-xs font-extrabold truncate block">{engine_items.range_km || specs.driving_range || 'N/A'} km</strong>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
                                  <span className="text-[9px] text-slate-400 font-bold block uppercase truncate">Chỗ ngồi</span>
                                  <strong className="text-slate-900 text-xs font-extrabold truncate block">{dim_items.seats || specs.seating_capacity || 5} chỗ</strong>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
                                  <span className="text-[9px] text-slate-400 font-bold block uppercase truncate">Dẫn động</span>
                                  <strong className="text-slate-900 text-xs font-extrabold truncate block">{engine_items.drivetrain || 'FWD'}</strong>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Right: Actions (Col 10-12) */}
                        <div className="col-span-12 lg:col-span-3 flex items-center justify-end gap-2 border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0 shrink-0">
                          <button
                            onClick={() => handleToggleCarAvailability(c)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-all border shadow-sm ${
                              c.is_available
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                            }`}
                            title="Click để Đổi trạng thái Mở bán / Tạm ngưng"
                          >
                            <span className={`w-2 h-2 rounded-full ${c.is_available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                            <span>{c.is_available ? 'Mở bán' : 'Tạm ngưng'}</span>
                          </button>
                          <button
                            onClick={() => handleOpenEditCar(c)}
                            className="px-3.5 py-2 text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-xl transition-all border border-amber-200 flex items-center gap-1.5 shadow-sm"
                            title="Chỉnh sửa thông số & hình ảnh"
                          >
                            <Edit3 size={15} />
                            <span>Sửa xe</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCar(c.id, c.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                            title="Xóa mẫu xe"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: E-SCOOTERS MANAGEMENT */}
            {activeTab === 'escooters' && (
              <div className="space-y-5">
                {/* Header & Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Zap className="text-amber-500 fill-amber-500" size={18} />
                      <span>Catalog Xe Máy Điện VinFast ({escooters.length})</span>
                    </h3>
                    <p className="text-xs text-slate-500">Quản lý 15 mẫu xe máy điện thông minh, giá niêm yết & tóm tắt RAG</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCar(null);
                      setCarForm({
                        name: '', code: '', category: 'scooter', base_price: 25000000,
                        battery_buy_price: 35000000, battery_rent_monthly: 350000, is_available: true,
                        description: '', image_url: '', engine_type: 'Động cơ BLDC In-hub', power_hp: '1500 W',
                        torque_nm: '70 km/h', drivetrain: 'Pin LFP', battery_capacity_kwh: '3.5 kWh', range_km: '200 km',
                        fast_charge_time: '4 giờ', seats: 22, dimensions_mm: '1910 x 692 x 1083 mm', wheelbase_mm: '770 mm',
                        ground_clearance_mm: '100 kg', wheels_rims: '14 inch', infotainment_screen: 'Phanh đĩa / CBS',
                        speakers: 'Khóa Smartkey', seat_material: 'Eco / Sport', airbags: 0, has_adas: false,
                      });
                      setCarImageFile(null);
                      setShowCarModal(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shrink-0"
                  >
                    <Plus size={18} />
                    <span>+ Thêm Xe Máy Điện Mới</span>
                  </button>
                </div>

                {/* E-Scooters List */}
                <div className="space-y-3">
                  {escooters
                    .filter((s) => !searchQuery || s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || s.code?.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((s) => {
                      const specs = s.specs || {};
                      return (
                        <div key={s.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 grid grid-cols-12 gap-4 items-center hover:shadow-md transition-all">
                          {/* Left: Thumbnail & Info (Col 1-5) */}
                          <div className="col-span-12 lg:col-span-5 flex items-center gap-3.5 min-w-0">
                            <div className="w-28 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 relative border border-slate-100 shadow-inner">
                              <img src={getImageUrl(s.image_url)} alt={s.name} className="w-full h-full object-cover" />
                              <span className={`absolute top-1 left-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded text-white uppercase ${s.is_available ? 'bg-emerald-600' : 'bg-slate-600'}`}>
                                {s.is_available ? 'Mở bán' : 'Tạm ngưng'}
                              </span>
                            </div>
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-extrabold text-slate-900 truncate">{s.name}</h4>
                                <span className="text-[10px] font-mono bg-amber-50 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
                                  {s.code}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-1">{s.description || 'Chưa có mô tả'}</p>
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-xs font-black text-red-600 shrink-0">{formatVNDPrice(s.base_price)}</span>
                                {s.battery_rent_monthly > 0 && (
                                  <span className="text-[11px] text-slate-400 font-medium shrink-0">| Thuê pin: {(s.battery_rent_monthly / 1000).toLocaleString('vi-VN')}k/tháng</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Tech Specs (Col 6-9 - Fixed Alignment) */}
                          <div className="col-span-12 lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-4">
                            <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                              <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-100 text-center">
                                <span className="text-[9px] text-amber-700 font-bold block uppercase truncate">Vận tốc max</span>
                                <strong className="text-amber-950 text-xs font-black truncate block">{specs.top_speed || '70 km/h'}</strong>
                              </div>
                              <div className="bg-blue-50/70 p-2 rounded-xl border border-blue-100 text-center">
                                <span className="text-[9px] text-blue-700 font-bold block uppercase truncate">Tầm xa max</span>
                                <strong className="text-blue-950 text-xs font-black truncate block">{specs.range_km ? `${specs.range_km} km` : '198 km'}</strong>
                              </div>
                              <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100 text-center">
                                <span className="text-[9px] text-emerald-700 font-bold block uppercase truncate">Cốp xe</span>
                                <strong className="text-emerald-950 text-xs font-black truncate block">{specs.trunk_l ? `${specs.trunk_l} Lít` : '22 Lít'}</strong>
                              </div>
                            </div>
                          </div>

                          {/* Actions (Col 10-12) */}
                          <div className="col-span-12 lg:col-span-3 flex items-center justify-end gap-2 border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0 shrink-0">
                            <button
                              onClick={async () => {
                                const newStatus = !s.is_available;
                                const formData = new FormData();
                                formData.append('is_available', String(newStatus));
                                await api.updateEScooter(s.id, formData);
                                setEscooters((prev) => prev.map((item) => (item.id === s.id ? { ...item, is_available: newStatus } : item)));
                              }}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-all border shadow-sm ${
                                s.is_available ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}
                            >
                              <span>{s.is_available ? 'Mở bán' : 'Tạm ngưng'}</span>
                            </button>
                            <button
                              onClick={() => {
                                setEditingCar(s);
                                setCarForm({
                                  name: s.name || '', code: s.code || '', category: 'scooter', base_price: s.base_price || 0,
                                  battery_buy_price: s.battery_buy_price || 0, battery_rent_monthly: s.battery_rent_monthly || 0,
                                  is_available: s.is_available ?? true, description: s.description || '', image_url: s.image_url || '',
                                  engine_type: specs.engine_type || 'Động cơ BLDC In-hub',
                                  power_hp: specs.power_w || '1500 W',
                                  torque_nm: specs.top_speed || '78 km/h',
                                  drivetrain: specs.battery_type || 'Pin LFP an toàn',
                                  battery_capacity_kwh: specs.battery_type || 'Pin LFP 3.5 kWh',
                                  range_km: String(specs.range_km || '200'),
                                  fast_charge_time: '4.5 giờ',
                                  seats: specs.trunk_l || 22,
                                  dimensions_mm: '1910 x 692 x 1083 mm',
                                  wheelbase_mm: '770 mm',
                                  ground_clearance_mm: '100 kg',
                                  wheels_rims: '14 inch',
                                  infotainment_screen: specs.brakes || 'Phanh đĩa / CBS',
                                  speakers: specs.smartkey || 'Khóa Smartkey & eSIM GPS',
                                  seat_material: 'Eco / Sport',
                                  airbags: 67,
                                  has_adas: true,
                                });
                                setShowCarModal(true);
                              }}
                              className="px-3.5 py-2 text-xs bg-amber-50 text-amber-700 font-bold rounded-xl border border-amber-200 flex items-center gap-1.5 shadow-sm"
                            >
                              <Edit3 size={15} />
                              <span>Sửa xe</span>
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm(`Bạn muốn xóa xe máy điện ${s.name}?`)) {
                                  await api.deleteEScooter(s.id);
                                  fetchData();
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* TAB 3: QUOTES (Enhanced CRM & Filter & Export) */}
            {activeTab === 'quotes' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Quản lý Yêu cầu Báo giá Khách hàng ({quotes.length})</h3>
                    <p className="text-xs text-slate-500">Tiếp nhận yêu cầu báo giá lăn bánh, phê duyệt tư vấn viên (HITL workflow)</p>
                  </div>
                  <button
                    onClick={handleExportQuotesCSV}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-md shrink-0"
                  >
                    <Download size={16} />
                    <span>Xuất báo cáo Excel (.CSV)</span>
                  </button>
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                  {[
                    { id: 'all', label: 'Tất cả yêu cầu', count: quotes.length },
                    { id: 'pending', label: '🟡 Chờ xác nhận', count: quotes.filter((q) => !q.status || q.status.toLowerCase() === 'pending').length },
                    { id: 'contacted', label: '🔵 Đã liên hệ tư vấn', count: quotes.filter((q) => q.status?.toLowerCase() === 'contacted').length },
                    { id: 'approved', label: '🟢 Đã duyệt & Gửi giá', count: quotes.filter((q) => q.status?.toLowerCase() === 'approved' || q.status?.toLowerCase() === 'completed').length },
                    { id: 'cancelled', label: '🔴 Đã hủy', count: quotes.filter((q) => q.status?.toLowerCase() === 'cancelled').length },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setQuoteStatusFilter(tab.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                        quoteStatusFilter === tab.id
                          ? 'bg-blue-900 text-white shadow-md'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        quoteStatusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Quotes Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Khách hàng</th>
                        <th className="p-3.5">Số điện thoại</th>
                        <th className="p-3.5">Mẫu xe quan tâm</th>
                        <th className="p-3.5">Giá niêm yết</th>
                        <th className="p-3.5">Trạng thái xử lý</th>
                        <th className="p-3.5 text-right">Cập nhật nhanh</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredQuotes.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">
                            Không tìm thấy yêu cầu báo giá phù hợp.
                          </td>
                        </tr>
                      ) : (
                        filteredQuotes.map((q) => (
                          <tr key={q.id} className="hover:bg-slate-50 transition-all">
                            <td className="p-3.5 font-bold text-slate-900">{q.customer_name}</td>
                            <td className="p-3.5 text-slate-600 font-mono">{q.customer_phone}</td>
                            <td className="p-3.5 font-extrabold text-blue-900">{q.vehicle_name}</td>
                            <td className="p-3.5 text-red-600 font-black">{formatVNDPrice(q.base_price)}</td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                q.status === 'approved' || q.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : q.status === 'contacted'
                                  ? 'bg-blue-100 text-blue-800'
                                  : q.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800 animate-pulse'
                              }`}>
                                {q.status === 'approved' || q.status === 'completed'
                                  ? '🟢 Đã duyệt'
                                  : q.status === 'contacted'
                                  ? '🔵 Đã liên hệ'
                                  : q.status === 'cancelled'
                                  ? '🔴 Đã hủy'
                                  : '🟡 Chờ xác nhận'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <select
                                value={q.status || 'pending'}
                                onChange={(e) => handleUpdateQuote(q.id, e.target.value)}
                                className="text-xs p-1.5 border rounded-xl bg-white font-bold text-slate-800 focus:border-blue-600 focus:outline-none"
                              >
                                <option value="pending">🟡 Chờ xác nhận</option>
                                <option value="contacted">🔵 Đã liên hệ tư vấn</option>
                                <option value="approved">🟢 Đã duyệt báo giá</option>
                                <option value="cancelled">🔴 Hủy yêu cầu</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: BOOKINGS (Enhanced CRM & Filter & Export) */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Quản lý Lịch Đặt Lái Thử Trực Tuyến ({bookings.length})</h3>
                    <p className="text-xs text-slate-500">Điều phối lịch hẹn trải nghiệm thực tế xe tại đại lý VinFast toàn quốc</p>
                  </div>
                  <button
                    onClick={handleExportBookingsCSV}
                    className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-md shrink-0"
                  >
                    <Download size={16} />
                    <span>Xuất báo cáo Excel (.CSV)</span>
                  </button>
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                  {[
                    { id: 'all', label: 'Tất cả lịch hẹn', count: bookings.length },
                    { id: 'pending', label: '🟡 Chờ xác nhận', count: bookings.filter((b) => !b.status || b.status.toLowerCase() === 'pending').length },
                    { id: 'confirmed', label: '🔵 Đã xác nhận hẹn', count: bookings.filter((b) => b.status?.toLowerCase() === 'confirmed').length },
                    { id: 'completed', label: '🟢 Đã hoàn tất lái thử', count: bookings.filter((b) => b.status?.toLowerCase() === 'completed').length },
                    { id: 'cancelled', label: '🔴 Đã hủy hẹn', count: bookings.filter((b) => b.status?.toLowerCase() === 'cancelled').length },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setBookingStatusFilter(tab.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                        bookingStatusFilter === tab.id
                          ? 'bg-blue-900 text-white shadow-md'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        bookingStatusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Khách hàng</th>
                        <th className="p-3.5">Số điện thoại</th>
                        <th className="p-3.5">Xe đăng ký</th>
                        <th className="p-3.5">Ngày & Khung giờ hẹn</th>
                        <th className="p-3.5">Trạng thái</th>
                        <th className="p-3.5 text-right">Cập nhật nhanh</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">
                            Không tìm thấy lịch đặt lái thử phù hợp.
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50 transition-all">
                            <td className="p-3.5 font-bold text-slate-900">{b.customer_name}</td>
                            <td className="p-3.5 text-slate-600 font-mono">{b.customer_phone}</td>
                            <td className="p-3.5 font-extrabold text-blue-900">{b.vehicle_name}</td>
                            <td className="p-3.5 text-slate-700 font-medium">{b.preferred_date} ({b.preferred_time})</td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                b.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : b.status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : b.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800 animate-pulse'
                              }`}>
                                {b.status === 'completed'
                                  ? '🟢 Đã lái thử'
                                  : b.status === 'confirmed'
                                  ? '🔵 Đã xác nhận'
                                  : b.status === 'cancelled'
                                  ? '🔴 Đã hủy'
                                  : '🟡 Chờ xác nhận'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <select
                                value={b.status || 'pending'}
                                onChange={(e) => handleUpdateBooking(b.id, e.target.value)}
                                className="text-xs p-1.5 border rounded-xl bg-white font-bold text-slate-800 focus:border-blue-600 focus:outline-none"
                              >
                                <option value="pending">🟡 Chờ xác nhận</option>
                                <option value="confirmed">🔵 Đã xác nhận hẹn</option>
                                <option value="completed">🟢 Hoàn tất lái thử</option>
                                <option value="cancelled">🔴 Hủy lịch hẹn</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Dedicated Full-Screen Edit / Create Vehicle Modal Page */}
      {showCarModal && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto font-sans">
          <form onSubmit={handleSaveCarSubmit} className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
            
            {/* Full-screen Edit Header */}
            <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-4 sm:px-6 sm:py-4 flex items-center justify-between shrink-0 border-b border-emerald-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowCarModal(false)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold transition-all border border-white/15 shadow-sm"
                >
                  <ArrowRight size={16} className="rotate-180" />
                  <span>Quay lại Catalog</span>
                </button>
                <div className="h-5 w-px bg-white/20 hidden sm:block" />
                <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
                  <Car className="text-emerald-400" size={18} />
                  {editingCar ? `Trang Chỉnh Sửa Thông Số: ${editingCar.name}` : 'Thêm Mẫu Xe VinFast Mới vào PostgreSQL'}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>{loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCarModal(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* SECTION 1: THÔNG TIN CƠ BẢN VÀ GIÁ */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg">
                  1. Thông tin cơ bản & Bảng giá
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Tên xe</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: VinFast VF 8 Plus"
                      value={carForm.name || ''}
                      onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                      className="w-full text-xs p-2.5 border rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Mã xe (code)</label>
                    <input
                      type="text"
                      required
                      disabled={!!editingCar}
                      placeholder="VD: vf8-plus"
                      value={carForm.code || ''}
                      onChange={(e) => setCarForm({ ...carForm, code: e.target.value })}
                      className="w-full text-xs p-2.5 border rounded-xl bg-slate-50 disabled:opacity-60 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Phân loại mẫu xe</label>
                    <select
                      value={carForm.category || 'suv'}
                      onChange={(e) => setCarForm({ ...carForm, category: e.target.value })}
                      className="w-full text-xs p-2.5 border rounded-xl bg-white font-semibold"
                    >
                      <option value="suv">Ô tô điện (SUV / Sedan)</option>
                      <option value="scooter">Xe máy điện (E-Scooter)</option>
                      <option value="commercial">Xe thương mại &amp; Dịch vụ (Bus / Taxi / Bán tải)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Trạng thái kinh doanh</label>
                    <select
                      value={carForm.is_available ? 'true' : 'false'}
                      onChange={(e) => setCarForm({ ...carForm, is_available: e.target.value === 'true' })}
                      className="w-full text-xs p-2.5 border rounded-xl bg-white font-semibold"
                    >
                      <option value="true">Đang mở bán (Active)</option>
                      <option value="false">Ngừng mở bán (Inactive)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Giá xe không pin (VNĐ)</label>
                    <input
                      type="number"
                      required
                      value={carForm.base_price || 0}
                      onChange={(e) => setCarForm({ ...carForm, base_price: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 border rounded-xl font-bold text-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Giá mua đứt Pin (VNĐ)</label>
                    <input
                      type="number"
                      value={carForm.battery_buy_price || 0}
                      onChange={(e) => setCarForm({ ...carForm, battery_buy_price: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 border rounded-xl font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Phí thuê Pin/tháng (VNĐ)</label>
                    <input
                      type="number"
                      value={carForm.battery_rent_monthly || 0}
                      onChange={(e) => setCarForm({ ...carForm, battery_rent_monthly: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 border rounded-xl font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: HÌNH ẢNH MẪU XE */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg flex items-center justify-between">
                  <span>2. Hình ảnh sản phẩm mẫu xe</span>
                  <span className="text-[10px] text-slate-500 font-normal">Hỗ trợ URL hoặc Tải tệp từ máy tính</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="sm:col-span-2 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Đường dẫn URL ảnh trực tuyến</label>
                      <input
                        type="text"
                        placeholder="https://vinfastauto.com/html/vf8/images/vf8-red.png"
                        value={carForm.image_url || ''}
                        onChange={(e) => setCarForm({ ...carForm, image_url: e.target.value })}
                        className="w-full text-xs p-2.5 border rounded-xl focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Hoặc Chọn ảnh từ máy tính (Upload)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setCarImageFile(e.target.files[0]);
                          }
                        }}
                        className="w-full text-xs p-2 border rounded-xl bg-slate-50 text-slate-600"
                      />
                    </div>
                  </div>
                  <div className="w-full h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-2 flex items-center justify-center relative overflow-hidden">
                    {carImageFile && carImageFile instanceof Blob ? (
                      <img src={URL.createObjectURL(carImageFile)} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                    ) : carForm.image_url ? (
                      <img
                        src={getImageUrl(carForm.image_url)}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=60';
                        }}
                      />
                    ) : (
                      <div className="text-center text-slate-400 text-xs">
                        <Upload size={24} className="mx-auto mb-1 opacity-50" />
                        <span>Xem trước hình ảnh</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 3: BẢNG THÔNG SỐ KỸ THUẬT CHI TIẾT */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg">
                  3. Bảng thông số kỹ thuật chi tiết (Technical Specs)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Động cơ & Vận hành */}
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
                    <span className="block text-[11px] font-black text-blue-900 uppercase">⚡ Động cơ & Vận hành</span>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600">Loại động cơ</label>
                      <input
                        type="text"
                        value={carForm.engine_type || ''}
                        onChange={(e) => setCarForm({ ...carForm, engine_type: e.target.value })}
                        className="w-full text-xs p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600">
                        {carForm.category === 'scooter' ? 'Công suất động cơ (Watt)' : 'Công suất (hp / kW)'}
                      </label>
                      <input
                        type="text"
                        value={carForm.power_hp || ''}
                        onChange={(e) => setCarForm({ ...carForm, power_hp: e.target.value })}
                        className="w-full text-xs p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600">
                        {carForm.category === 'scooter' ? 'Vận tốc tối đa (km/h)' : 'Mô-men xoắn (Nm)'}
                      </label>
                      <input
                        type="text"
                        value={carForm.torque_nm || ''}
                        onChange={(e) => setCarForm({ ...carForm, torque_nm: e.target.value })}
                        className="w-full text-xs p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600">
                        {carForm.category === 'scooter' ? 'Loại Pin / Truyền động' : 'Hệ dẫn động'}
                      </label>
                      <input
                        type="text"
                        value={carForm.drivetrain || ''}
                        onChange={(e) => setCarForm({ ...carForm, drivetrain: e.target.value })}
                        className="w-full text-xs p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600">Dung lượng / Loại Pin</label>
                      <input
                        type="text"
                        value={carForm.battery_capacity_kwh || ''}
                        onChange={(e) => setCarForm({ ...carForm, battery_capacity_kwh: e.target.value })}
                        className="w-full text-xs p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600">Quãng đường di chuyển (km/sạc)</label>
                      <input
                        type="text"
                        value={carForm.range_km || ''}
                        onChange={(e) => setCarForm({ ...carForm, range_km: e.target.value })}
                        className="w-full text-xs p-2 border rounded-lg bg-white font-bold text-blue-700"
                      />
                    </div>
                  </div>

                  {/* Kích thước & Trọng lượng */}
                  <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 space-y-2">
                    <span className="block text-[11px] font-black text-purple-900 uppercase">📏 Kích thước & Ghế/Cốp</span>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600">
                        {carForm.category === 'scooter' ? 'Thể tích cốp xe (Lít)' : 'Số chỗ ngồi'}
                      </label>
                      <input
                        type="number"
                        value={carForm.seats || 0}
                        onChange={(e) => setCarForm({ ...carForm, seats: Number(e.target.value) })}
                        className="w-full text-xs p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600">Kích thước DxRxC (mm)</label>
                      <input
                        type="text"
                        value={carForm.dimensions_mm || ''}
                        onChange={(e) => setCarForm({ ...carForm, dimensions_mm: e.target.value })}
                        className="w-full text-xs p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600">
                        {carForm.category === 'scooter' ? 'Chiều cao yên (mm)' : 'Chiều dài cơ sở (mm)'}
                      </label>
                      <input
                        type="text"
                        value={carForm.wheelbase_mm || ''}
                        onChange={(e) => setCarForm({ ...carForm, wheelbase_mm: e.target.value })}
                        className="w-full text-xs p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600">
                        {carForm.category === 'scooter' ? 'Trọng lượng xe (kg)' : 'Khoảng sáng gầm (mm)'}
                      </label>
                      <input
                        type="text"
                        value={carForm.ground_clearance_mm || ''}
                        onChange={(e) => setCarForm({ ...carForm, ground_clearance_mm: e.target.value })}
                        className="w-full text-xs p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600">Kích thước La-zăng / Lốp</label>
                      <input
                        type="text"
                        value={carForm.wheels_rims || ''}
                        onChange={(e) => setCarForm({ ...carForm, wheels_rims: e.target.value })}
                        className="w-full text-xs p-2 border rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  {/* Column 3: Nội thất & Phanh (For Cars) OR Phanh & Giảm xóc (For Scooters) */}
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                    <span className="block text-[11px] font-black text-emerald-900 uppercase">
                      {carForm.category === 'scooter' ? '🛵 Phanh & Giảm Xóc' : '🛋️ Nội thất & Phanh'}
                    </span>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600">
                        {carForm.category === 'scooter' ? 'Hệ thống phanh (ABS/CBS)' : 'Màn hình trung tâm'}
                      </label>
                      <input
                        type="text"
                        value={carForm.infotainment_screen || ''}
                        onChange={(e) => setCarForm({ ...carForm, infotainment_screen: e.target.value })}
                        className="w-full text-xs p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600">
                        {carForm.category === 'scooter' ? 'Khóa thông minh & GPS' : 'Hệ thống âm thanh'}
                      </label>
                      <input
                        type="text"
                        value={carForm.speakers || ''}
                        onChange={(e) => setCarForm({ ...carForm, speakers: e.target.value })}
                        className="w-full text-xs p-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600">
                        {carForm.category === 'scooter' ? 'Chế độ lái (Eco/Sport)' : 'Chất liệu ghế'}
                      </label>
                      <input
                        type="text"
                        value={carForm.seat_material || ''}
                        onChange={(e) => setCarForm({ ...carForm, seat_material: e.target.value })}
                        className="w-full text-xs p-2 border rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  {/* Column 4: An toàn & ADAS (For Cars) OR Công nghệ & Kháng nước (For Scooters) */}
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                    <span className="block text-[11px] font-black text-amber-900 uppercase">
                      {carForm.category === 'scooter' ? '📱 Kết Nối & Kháng Nước' : '🛡️ An toàn & ADAS'}
                    </span>
                    {carForm.category === 'scooter' ? (
                      <>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600">Chuẩn chống nước (IP67)</label>
                          <input
                            type="text"
                            placeholder="VD: IP67 (Chịu ngập 0.5m trong 30 phút)"
                            value={carForm.airbags ? `IP${carForm.airbags}` : 'IP67 chống ngập'}
                            onChange={(e) => setCarForm({ ...carForm, airbags: Number(e.target.value.replace(/\D/g, '')) || 67 })}
                            className="w-full text-xs p-2 border rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600">Kết nối App Mobile VinFast</label>
                          <select
                            value={carForm.has_adas ? 'true' : 'false'}
                            onChange={(e) => setCarForm({ ...carForm, has_adas: e.target.value === 'true' })}
                            className="w-full text-xs p-2 border rounded-lg bg-white font-semibold"
                          >
                            <option value="true">Có hỗ trợ (GPS & App VinFast)</option>
                            <option value="false">Không hỗ trợ</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600">Số túi khí an toàn</label>
                          <input
                            type="number"
                            value={carForm.airbags || 0}
                            onChange={(e) => setCarForm({ ...carForm, airbags: Number(e.target.value) })}
                            className="w-full text-xs p-2 border rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600">Trợ lái ADAS / AI ViVi</label>
                          <select
                            value={carForm.has_adas ? 'true' : 'false'}
                            onChange={(e) => setCarForm({ ...carForm, has_adas: e.target.value === 'true' })}
                            className="w-full text-xs p-2 border rounded-lg bg-white font-semibold"
                          >
                            <option value="true">Có hỗ trợ</option>
                            <option value="false">Không hỗ trợ</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 4: MÔ TẢ TỔNG QUAN */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Mô tả tổng quan mẫu xe</label>
                <textarea
                  rows={3}
                  value={carForm.description || ''}
                  onChange={(e) => setCarForm({ ...carForm, description: e.target.value })}
                  className="w-full text-xs p-2.5 border rounded-xl focus:border-emerald-600 focus:outline-none"
                  placeholder="Nhập giới thiệu chi tiết về mẫu xe..."
                />
              </div>

            </div>

            {/* Sticky Footer Action Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setShowCarModal(false)} className="px-5 py-2.5 text-xs font-bold border rounded-xl hover:bg-slate-100">
                Hủy bỏ
              </button>
              <button type="submit" disabled={loading} className="px-6 py-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md">
                {loading ? 'Đang lưu vào PostgreSQL...' : 'Lưu Thay Đổi Mẫu Xe'}
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}
