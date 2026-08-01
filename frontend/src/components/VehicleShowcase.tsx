import { useState, useEffect } from 'react';
import { LayoutGrid, ChevronRight, Zap, Car, Bike, Truck } from 'lucide-react';
import { vehicles as staticVehicles } from '@/data/vehicles';
import VehicleCard from '@/components/VehicleCard';
import { api, getImageUrl } from '@/lib/api';
import type { Vehicle, FilterCategory } from '@/types';

interface VehicleShowcaseProps {
  compareList: string[];
  onToggleCompare: (id: string) => void;
  onRequestQuote: (vehicle: Vehicle) => void;
  onViewDetail?: (vehicle: Vehicle) => void;
  activeCategory?: FilterCategory;
  onCategoryChange?: (category: FilterCategory) => void;
}

const filterTabs: { id: FilterCategory; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'suv', label: 'Ô tô điện' },
  { id: 'scooter', label: 'Xe máy điện' },
  { id: 'commercial', label: 'Xe dịch vụ & Thương mại' },
];

export default function VehicleShowcase({
  compareList,
  onToggleCompare,
  onRequestQuote,
  onViewDetail,
  activeCategory: externalCategory = 'all',
  onCategoryChange,
}: VehicleShowcaseProps) {
  const [internalFilter, setInternalFilter] = useState<FilterCategory>(externalCategory);
  const [vehicleList, setVehicleList] = useState<Vehicle[]>(staticVehicles);

  useEffect(() => {
    setInternalFilter(externalCategory);
  }, [externalCategory]);

  useEffect(() => {
    // Tải danh sách cả Ô tô và Xe máy điện từ Backend FastAPI
    Promise.all([
      api.getCars<any[]>().catch(() => []),
      api.getEScooters<any[]>().catch(() => []),
    ]).then(([dbCars, dbScooters]) => {
      const carList: Vehicle[] = (dbCars || []).map((c) => {
        const catLower = (c.category || '').toLowerCase();
        const parsedCategory: VehicleCategory = catLower.includes('commercial') || catLower.includes('dịch vụ') || catLower.includes('thương mại') || catLower.includes('bus')
          ? 'commercial'
          : 'suv';

        return {
          id: c.id,
          code: c.code,
          name: c.name,
          tagline: c.description || 'Mẫu ô tô điện thông minh VinFast',
          category: parsedCategory,
          image: getImageUrl(c.image_url),
          basePrice: c.base_price,
          batteryBuyPrice: c.battery_buy_price,
          batteryRentMonthly: c.battery_rent_monthly,
          range: c.specs?.engine_drivetrain?.items?.range_km || c.specs?.driving_range || 400,
          battery: `${c.specs?.engine_drivetrain?.items?.battery_capacity_kwh || c.specs?.battery_capacity || 87} kWh`,
          acceleration: '5.5s (0-100 km/h)',
          topSpeed: c.specs?.engine_drivetrain?.items?.top_speed_kmh || 200,
          seats: c.specs?.dimensions_weight?.items?.seats || c.specs?.seating_capacity || 5,
          isNew: true,
          colors: ['#0F172A', '#DC2626', '#FFFFFF', '#2563EB'],
          description: c.description || '',
          highlights: ['Công nghệ VinFast tiên phong', 'Trợ lý ảo Tiếng Việt ViVi', 'Sạc siêu nhanh', 'Bảo hành chính hãng 10 năm'],
          rawSpecs: c.specs,
        };
      });

      const scooterList: Vehicle[] = (dbScooters || []).map((s) => ({
        id: s.id,
        code: s.code,
        name: s.name,
        tagline: s.description || 'Mẫu xe máy điện thông minh VinFast',
        category: 'scooter',
        image: getImageUrl(s.image_url),
        basePrice: s.base_price,
        batteryBuyPrice: s.battery_buy_price,
        batteryRentMonthly: s.battery_rent_monthly,
        range: s.specs?.range_km || 198,
        battery: 'Pin LFP chống cháy',
        acceleration: 'Vận tốc max: ' + (s.specs?.top_speed || '78 km/h'),
        topSpeed: 80,
        seats: 2,
        isNew: true,
        colors: ['#0F172A', '#DC2626', '#FFFFFF', '#2563EB'],
        description: s.description || '',
        highlights: ['Khung sườn chịu lực', 'Kháng nước IP67', 'Pin LFP tuổi thọ cao', 'Định vị GPS & Khóa Smartkey'],
        rawSpecs: s.specs,
      }));

      if (carList.length > 0 || scooterList.length > 0) {
        setVehicleList([...carList, ...scooterList]);
      }
    });
  }, []);

  const activeFilter = internalFilter;

  const handleFilterClick = (cat: FilterCategory) => {
    setInternalFilter(cat);
    onCategoryChange?.(cat);
  };

  const getModelFamilyKey = (name: string) => {
    const match = name.match(/VF\s*\d+/i);
    return match ? match[0].toUpperCase().replace(/\s+/g, '') : name;
  };

  const groupedVehicles = (() => {
    const map = new Map<string, Vehicle>();
    vehicleList.forEach((v) => {
      const family = getModelFamilyKey(v.name);
      if (!map.has(family)) {
        const cleanName = v.name.replace(/\s+(Eco|Plus)$/i, '');
        map.set(family, {
          ...v,
          name: cleanName,
        });
      } else {
        const existing = map.get(family)!;
        if (v.basePrice < existing.basePrice) {
          const cleanName = v.name.replace(/\s+(Eco|Plus)$/i, '');
          map.set(family, { ...v, name: cleanName });
        }
      }
    });
    return Array.from(map.values());
  })();

  const filtered = groupedVehicles.filter((v) => {
    if (activeFilter === 'all') return true;
    return v.category === activeFilter;
  });


  return (
    <section id="showcase" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-5 rounded-full bg-blue-600" />
              <span className="text-xs font-bold text-blue-600 tracking-widest uppercase">Dòng xe VinFast</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Khám phá thế giới điện
            </h2>
            <p className="text-gray-500 mt-1.5 text-base">
              {filtered.length} mẫu xe điện từ nhỏ gọn đến hạng sang, phù hợp mọi nhu cầu
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-800 cursor-pointer group">
            <span>Xem thêm</span>
            <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-8 p-1 bg-white rounded-xl border border-gray-100 shadow-sm w-fit">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFilterClick(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeFilter === tab.id
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              {tab.id === 'all' && <LayoutGrid size={14} />}
              {tab.id === 'suv' && <Zap size={14} />}
              {tab.id === 'scooter' && <Bike size={14} />}
              {tab.id === 'commercial' && <Truck size={14} />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isCompared={compareList.includes(vehicle.id)}
              onToggleCompare={onToggleCompare}
              onViewDetail={() => onViewDetail?.(vehicle)}
              onRequestQuote={onRequestQuote}
            />
          ))}
        </div>

        {/* Bottom CTA band */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-blue-900 to-blue-700 p-8 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-white"
                style={{
                  width: `${(i + 1) * 80}px`,
                  height: `${(i + 1) * 80}px`,
                  right: '-40px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
            ))}
          </div>
          <div className="relative text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Chưa biết chọn xe nào?</h3>
            <p className="text-blue-200 text-sm">Trợ lý AI của chúng tôi sẽ tư vấn xe phù hợp với nhu cầu và ngân sách của bạn</p>
          </div>
          <div className="relative flex gap-3 flex-shrink-0">
            <button className="px-6 py-3 bg-white text-blue-800 text-sm font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
              Tư vấn AI ngay
            </button>
            <button className="px-6 py-3 bg-blue-600/40 hover:bg-blue-600/60 text-white text-sm font-semibold rounded-xl border border-white/20 transition-colors">
              Lái thử miễn phí
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
