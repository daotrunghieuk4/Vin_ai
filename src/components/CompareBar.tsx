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
        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-gray-700 shrink-0">
            So sánh ({compareList.length}/3):
          </div>

          <div className="flex items-center gap-3 flex-1 overflow-x-auto scrollbar-none">
            {selected.map((vehicle) => vehicle && (
              <div
                key={vehicle.id}
                className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl shrink-0 group"
              >
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-10 h-7 object-cover rounded-lg"
                />
                <span className="text-sm font-medium text-gray-800">{vehicle.name}</span>
                <button
                  onClick={() => onRemove(vehicle.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                >
                  <X size={13} />
                </button>
              </div>
            ))}

            {compareList.length < 3 && (
              <div className="flex items-center justify-center w-24 h-11 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs shrink-0">
                + Thêm xe
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClear}
              className="px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Xóa tất cả
            </button>
            <button className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-blue-200">
              So sánh ngay
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
