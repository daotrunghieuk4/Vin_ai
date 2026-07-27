import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Zap, ChevronDown, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { vehicles } from '@/data/vehicles';
import type { ChatMessage, ChatStage, Vehicle } from '@/types';

const SESSION_ID = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;

const QUICK_ACTIONS = [
  { label: 'Tìm theo ngân sách', key: 'budget' },
  { label: 'Xe 7 chỗ', key: 'family' },
  { label: 'Ưu đãi tháng này', key: 'promo' },
  { label: 'Đặt lịch lái thử', key: 'testdrive' },
];

function formatPrice(p: number) {
  return p >= 1000
    ? `${(p / 1000).toFixed(3).replace('.', ',')} tỷ`
    : `${p.toLocaleString('vi-VN')} triệu`;
}

function getBotResponse(
  input: string,
  stage: ChatStage,
  pendingQuote: Partial<{ vehicle: Vehicle; name: string; phone: string }>,
): { text: string; nextStage: ChatStage } {
  const lower = input.toLowerCase();

  if (stage === 'greeting' || lower.includes('xin chào') || lower.includes('hello') || lower.includes('hi')) {
    return {
      text: `Xin chào! Tôi là **VinFast AI Advisor** 🚗⚡\n\nTôi có thể giúp bạn:\n• Tư vấn xe phù hợp với nhu cầu & ngân sách\n• So sánh các dòng xe VinFast\n• Tính toán chi phí sở hữu\n• Đặt lịch lái thử miễn phí\n\nBạn đang tìm kiếm loại xe nào?`,
      nextStage: 'free',
    };
  }

  if (stage === 'collecting_name') {
    return {
      text: `Cảm ơn **${input.trim()}**! Tiếp theo, bạn vui lòng cho tôi biết số điện thoại để tư vấn viên liên hệ xác nhận báo giá?`,
      nextStage: 'collecting_phone',
    };
  }

  if (stage === 'collecting_phone') {
    return {
      text: `✅ Đã nhận thông tin! Báo giá sẽ được gửi đến số **${input.trim()}** trong vòng 30 phút.\n\nBạn có muốn tôi tư vấn thêm không?`,
      nextStage: 'free',
    };
  }

  if (lower.includes('báo giá') || lower.includes('bao gia') || lower.includes('quote') || stage === 'asking_quote') {
    if (pendingQuote.vehicle) {
      return {
        text: `Tuyệt vời! Để tạo báo giá cho **${pendingQuote.vehicle.name}** (từ ${formatPrice(pendingQuote.vehicle.basePrice)}), bạn cho tôi biết tên của bạn?`,
        nextStage: 'collecting_name',
      };
    }
    return {
      text: `Bạn muốn báo giá cho dòng xe nào? Tôi có thể tư vấn:\n${vehicles.slice(0, 4).map((v) => `• **${v.name}** — từ ${formatPrice(v.basePrice)}`).join('\n')}`,
      nextStage: 'free',
    };
  }

  if (lower.includes('7 chỗ') || lower.includes('gia đình lớn') || lower.includes('vf9') || lower.includes('family')) {
    const vf9 = vehicles.find((v) => v.id === 'vf9')!;
    return {
      text: `🏆 **VF 9** là lựa chọn hoàn hảo cho gia đình!\n\n• **7 chỗ ngồi** rộng rãi\n• Phạm vi **${vf9.range}km** một lần sạc\n• Pin ${vf9.battery} — sạc nhanh DC\n• Hệ thống lái tự hành Level 2+\n• **Từ ${formatPrice(vf9.basePrice)}**\n\nBạn có muốn tôi tạo báo giá không?`,
      nextStage: 'asking_quote',
    };
  }

  if (lower.includes('rẻ') || lower.includes('tiết kiệm') || lower.includes('vf3') || lower.includes('dưới 300') || lower.includes('ngân sách thấp')) {
    const vf3 = vehicles.find((v) => v.id === 'vf3')!;
    return {
      text: `💡 **VF 3** — xe điện mini lý tưởng cho đô thị!\n\n• Giá chỉ **${formatPrice(vf3.basePrice)}**\n• Phạm vi **${vf3.range}km** — đủ cho di chuyển hàng ngày\n• Kích thước nhỏ gọn, dễ đỗ xe\n• Cảm ứng 8 inch thông minh\n\n💰 Hỗ trợ lãi suất 0% trong 24 tháng!\n\nBạn có muốn xem báo giá không?`,
      nextStage: 'asking_quote',
    };
  }

  if (lower.includes('lái thử') || lower.includes('test drive') || lower.includes('testdrive')) {
    return {
      text: `🚘 **Đặt lịch lái thử miễn phí!**\n\nChúng tôi có showroom tại:\n• **Hà Nội** — 458 Minh Khai, Hai Bà Trưng\n• **TP.HCM** — 10 Đường Số 1, Bình Thạnh\n• **Đà Nẵng** — 269 Điện Biên Phủ\n\nBạn muốn lái thử dòng xe nào và ở đâu?`,
      nextStage: 'free',
    };
  }

  if (lower.includes('ưu đãi') || lower.includes('khuyến mãi') || lower.includes('giảm giá') || lower.includes('promo')) {
    return {
      text: `🎁 **Ưu đãi tháng ${new Date().getMonth() + 1}:**\n\n• **VF 3**: Giảm 15 triệu + tặng gói bảo hiểm 1 năm\n• **VF 6**: Hỗ trợ lãi suất 0% — 36 tháng\n• **VF 8**: Tặng sạc home charging 11kW (trị giá 8 triệu)\n• **VF 9**: Giảm 50 triệu cho khách đặt cọc trong tháng\n\n⏰ Ưu đãi có hạn — áp dụng đến 31/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
      nextStage: 'free',
    };
  }

  if (lower.includes('vf8') || lower.includes('sang') || lower.includes('luxury') || lower.includes('cao cấp')) {
    const vf8 = vehicles.find((v) => v.id === 'vf8')!;
    return {
      text: `⭐ **VF 8** — SUV điện hạng sang bán chạy nhất!\n\n• **0–100 km/h:** ${vf8.acceleration}\n• **Tốc độ tối đa:** ${vf8.topSpeed} km/h\n• **Phạm vi:** ${vf8.range}km\n• Âm thanh Harman Kardon 11 loa\n• Dẫn động AWD, sạc nhanh DC 150kW\n• **Từ ${formatPrice(vf8.basePrice)}**\n\nMuốn xem báo giá chi tiết không?`,
      nextStage: 'asking_quote',
    };
  }

  if (lower.includes('ngân sách') || lower.includes('budget') || lower.includes('tiền') || lower.includes('giá')) {
    return {
      text: `💰 Cho tôi biết ngân sách của bạn để tôi tư vấn chính xác:\n\n• **Dưới 500 triệu** → VF 3, VF 5\n• **500 triệu – 1 tỷ** → VF 6, VF 7\n• **Trên 1 tỷ** → VF 8, VF 9 (hạng sang)\n• **Xe máy điện** → Klara S (30tr), Theon S (50tr)\n\nBạn dự định chi bao nhiêu?`,
      nextStage: 'asking_budget',
    };
  }

  if (lower.includes('so sánh') || lower.includes('compare') || lower.includes('khác nhau')) {
    return {
      text: `📊 **VF 6 vs VF 7 vs VF 8 — So sánh nhanh:**\n\n| | VF 6 | VF 7 | VF 8 |\n|---|---|---|---|\n| Giá | 675tr | 850tr | 1,057tr |\n| Phạm vi | 399km | 431km | 447km |\n| 0–100 | 7,5s | 6,2s | 5,5s |\n| Chỗ | 5 | 5 | 5 |\n\nBạn muốn so sánh chi tiết hơn không?`,
      nextStage: 'free',
    };
  }

  if (lower.includes('xe máy') || lower.includes('scooter') || lower.includes('klara') || lower.includes('theon')) {
    return {
      text: `🛵 **Xe máy điện VinFast:**\n\n**Klara S** — Thời trang đô thị\n• Từ 30 triệu | Phạm vi 65km\n• Tốc độ max 50 km/h\n\n**Theon S** — Mạnh mẽ & xa hơn\n• Từ 50 triệu | Phạm vi 100km  \n• Tốc độ max 70 km/h\n\nCả hai đều có ứng dụng quản lý thông minh!`,
      nextStage: 'free',
    };
  }

  return {
    text: `Cảm ơn câu hỏi của bạn! Tôi có thể tư vấn về:\n\n• **Chọn xe phù hợp** với ngân sách\n• **Ưu đãi & khuyến mãi** hiện tại\n• **Đặt lịch lái thử** miễn phí\n• **Tính chi phí** sở hữu và vận hành\n\nBạn đang quan tâm đến điều gì nhất?`,
    nextStage: 'free',
  };
}

interface AIChatWidgetProps {
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
  onRequestQuote: (vehicle: Vehicle) => void;
}

export default function AIChatWidget({ externalOpen, onExternalOpenChange, onRequestQuote }: AIChatWidgetProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (externalOpen) setOpen(true);
  }, [externalOpen]);

  const handleSetOpen = (val: boolean) => {
    setOpen(val);
    if (!val) onExternalOpenChange?.(false);
  };
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Xin chào! Tôi là **VinFast AI Advisor** 🚗⚡\n\nTôi có thể giúp bạn tư vấn chọn xe, so sánh dòng xe, và tính toán chi phí. Bạn cần hỗ trợ gì?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [stage, setStage] = useState<ChatStage>('free');
  const [loading, setLoading] = useState(false);
  const [pendingName, setPendingName] = useState('');
  const [pendingVehicle, setPendingVehicle] = useState<Vehicle | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    await supabase.from('chat_messages').insert({
      session_id: SESSION_ID,
      role: 'user',
      content: text.trim(),
    });

    await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));

    const pendingQuote = { vehicle: pendingVehicle ?? undefined, name: pendingName };
    const { text: responseText, nextStage } = getBotResponse(text, stage, pendingQuote);

    if (stage === 'collecting_name') setPendingName(text.trim());
    if (stage === 'collecting_phone' && pendingVehicle) {
      await supabase.from('quotes').insert({
        customer_name: pendingName,
        customer_phone: text.trim(),
        vehicle_id: pendingVehicle.id,
        vehicle_name: pendingVehicle.name,
        base_price: pendingVehicle.basePrice,
        discount: Math.floor(pendingVehicle.basePrice * 0.02),
        final_price: Math.floor(pendingVehicle.basePrice * 0.98),
        ai_summary: `Khách hàng ${pendingName} quan tâm đến ${pendingVehicle.name}. Tư vấn: xe phù hợp với nhu cầu, đề xuất gói lãi suất 0%.`,
        status: 'pending',
      });
      setPendingVehicle(null);
      setPendingName('');
    }

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date(),
    };

    setMessages((m) => [...m, botMsg]);
    setStage(nextStage);
    setLoading(false);

    await supabase.from('chat_messages').insert({
      session_id: SESSION_ID,
      role: 'assistant',
      content: responseText,
    });
  }

  function handleQuickAction(key: string) {
    const map: Record<string, string> = {
      budget: 'Tôi muốn tìm xe theo ngân sách',
      family: 'Tôi cần xe 7 chỗ cho gia đình',
      promo: 'Ưu đãi và khuyến mãi tháng này là gì?',
      testdrive: 'Tôi muốn đặt lịch lái thử',
    };
    sendMessage(map[key] || key);
  }

  function renderMessageContent(content: string) {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }

  return (
    <>
      {/* Floating toggle */}
      <button
        onClick={() => handleSetOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          open
            ? 'bg-gray-800 hover:bg-gray-700'
            : 'bg-blue-700 hover:bg-blue-600'
        }`}
        title="Tư vấn AI"
      >
        {open ? (
          <ChevronDown size={22} className="text-white" />
        ) : (
          <>
            <MessageCircle size={22} className="text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </>
        )}
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[360px] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          open
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-90 pointer-events-none'
        }`}
        style={{ maxHeight: 'min(72vh, 600px)' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-4 py-3.5 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <Bot size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white text-sm">VinFast AI Advisor</div>
            <div className="text-blue-200 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
              Luôn sẵn sàng tư vấn
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Zap size={14} className="text-blue-300" />
            <button
              onClick={() => handleSetOpen(false)}
              className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors ml-1"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={14} className="text-blue-700" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-blue-700 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100 shadow-sm'
                }`}
              >
                {renderMessageContent(msg.content)}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <User size={14} className="text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <Bot size={14} className="text-blue-700" />
              </div>
              <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
                <Loader2 size={14} className="text-blue-500 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick actions */}
        <div className="px-3 pt-2 pb-1 border-t border-gray-100 bg-white">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {QUICK_ACTIONS.map((qa) => (
              <button
                key={qa.key}
                onClick={() => handleQuickAction(qa.key)}
                className="shrink-0 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-100 transition-colors"
              >
                {qa.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-3 pb-3 bg-white">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
              disabled={loading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-8 h-8 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-200 text-white rounded-lg flex items-center justify-center transition-colors shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
