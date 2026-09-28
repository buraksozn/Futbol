import React, { useState } from 'react';
import { GAME_THEMES, MATCH_BALLS } from '../data/gameData';
import { GoalsRule, MatchBall, TeamConfig } from '../types/game';
import { sounds } from '../utils/audio';
import { ColorPickerModal } from './ColorPickerModal';
import { ChooseCrestModal } from './ChooseCrestModal';
import { CustomizeMatchModal } from './CustomizeMatchModal';

interface TeamSelectionScreenProps {
  homeTeam: TeamConfig;
  setHomeTeam: React.Dispatch<React.SetStateAction<TeamConfig>>;
  awayTeam: TeamConfig;
  setAwayTeam: React.Dispatch<React.SetStateAction<TeamConfig>>;
  selectedThemeIndex: number;
  setSelectedThemeIndex: (idx: number) => void;
  selectedGoals: GoalsRule;
  setSelectedGoals: (rule: GoalsRule) => void;
  selectedBall: MatchBall;
  setSelectedBall: (ball: MatchBall) => void;
  matchDuration: number;
  setMatchDuration: (dur: number) => void;
  onStartMatch: () => void;
  onOpenLockerRoom: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (en: boolean) => void;
}

export const TeamSelectionScreen: React.FC<TeamSelectionScreenProps> = ({
  homeTeam,
  setHomeTeam,
  awayTeam,
  setAwayTeam,
  selectedThemeIndex,
  setSelectedThemeIndex,
  selectedGoals,
  setSelectedGoals,
  selectedBall,
  setSelectedBall,
  matchDuration,
  setMatchDuration,
  onStartMatch,
  onOpenLockerRoom,
  soundEnabled,
  setSoundEnabled,
}) => {
  // Modal states
  const [colorModalSlot, setColorModalSlot] = useState<
    'home-primary' | 'home-secondary' | 'away-primary' | 'away-secondary' | null
  >(null);
  const [crestModalSide, setCrestModalSide] = useState<'HOME' | 'AWAY' | null>(null);
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false);

  const currentTheme = GAME_THEMES[selectedThemeIndex];

  const handlePrevTheme = () => {
    sounds.playClick();
    setSelectedThemeIndex(
      selectedThemeIndex === 0 ? GAME_THEMES.length - 1 : selectedThemeIndex - 1
    );
  };

  const handleNextTheme = () => {
    sounds.playClick();
    setSelectedThemeIndex(
      selectedThemeIndex === GAME_THEMES.length - 1 ? 0 : selectedThemeIndex + 1
    );
  };

  // Color modal handlers
  const handleOpenColorPicker = (
    slot: 'home-primary' | 'home-secondary' | 'away-primary' | 'away-secondary'
  ) => {
    sounds.playClick();
    setColorModalSlot(slot);
  };

  const handleApplyColor = (color: string) => {
    if (!colorModalSlot) return;
    if (colorModalSlot === 'home-primary') {
      setHomeTeam((prev) => ({ ...prev, primaryColor: color }));
    } else if (colorModalSlot === 'home-secondary') {
      setHomeTeam((prev) => ({ ...prev, secondaryColor: color }));
    } else if (colorModalSlot === 'away-primary') {
      setAwayTeam((prev) => ({ ...prev, primaryColor: color }));
    } else if (colorModalSlot === 'away-secondary') {
      setAwayTeam((prev) => ({ ...prev, secondaryColor: color }));
    }
  };

  const getColorModalInfo = () => {
    switch (colorModalSlot) {
      case 'home-primary':
        return {
          title: 'HOME - PRIMARY TRAIL',
          subtitle: 'HOME TEAM PRIMARY COLOR',
          current: homeTeam.primaryColor,
        };
      case 'home-secondary':
        return {
          title: 'HOME - SECONDARY TRAIL',
          subtitle: 'HOME TEAM SECONDARY COLOR',
          current: homeTeam.secondaryColor,
        };
      case 'away-primary':
        return {
          title: 'AWAY - PRIMARY TRAIL',
          subtitle: 'AWAY TEAM PRIMARY COLOR',
          current: awayTeam.primaryColor,
        };
      case 'away-secondary':
        return {
          title: 'AWAY - SECONDARY TRAIL',
          subtitle: 'AWAY TEAM SECONDARY COLOR',
          current: awayTeam.secondaryColor,
        };
      default:
        return { title: '', subtitle: '', current: '#00F0FF' };
    }
  };

  const colorModalInfo = getColorModalInfo();

  return (
    <div className="relative min-h-screen bg-[#080514] text-slate-100 flex flex-col justify-between overflow-x-hidden select-none">
      {/* Ambient Stadium Lights & Grid Background */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 cyber-grid" />
        <div className="absolute top-0 left-0 right-0 h-96 stadium-light-left" />
        <div className="absolute top-0 left-0 right-0 h-96 stadium-light-right" />
        <div className="absolute top-44 left-1/2 -translate-x-1/2 w-80 h-80 border border-purple-500/10 rounded-full flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 border border-purple-500/10 rounded-full" />
          <div className="absolute w-full h-[1px] bg-purple-500/10" />
        </div>
      </div>

      {/* Mobile App Shell Container (Optimized for 390px mobile view) */}
      <div className="relative z-10 w-full max-w-[390px] mx-auto flex flex-col justify-between px-3.5 pt-3 pb-28">
        {/* Title Section */}
        <section className="text-center mb-3">
          <div className="inline-block px-3.5 py-1 rounded-full bg-violet-950/70 border border-violet-500/40 text-[10px] font-mono font-bold tracking-widest text-violet-200 uppercase mb-1.5 shadow-[0_0_20px_rgba(139,92,246,0.5)] backdrop-blur-md">
            Football Simulator
          </div>
          <h1 className="text-xl font-black font-display tracking-wider uppercase text-white drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)]">
            Team Selection
          </h1>
        </section>

        {/* Main Match Config Grid (HOME vs AWAY) */}
        <main className="space-y-3">
          {/* Versus Header Pills */}
          <div className="grid grid-cols-2 gap-3 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center pointer-events-none">
              <div className="w-7 h-7 rounded-full bg-slate-900 border border-purple-500/60 text-purple-300 font-display font-extrabold text-[11px] flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.6)] italic">
                VS
              </div>
            </div>

            {/* HOME Header */}
            <div className="bg-gradient-to-r from-violet-900/60 to-purple-900/40 border border-violet-500/40 rounded-xl py-1.5 px-2 text-center backdrop-blur-md overflow-hidden">
              <span className="text-[11px] font-display font-bold tracking-wide uppercase text-violet-200 flex items-center justify-center gap-1.5 truncate">
                <span
                  className="w-2 h-2 rounded-full shrink-0 transition-colors"
                  style={{ backgroundColor: homeTeam.primaryColor }}
                />
                <span className="truncate">{homeTeam.name || 'HOME'}</span>
              </span>
            </div>

            {/* AWAY Header */}
            <div className="bg-gradient-to-r from-purple-900/40 to-fuchsia-900/60 border border-fuchsia-500/40 rounded-xl py-1.5 px-2 text-center backdrop-blur-md overflow-hidden">
              <span className="text-[11px] font-display font-bold tracking-wide uppercase text-fuchsia-200 flex items-center justify-center gap-1.5 truncate">
                <span
                  className="w-2 h-2 rounded-full shrink-0 transition-colors"
                  style={{ backgroundColor: awayTeam.primaryColor }}
                />
                <span className="truncate">{awayTeam.name || 'AWAY'}</span>
              </span>
            </div>
          </div>

          {/* Teams Configuration Dual Panel */}
          <div className="grid grid-cols-2 gap-3">
            {/* HOME CARD */}
            <article className="bg-[#0e0824]/70 backdrop-blur-lg border border-violet-500/25 rounded-2xl p-3 flex flex-col justify-between space-y-2.5 shadow-lg relative overflow-hidden">
              <div className="flex flex-col items-center">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => {
                    sounds.playClick();
                    setCrestModalSide('HOME');
                  }}
                  title="Customize Home Crest"
                >
                  {/* Dynamic crest frame wrapper */}
                  <div
                    className="w-20 h-20 rounded-2xl p-[2px] transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${homeTeam.primaryColor}, ${homeTeam.secondaryColor})`,
                      boxShadow: `0 0 12px ${homeTeam.primaryColor}88`,
                    }}
                  >
                    <div className={`w-full h-full rounded-[14px] bg-[#0c081e] flex items-center justify-center group-hover:bg-[#120d2a] transition overflow-hidden relative ${homeTeam.crestImage?.includes('/players/') ? 'p-0' : 'p-1.5'}`}>
                      {homeTeam.crestImage ? (
                        <img
                          alt={homeTeam.name}
                          src={homeTeam.crestImage}
                          className={
                            homeTeam.crestImage.includes('/players/')
                              ? "w-full h-full object-cover object-top scale-110 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] transition-transform duration-200 group-hover:scale-115"
                              : "w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] transition-transform duration-200 group-hover:scale-105"
                          }
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              homeTeam.name
                            )}&background=0b1329&color=00f0ff&bold=true&size=128`;
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <div className="w-8 h-8 rounded-full border border-slate-700/80 bg-slate-900/90 text-slate-300 flex items-center justify-center mb-1 shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                              <path
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle cx="12" cy="13" r="3" />
                            </svg>
                          </div>
                          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">CREST</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Badge with primary color */}
                  <div
                    className="absolute -bottom-1 -right-1 text-slate-950 rounded-full p-1 shadow-md transition-all duration-300"
                    style={{
                      backgroundColor: homeTeam.primaryColor,
                      boxShadow: `0 0 8px ${homeTeam.primaryColor}`,
                    }}
                  >
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-wider text-slate-300">
                    TRAIL COLORS
                  </span>
                  <span
                    className="text-[9px] font-bold transition-colors"
                    style={{ color: homeTeam.primaryColor }}
                  >
                    NEON DUAL
                  </span>
                </div>

                <div className="space-y-1">
                  {/* Home Slot 1 Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenColorPicker('home-primary')}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 transition active:scale-95 text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-md transition-all"
                        style={{
                          backgroundColor: homeTeam.primaryColor,
                          boxShadow: `0 0 8px ${homeTeam.primaryColor}`,
                        }}
                      />
                      <span className="text-[10px] text-slate-200 font-mono font-medium">
                        {homeTeam.primaryColor}
                      </span>
                    </div>
                    <svg className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>

                  {/* Home Slot 2 Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenColorPicker('home-secondary')}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-violet-400 transition active:scale-95 text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-md transition-all"
                        style={{
                          backgroundColor: homeTeam.secondaryColor,
                          boxShadow: `0 0 8px ${homeTeam.secondaryColor}`,
                        }}
                      />
                      <span className="text-[10px] text-slate-200 font-mono font-medium">
                        {homeTeam.secondaryColor}
                      </span>
                    </div>
                    <svg className="w-3 h-3 text-slate-500 group-hover:text-violet-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>

            {/* AWAY CARD */}
            <article className="bg-[#0e0824]/70 backdrop-blur-lg border border-fuchsia-500/25 rounded-2xl p-3 flex flex-col justify-between space-y-2.5 shadow-lg relative overflow-hidden">
              <div className="flex flex-col items-center">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => {
                    sounds.playClick();
                    setCrestModalSide('AWAY');
                  }}
                  title="Customize Away Crest"
                >
                  {/* Dynamic crest frame wrapper */}
                  <div
                    className="w-20 h-20 rounded-2xl p-[2px] transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${awayTeam.primaryColor}, ${awayTeam.secondaryColor})`,
                      boxShadow: `0 0 12px ${awayTeam.primaryColor}88`,
                    }}
                  >
                    <div className={`w-full h-full rounded-[14px] bg-[#0c081e] flex items-center justify-center group-hover:bg-[#120d2a] transition overflow-hidden relative ${awayTeam.crestImage?.includes('/players/') ? 'p-0' : 'p-1.5'}`}>
                      {awayTeam.crestImage ? (
                        <img
                          alt={awayTeam.name}
                          src={awayTeam.crestImage}
                          className={
                            awayTeam.crestImage.includes('/players/')
                              ? "w-full h-full object-cover object-top scale-110 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] transition-transform duration-200 group-hover:scale-115"
                              : "w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] transition-transform duration-200 group-hover:scale-105"
                          }
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              awayTeam.name
                            )}&background=0b1329&color=ff2a85&bold=true&size=128`;
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <div className="w-8 h-8 rounded-full border border-slate-700/80 bg-slate-900/90 text-slate-300 flex items-center justify-center mb-1 shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                              <path
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle cx="12" cy="13" r="3" />
                            </svg>
                          </div>
                          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">CREST</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Badge with primary color */}
                  <div
                    className="absolute -bottom-1 -right-1 text-white rounded-full p-1 shadow-md transition-all duration-300"
                    style={{
                      backgroundColor: awayTeam.primaryColor,
                      boxShadow: `0 0 8px ${awayTeam.primaryColor}`,
                    }}
                  >
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-wider text-slate-300">
                    TRAIL COLORS
                  </span>
                  <span
                    className="text-[9px] font-bold transition-colors"
                    style={{ color: awayTeam.primaryColor }}
                  >
                    NEON DUAL
                  </span>
                </div>

                <div className="space-y-1">
                  {/* Away Slot 1 Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenColorPicker('away-primary')}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-pink-400 transition active:scale-95 text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-md transition-all"
                        style={{
                          backgroundColor: awayTeam.primaryColor,
                          boxShadow: `0 0 8px ${awayTeam.primaryColor}`,
                        }}
                      />
                      <span className="text-[10px] text-slate-200 font-mono font-medium">
                        {awayTeam.primaryColor}
                      </span>
                    </div>
                    <svg className="w-3 h-3 text-slate-500 group-hover:text-pink-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>

                  {/* Away Slot 2 Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenColorPicker('away-secondary')}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-amber-400 transition active:scale-95 text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-md transition-all"
                        style={{
                          backgroundColor: awayTeam.secondaryColor,
                          boxShadow: `0 0 8px ${awayTeam.secondaryColor}`,
                        }}
                      />
                      <span className="text-[10px] text-slate-200 font-mono font-medium">
                        {awayTeam.secondaryColor}
                      </span>
                    </div>
                    <svg className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          </div>
        </main>

        {/* Game Theme Carousel (Functional 7 Themes Slider) */}
        <section className="mt-3 mb-2.5">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
              </svg>
              <span className="text-[11px] font-display font-bold uppercase tracking-wider text-slate-200">
                Game Theme
              </span>
            </div>
            <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              {currentTheme.id} / {GAME_THEMES.length} Unlocked
            </span>
          </div>

          <div className="relative flex items-center justify-center">
            {/* Prev Theme Button */}
            <button
              type="button"
              aria-label="Previous Theme"
              onClick={handlePrevTheme}
              className="absolute -left-2 z-20 w-8 h-8 rounded-full bg-slate-900/90 border border-purple-500/40 text-purple-200 flex items-center justify-center shadow-lg hover:border-emerald-400 hover:text-emerald-300 transition active:scale-90 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>

            {/* Theme Card Frame */}
            <div
              className="w-full rounded-2xl bg-gradient-to-b from-[#0b1c14] to-[#080c1d] border-2 border-emerald-500/40 p-2.5 shadow-[0_0_20px_rgba(0,255,135,0.35)] relative overflow-hidden flex flex-col items-center justify-between"
            >
              {/* Badge */}
              <div className="relative z-10 w-full flex items-center justify-between mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold text-emerald-400 bg-emerald-500/20 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{currentTheme.badge}</span>
                </span>
              </div>

              {/* Arena preview image */}
              <div className="relative z-10 w-full my-0.5 flex flex-col items-center">
                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-emerald-500/40 shadow-lg bg-[#040d08] flex items-center justify-center">
                  <img
                    alt={currentTheme.title}
                    src={currentTheme.imgSrc}
                    className="relative z-10 w-full h-full object-contain mx-auto transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none z-10" />
                  <div className="absolute bottom-2 left-0 right-0 text-center z-20 px-2">
                    <h2
                      className="text-base font-black font-display uppercase tracking-wider text-white truncate"
                      style={{ textShadow: `0 0 15px ${currentTheme.accentColor}` }}
                    >
                      {currentTheme.title}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Color subtext and edition */}
              <div className="relative z-10 w-full flex items-center justify-between text-[10px] pt-1.5 border-t border-white/10 mt-1">
                <div className="flex items-center gap-1 text-emerald-400">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" fill="none" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 2a10 10 0 0 0 0 20M2 12a10 10 0 0 20 0" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <span className="text-slate-300 font-medium">
                    {currentTheme.colorName}
                  </span>
                </div>
                <span className="text-emerald-400 font-mono text-[9px] tracking-wider uppercase font-semibold">
                  {currentTheme.edition}
                </span>
              </div>

              {/* Pagers & Equipped button */}
              <div className="relative z-10 w-full flex items-center justify-between gap-2 mt-2 pt-1 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  {GAME_THEMES.map((t, idx) => (
                    <button
                      key={t.id}
                      type="button"
                      aria-label={`Select Theme ${t.id}`}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedThemeIndex(idx);
                      }}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        idx === selectedThemeIndex
                          ? 'w-3 h-2.5 bg-emerald-400 shadow-[0_0_6px_rgba(0,255,135,0.8)]'
                          : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display text-[11px] font-bold tracking-wider uppercase bg-emerald-500/25 border border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(0,255,135,0.4)]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>✓ EQUIPPED</span>
                </div>
              </div>
            </div>

            {/* Next Theme Button */}
            <button
              type="button"
              aria-label="Next Theme"
              onClick={handleNextTheme}
              className="absolute -right-2 z-20 w-8 h-8 rounded-full bg-slate-900/90 border border-purple-500/40 text-purple-200 flex items-center justify-center shadow-lg hover:border-emerald-400 hover:text-emerald-300 transition active:scale-90 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
              </svg>
            </button>
          </div>
        </section>

        {/* Compact Quick-Trigger Cards (Goals & Match Ball) */}
        <section className="mb-2.5 grid grid-cols-2 gap-2.5">
          {/* Left Trigger: Goals */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setCustomizeModalOpen(true);
            }}
            className="relative flex items-center justify-between p-2.5 rounded-xl bg-[#0e0824]/75 border border-cyan-400/40 hover:border-cyan-400 backdrop-blur-md transition active:scale-95 text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect height="12" rx="1" width="18" x="3" y="6" />
                  <path d="M3 10h18M3 14h18M8 6v12M12 6v12M16 6v12" strokeOpacity="0.45" />
                </svg>
              </div>
              <div>
                <div className="text-[9px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
                  GOALS
                </div>
                <div className="text-xs font-display font-bold text-white tracking-wide truncate max-w-[85px]">
                  {selectedGoals}
                </div>
              </div>
            </div>
            <div className="w-5 h-5 rounded-full bg-cyan-400/10 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:translate-x-0.5 transition">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>

          {/* Right Trigger: Match Ball */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setCustomizeModalOpen(true);
            }}
            className="relative flex items-center justify-between p-2.5 rounded-xl bg-[#0e0824]/75 border border-pink-400/40 hover:border-pink-400 backdrop-blur-md transition active:scale-95 text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-pink-500/10 border border-pink-400/40 flex items-center justify-center shadow-[0_0_8px_rgba(244,63,94,0.4)] p-0.5">
                <img
                  alt={selectedBall.name}
                  src={selectedBall.src}
                  className="w-7 h-7 object-contain rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                />
              </div>
              <div>
                <div className="text-[9px] font-mono uppercase text-pink-400 font-bold tracking-wider">
                  MATCH BALL
                </div>
                <div className="text-xs font-display font-bold text-white tracking-wide truncate max-w-[85px]">
                  {selectedBall.name}
                </div>
              </div>
            </div>
            <div className="w-5 h-5 rounded-full bg-pink-400/10 border border-pink-400/40 flex items-center justify-center text-pink-300 group-hover:translate-x-0.5 transition">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
        </section>

        {/* Match Duration Section */}
        <section className="space-y-2 bg-[#0e0824]/60 border border-violet-500/20 rounded-2xl p-3 backdrop-blur-md">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 text-[11px] font-display">
                <svg className="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" strokeWidth="2" />
                  <path d="M12 7v5l3 3" strokeLinecap="round" strokeWidth="2" />
                </svg>
                Match Duration
              </span>
              <span className="font-mono font-bold text-violet-300 bg-violet-950/70 border border-violet-500/30 px-2 py-0.5 rounded text-[11px]">
                {matchDuration} seconds
              </span>
            </div>

            <input
              type="range"
              min={30}
              max={120}
              step={1}
              value={matchDuration}
              onChange={(e) => setMatchDuration(Number(e.target.value))}
              className="w-full cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5 font-mono">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setMatchDuration(45);
                }}
                className={`hover:text-violet-300 cursor-pointer ${matchDuration === 45 ? 'text-violet-400 font-bold' : ''}`}
              >
                45s
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setMatchDuration(58);
                }}
                className={`cursor-pointer ${matchDuration === 58 ? 'text-violet-400 font-bold' : 'hover:text-violet-300'}`}
              >
                58s (Std)
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setMatchDuration(90);
                }}
                className={`hover:text-violet-300 cursor-pointer ${matchDuration === 90 ? 'text-violet-400 font-bold' : ''}`}
              >
                90s
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setMatchDuration(120);
                }}
                className={`hover:text-violet-300 cursor-pointer ${matchDuration === 120 ? 'text-violet-400 font-bold' : ''}`}
              >
                120s
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Bottom CTA */}
      <aside className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-gradient-to-t from-black via-slate-950/95 to-transparent pb-safe pointer-events-none">
        <div className="max-w-[390px] mx-auto pointer-events-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 rounded-2xl blur-md opacity-80 group-hover:opacity-100 transition duration-300 group-active:scale-95 animate-pulse" />
            <button
              type="button"
              onClick={() => {
                sounds.playWhistle();
                onStartMatch();
              }}
              className="relative w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#6b28eb] via-[#8536f5] to-[#5b21d6] text-white flex items-center shadow-2xl border border-white/20 active:translate-y-0.5 transition transform justify-center cursor-pointer"
            >
              <span className="font-display font-black text-base tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-purple-200 opacity-90" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                START MATCH
              </span>
            </button>
          </div>
          <div className="w-32 h-1 bg-white/20 rounded-full mx-auto mt-2.5" />
        </div>
      </aside>

      {/* MODAL: CUSTOMIZE MATCH (GOALS COUNT & SELECT MATCH BALL) */}
      <CustomizeMatchModal
        isOpen={customizeModalOpen}
        onClose={() => setCustomizeModalOpen(false)}
        selectedGoals={selectedGoals}
        onSelectGoals={setSelectedGoals}
        selectedBallId={selectedBall.id}
        onSelectBall={setSelectedBall}
      />

      {/* MODAL: PREMIUM NEON COLOR PICKER */}
      <ColorPickerModal
        isOpen={colorModalSlot !== null}
        onClose={() => setColorModalSlot(null)}
        title={colorModalInfo.title}
        subtitle={colorModalInfo.subtitle}
        initialColor={colorModalInfo.current}
        onApplyColor={handleApplyColor}
      />

      {/* MODAL: CHOOSE CREST (FLAGS, FOOTBALL CLUBS, PLAYERS, CUSTOM IMAGE UPLOAD) */}
      <ChooseCrestModal
        isOpen={crestModalSide !== null}
        onClose={() => setCrestModalSide(null)}
        teamSide={crestModalSide || 'HOME'}
        currentTeamName={crestModalSide === 'HOME' ? homeTeam.name : awayTeam.name}
        currentCrestId={crestModalSide === 'HOME' ? homeTeam.crestId : awayTeam.crestId}
        currentCrestLabel={crestModalSide === 'HOME' ? homeTeam.crestLabel : awayTeam.crestLabel}
        currentCrestImage={crestModalSide === 'HOME' ? homeTeam.crestImage : awayTeam.crestImage}
        primaryColor={crestModalSide === 'HOME' ? homeTeam.primaryColor : awayTeam.primaryColor}
        secondaryColor={crestModalSide === 'HOME' ? homeTeam.secondaryColor : awayTeam.secondaryColor}
        onSave={(name, id, label, image) => {
          if (crestModalSide === 'HOME') {
            setHomeTeam((prev) => ({
              ...prev,
              name,
              crestId: id,
              crestLabel: label,
              crestImage: image,
            }));
          } else {
            setAwayTeam((prev) => ({
              ...prev,
              name,
              crestId: id,
              crestLabel: label,
              crestImage: image,
            }));
          }
        }}
      />
    </div>
  );
};
