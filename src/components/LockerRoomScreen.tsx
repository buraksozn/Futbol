import React, { useState } from 'react';
import { GAME_THEMES, MATCH_BALLS } from '../data/gameData';
import { GameTheme, MatchBall } from '../types/game';
import { sounds } from '../utils/audio';

interface LockerRoomScreenProps {
  currentThemeIndex: number;
  onSelectTheme: (idx: number) => void;
  currentBallId: string;
  onSelectBall: (ball: MatchBall) => void;
  onBack: () => void;
}

export const LockerRoomScreen: React.FC<LockerRoomScreenProps> = ({
  currentThemeIndex,
  onSelectTheme,
  currentBallId,
  onSelectBall,
  onBack,
}) => {
  const [tab, setTab] = useState<'STADIUMS' | 'BALLS'>('STADIUMS');

  return (
    <div className="relative min-h-screen bg-[#080514] text-slate-100 flex flex-col justify-between overflow-x-hidden p-3.5 select-none">
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 cyber-grid" />
        <div className="absolute top-0 left-0 right-0 h-64 stadium-light-left opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-[390px] mx-auto flex flex-col flex-1 space-y-3.5 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-violet-500/20 pb-2">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-white cursor-pointer"
          >
            ‹ BACK
          </button>
          <h2 className="text-base font-display font-black tracking-wider uppercase text-white">
            ARENA LOCKER
          </h2>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            ALL UNLOCKED
          </span>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setTab('STADIUMS');
            }}
            className={`py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition cursor-pointer ${
              tab === 'STADIUMS'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-[0_0_10px_rgba(0,255,135,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🏟️ 7 Arenas
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setTab('BALLS');
            }}
            className={`py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition cursor-pointer ${
              tab === 'BALLS'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-slate-950 shadow-[0_0_10px_rgba(255,42,133,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚽ 13 Match Balls
          </button>
        </div>

        {/* STADIUMS LIST */}
        {tab === 'STADIUMS' && (
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] no-scrollbar pr-0.5">
            {GAME_THEMES.map((theme: GameTheme, idx: number) => {
              const isEquipped = idx === currentThemeIndex;
              return (
                <div
                  key={theme.id}
                  className={`rounded-2xl border-2 p-3 bg-gradient-to-b from-[#0b1c14] to-[#080c1d] transition-all relative overflow-hidden ${
                    isEquipped
                      ? 'border-emerald-400 shadow-[0_0_15px_rgba(0,255,135,0.4)]'
                      : 'border-white/10 opacity-80 hover:opacity-100 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-display font-black uppercase text-white">
                      {theme.title}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      {theme.edition}
                    </span>
                  </div>

                  <div className="w-full h-28 rounded-xl overflow-hidden bg-black/60 relative mb-2">
                    <img
                      alt={theme.title}
                      src={theme.imgSrc}
                      className="w-full h-full object-contain mx-auto"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                    <span className="text-slate-300">{theme.colorName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        onSelectTheme(idx);
                      }}
                      className={`px-3 py-1 rounded-lg font-display text-[10px] font-bold uppercase transition cursor-pointer ${
                        isEquipped
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {isEquipped ? '✓ EQUIPPED' : 'EQUIP ARENA'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* BALLS GRID */}
        {tab === 'BALLS' && (
          <div className="grid grid-cols-2 gap-2.5 flex-1 overflow-y-auto max-h-[70vh] no-scrollbar pr-0.5">
            {MATCH_BALLS.map((ballItem: MatchBall) => {
              const isEquipped = ballItem.id === currentBallId;
              return (
                <div
                  key={ballItem.id}
                  className={`rounded-2xl border-2 p-2.5 bg-slate-900/80 flex flex-col items-center justify-between text-center transition-all ${
                    isEquipped
                      ? 'border-pink-400 shadow-[0_0_15px_rgba(255,42,133,0.4)] bg-pink-950/30'
                      : 'border-white/10 hover:border-slate-600'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full p-1 border-2 border-slate-700 bg-black/40 flex items-center justify-center my-1">
                    <img
                      alt={ballItem.name}
                      src={ballItem.src}
                      className="w-11 h-11 object-contain rounded-full"
                    />
                  </div>

                  <span className="text-xs font-display font-bold text-white mt-1 truncate max-w-full">
                    {ballItem.name}
                  </span>

                  <div className="w-full text-[9px] font-mono text-slate-400 my-1 space-y-0.5">
                    <div>SPEED: {Math.round(ballItem.speedMultiplier * 100)}%</div>
                    <div>BOUNCE: {Math.round(ballItem.bounceMultiplier * 100)}%</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onSelectBall(ballItem);
                    }}
                    className={`w-full py-1 rounded-lg font-display text-[9px] font-bold uppercase transition mt-1 cursor-pointer ${
                      isEquipped
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isEquipped ? '✓ EQUIPPED' : 'EQUIP'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
