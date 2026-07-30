import { X, ArrowRight } from 'lucide-react';
import { vehicles } from '@/data/vehicles';

interface CompareBarProps {
  compareList: string[];
  onClear: () => void;
  onRemove: (id: string) => void;
}

export default function CompareBar({ compareList, onClear, onRemove }: CompareBarProps) {
  if (compareList.length < 2) return null;

  const selected = compareList.map((id) => vehicles.find((v) => v.id === id)).filter(Boolean);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            <div className="text-xs sm:text-sm font-bold text-gray-800 shrink-0">
              So sánh ({compareList.length}/3):
            </div>
            {selected.map((vehicle) => vehicle && (
              <div
                key={vehicle.id}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl shrink-0 group text-xs sm:text-sm"
              >
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-8 h-6 sm:w-10 sm:h-7 object-cover rounded-lg"
                />
                <span className="font-bold text-gray-800">{vehicle.name}</span>
                <button
                  onClick={() => onRemove(vehicle.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors ml-1 p-0.5"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
            <button
              onClick={onClear}
              className="px-3 py-1.5 text-xs sm:text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Xóa tất cả
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md">
              So sánh ngay
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
