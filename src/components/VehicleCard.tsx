import { useState } from 'react';
import { Zap, Users, Timer, CheckSquare, Square, ArrowRight, Star, Sparkles } from 'lucide-react';
import type { Vehicle } from '@/types';

interface VehicleCardProps {
  vehicle: Vehicle;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
  onViewDetail: (id: string) => void;
  onRequestQuote: (vehicle: Vehicle) => void;
}

function formatPrice(price: number) {
  if (price >= 1000) {
    return `${(price / 1000).toFixed(3).replace('.', ',')} tỷ`;
  }
  return `${price.toLocaleString('vi-VN')} triệu`;
}

export default function VehicleCard({
  vehicle,
  isCompared,
  onToggleCompare,
  onViewDetail,
  onRequestQuote,
}: VehicleCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${
        isCompared
          ? 'border-blue-400 ring-2 ring-blue-100 shadow-lg shadow-blue-50'
          : 'border-gray-100 shadow-md hover:border-blue-200'
      }`}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {vehicle.isNew && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-sm">
            <Sparkles size={10} />
            MỚI
          </span>
        )}
        {vehicle.isBestSeller && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-sm">
            <Star size={10} className="fill-white" />
            BÁN CHẠY
          </span>
        )}
      </div>

      {/* Compare checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleCompare(vehicle.id); }}
        className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 hover:border-blue-400 transition-all shadow-sm group/cmp"
        title="So sánh"
      >
        {isCompared ? (
          <CheckSquare size={14} className="text-blue-600" />
        ) : (
          <Square size={14} className="text-gray-400 group-hover/cmp:text-blue-500" />
        )}
        <span className="text-xs font-medium text-gray-600 group-hover/cmp:text-blue-600">So sánh</span>
      </button>

      {/* Image */}
      <div
        className="relative overflow-hidden bg-gray-50"
        style={{ height: '220px' }}
        onClick={() => onViewDetail(vehicle.id)}
      >
        {!imgError ? (
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <Zap size={48} className="text-blue-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category tag */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            {vehicle.category === 'scooter' ? 'Xe máy điện' : 'SUV điện'}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5">
        {/* Name + tagline */}
        <div className="mb-3">
          <h3
            className="text-xl font-bold text-gray-900 hover:text-blue-700 cursor-pointer transition-colors"
            onClick={() => onViewDetail(vehicle.id)}
          >
            {vehicle.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{vehicle.tagline}</p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-4">
          <span className="text-xs text-gray-400 font-medium">Từ</span>
          <span className="text-2xl font-bold text-blue-700">{formatPrice(vehicle.basePrice)}</span>
          <span className="text-xs text-gray-400">VND</span>
        </div>

        {/* Key specs */}
        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap size={12} className="text-blue-500" />
            </div>
            <div className="text-sm font-bold text-gray-800">{vehicle.range}km</div>
            <div className="text-xs text-gray-400">Phạm vi</div>
          </div>
          <div className="text-center border-x border-gray-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Timer size={12} className="text-emerald-500" />
            </div>
            <div className="text-sm font-bold text-gray-800">{vehicle.acceleration}</div>
            <div className="text-xs text-gray-400">0–100</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users size={12} className="text-violet-500" />
            </div>
            <div className="text-sm font-bold text-gray-800">{vehicle.seats}</div>
            <div className="text-xs text-gray-400">Chỗ ngồi</div>
          </div>
        </div>

        {/* Color swatches */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-400">Màu:</span>
          <div className="flex gap-1.5">
            {vehicle.colors.map((color) => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onRequestQuote(vehicle)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-md hover:shadow-blue-200"
          >
            Báo giá
            <ArrowRight size={14} />
          </button>
          <button
            onClick={() => onViewDetail(vehicle.id)}
            className="flex-1 py-2.5 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700 text-sm font-medium rounded-xl transition-all hover:bg-blue-50"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
