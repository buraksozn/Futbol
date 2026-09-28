import React, { useRef } from 'react';
import { MATCH_BALLS } from '../data/gameData';
import { GoalsRule, MatchBall } from '../types/game';
import { sounds } from '../utils/audio';

interface CustomizeMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGoals: GoalsRule;
  onSelectGoals: (goals: GoalsRule) => void;
  selectedBallId: string;
  onSelectBall: (ball: MatchBall) => void;
}

export const CustomizeMatchModal: React.FC<CustomizeMatchModalProps> = ({
  isOpen,
  onClose,
  selectedGoals,
  onSelectGoals,
  selectedBallId,
  onSelectBall,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentBall = MATCH_BALLS.find((b) => b.id === selectedBallId) || MATCH_BALLS[0];

  const scrollCarousel = (direction: 'left' | 'right') => {
    sounds.playClick();
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handlePickBall = (ball: MatchBall) => {
    sounds.playClick();
    onSelectBall(ball);
  };

  const handlePickGoal = (rule: GoalsRule) => {
    sounds.playClick();
    onSelectGoals(rule);
  };

  const goalOptions: { rule: GoalsRule; title: string; subtitle: string; iconVal: string }[] = [
    {
      rule: '1 Goal (Solo)',
      title: '1 Goal (Solo)',
      subtitle: 'Golden Goal Instant Win',
      iconVal: '1',
    },
    {
      rule: '2 Goals (Dual)',
      title: '2 Goals (Dual)',
      subtitle: 'First to 2 Goals Win',
      iconVal: '2',
    },
  ];

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[390px] rounded-t-3xl sm:rounded-3xl bg-[#0c081e] border-t-2 sm:border-2 border-cyan-500/40 p-4 pt-5 shadow-[0_-10px_35px_rgba(6,182,212,0.4)] flex flex-col space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar transform transition-transform duration-300">
        <div className="w-12 h-1 rounded-full bg-slate-600/60 mx-auto -mt-1 sm:hidden" />

        <div className="flex items-center justify-between border-b border-cyan-500/25 pb-3">
          <div>
            <h3 className="text-base font-display font-black tracking-wider uppercase text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]" />
              CUSTOMIZE MATCH
            </h3>
            <p className="text-[10px] font-mono text-cyan-300/80 uppercase tracking-widest">
              Match Goal Rules & Match Ball
            </p>
          </div>
          <button
            type="button"
            aria-label="Close Customize Match Modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 1. GOALS COUNT SECTION */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-cyan-400 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                <rect height="12" rx="1" width="18" x="3" y="6" />
                <path d="M3 10h18M3 14h18M8 6v12M12 6v12M16 6v12" strokeOpacity="0.45" />
              </svg>
              GOALS COUNT
            </span>
            <span className="text-[10px] font-mono text-cyan-300/80 uppercase tracking-wider">
              Target to Win
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {goalOptions.map((opt) => {
              const isSelected = selectedGoals === opt.rule;
              return (
                <button
                  key={opt.rule}
                  type="button"
                  onClick={() => handlePickGoal(opt.rule)}
                  className={`p-2.5 rounded-xl text-left flex items-center justify-between transition active:scale-95 group cursor-pointer border ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                      : 'bg-slate-900/80 border-white/10 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-lg font-mono font-bold flex items-center justify-center text-xs ${
                        isSelected
                          ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300'
                          : 'bg-slate-800 border border-slate-700 text-slate-300'
                      }`}
                    >
                      {opt.iconVal}
                    </span>
                    <div>
                      <div className="text-[11px] font-display font-bold text-white uppercase">
                        {opt.title}
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono truncate max-w-[100px]">
                        {opt.subtitle}
                      </div>
                    </div>
                  </div>
                  {isSelected && <span className="text-cyan-400 text-sm font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. SELECT MATCH BALL SECTION */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" fill="none" r="10" stroke="currentColor" strokeWidth="2" />
                <polygon points="12,7 15,10 14,14 10,14 9,10" />
              </svg>
              <span className="text-xs font-display font-bold uppercase tracking-wider text-slate-200">
                MATCH BALL
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous Ball"
                onClick={() => scrollCarousel('left')}
                className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 hover:border-pink-400 text-slate-300 hover:text-pink-300 flex items-center justify-center text-xs active:scale-90 transition cursor-pointer"
              >
                ‹
              </button>
              <span className="text-[10px] font-mono text-pink-300 font-bold px-1 truncate max-w-[110px]">
                {currentBall.name}
              </span>
              <button
                type="button"
                aria-label="Next Ball"
                onClick={() => scrollCarousel('right')}
                className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 hover:border-pink-400 text-slate-300 hover:text-pink-300 flex items-center justify-center text-xs active:scale-90 transition cursor-pointer"
              >
                ›
              </button>
            </div>
          </div>

          {/* Scrollable Ball Container */}
          <div className="relative w-full overflow-hidden rounded-xl bg-slate-950/80 border border-white/10 p-2.5">
            <div
              ref={carouselRef}
              className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1"
            >
              {MATCH_BALLS.map((ball) => {
                const isActive = ball.id === selectedBallId;
                return (
                  <button
                    key={ball.id}
                    type="button"
                    onClick={() => handlePickBall(ball)}
                    className="flex-shrink-0 flex flex-col items-center p-2 rounded-xl transition active:scale-95 group text-center cursor-pointer"
                  >
                    <div
                      className={`w-14 h-14 rounded-full p-1 border-2 flex items-center justify-center transition-all ${
                        isActive
                          ? 'border-pink-400 shadow-[0_0_12px_rgba(255,42,133,0.7)] bg-pink-950/40'
                          : 'border-slate-700 bg-slate-900 group-hover:border-pink-400/60'
                      }`}
                    >
                      <img
                        alt={ball.name}
                        src={ball.src}
                        className="w-10 h-10 object-contain rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                      />
                    </div>
                    <span
                      className={`text-[10px] font-display font-bold mt-1.5 truncate w-16 ${
                        isActive ? 'text-pink-300 font-black' : 'text-slate-300 group-hover:text-white'
                      }`}
                    >
                      {ball.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:opacity-95 active:scale-95 transition cursor-pointer"
          >
            SAVE MATCH SETTINGS
          </button>
        </div>
      </div>
    </div>
  );
};
