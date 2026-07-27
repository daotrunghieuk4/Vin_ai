import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Circle, Zap, ArrowRight } from 'lucide-react';
import { heroSlides } from '@/data/vehicles';

interface HeroProps {
  onExplore: () => void;
  onChat: () => void;
}

export default function Hero({ onExplore, onChat }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 300);
  }, [transitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % heroSlides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + heroSlides.length) % heroSlides.length);
  }, [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const slide = heroSlides[current];

  return (
    <section
      className="relative w-full overflow-hidden bg-gray-950"
      style={{ height: 'min(90vh, 720px)', minHeight: '520px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background images */}
      {heroSlides.map((s, i) => (
        <div
          key={s.vehicleId}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={s.imageFallback}
            alt={s.title}
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">

            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-400/30 backdrop-blur-sm mb-5 transition-all duration-500 ${
                transitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              <Zap size={12} className="text-blue-400 fill-blue-400" />
              <span className="text-xs font-semibold text-blue-300 tracking-wider uppercase">
                VinFast Electric · 100% Điện
              </span>
            </div>

            {/* Title */}
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 transition-all duration-500 ${
                transitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
              style={{ transitionDelay: '50ms' }}
            >
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p
              className={`text-base sm:text-lg text-white/75 leading-relaxed mb-8 max-w-lg transition-all duration-500 ${
                transitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-wrap gap-3 transition-all duration-500 ${
                transitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <button
                onClick={onExplore}
                className="group flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105"
              >
                Khám phá ngay
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={onChat}
                className="flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/25 hover:border-white/50 transition-all hover:scale-105"
              >
                <Zap size={15} className="text-blue-300" />
                Tư vấn chọn xe
              </button>
            </div>

            {/* Stats */}
            <div
              className={`mt-10 flex gap-8 transition-all duration-500 ${
                transitioning ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              {[
                { value: '8+', label: 'Dòng xe điện' },
                { value: '438km', label: 'Phạm vi tối đa' },
                { value: '5,1s', label: '0–100 km/h' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/55 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nav arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
      >
        <ChevronRight size={20} />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-6 z-20 text-white/50 text-xs font-medium">
        {String(current + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
      </div>

      {/* Progress bar */}
      {!paused && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
          <div
            key={current}
            className="h-full bg-blue-400"
            style={{
              animation: 'heroProgress 6s linear forwards',
            }}
          />
        </div>
      )}
    </section>
  );
}
