import React from 'react';
import { MatchResult, TeamConfig } from '../types/game';
import { sounds } from '../utils/audio';

interface MatchSummaryScreenProps {
  result: MatchResult;
  homeTeam: TeamConfig;
  awayTeam: TeamConfig;
  onRematch: () => void;
  onNextMatch: () => void;
}

export const MatchSummaryScreen: React.FC<MatchSummaryScreenProps> = ({
  result,
  homeTeam,
  awayTeam,
  onRematch,
  onNextMatch,
}) => {
  const isHomeWinner = result.winner === 'HOME';
  const isDraw = result.winner === 'DRAW';

  return (
    <div className="relative min-h-screen bg-[#080514] text-slate-100 flex flex-col justify-between overflow-x-hidden p-4 select-none">
      {/* Background Stadium Grid & Glows */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 cyber-grid" />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${
              isHomeWinner ? homeTeam.primaryColor : awayTeam.primaryColor
            }22 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[390px] mx-auto flex flex-col flex-1 justify-between pt-4 pb-8 space-y-4">
        {/* Victory Header Banner */}
        <section className="text-center space-y-1">
          <div className="inline-block px-3.5 py-1 rounded-full bg-violet-950/70 border border-violet-500/40 text-[10px] font-mono font-bold tracking-widest text-violet-200 uppercase mb-1 shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            MATCH CONCLUSION
          </div>

          <h1
            className="text-2xl font-black font-display tracking-wider uppercase drop-shadow-[0_2px_12px_rgba(0,255,135,0.7)]"
            style={{
              color: isHomeWinner ? homeTeam.primaryColor : isDraw ? '#facc15' : awayTeam.primaryColor,
            }}
          >
            {isHomeWinner ? '★ HOME VICTORY ★' : isDraw ? 'MATCH DRAW' : '★ AWAY VICTORY ★'}
          </h1>
          <p className="text-xs font-mono text-slate-400">
            {isHomeWinner
              ? `${homeTeam.name || 'HOME'} dominated the Cyber Pitch!`
              : isDraw
              ? 'An intense deadlock between titans!'
              : `${awayTeam.name || 'AWAY'} conquered the arena!`}
          </p>
        </section>

        {/* Scorecard Hero Container */}
        <section className="bg-[#0e0824]/80 border-2 border-violet-500/30 rounded-3xl p-4 shadow-[0_0_25px_rgba(123,63,228,0.3)] backdrop-blur-md">
          <div className="flex items-center justify-between">
            {/* Home Side */}
            <div className="flex flex-col items-center text-center space-y-1 w-24">
              <div
                className="w-14 h-14 rounded-2xl p-[2px] shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${homeTeam.primaryColor}, ${homeTeam.secondaryColor})`,
                  boxShadow: `0 0 12px ${homeTeam.primaryColor}88`,
                }}
              >
                <div className="w-full h-full rounded-[14px] bg-[#0c081e] flex items-center justify-center overflow-hidden">
                  {homeTeam.crestImage ? (
                    <img
                      alt={homeTeam.name}
                      src={homeTeam.crestImage}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          homeTeam.name
                        )}&background=0b1329&color=00f0ff&bold=true&size=128`;
                      }}
                    />
                  ) : (
                    <span className="text-xl">
                      {homeTeam.crestIcon === 'zap' ? '⚡' : homeTeam.crestIcon === 'crown' ? '👑' : '📷'}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs font-display font-bold uppercase text-white truncate w-full">
                {homeTeam.name || 'HOME'}
              </span>
              <span className="text-[9px] font-mono text-cyan-400">HOST</span>
            </div>

            {/* Score Numbers */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3">
                <span
                  className="text-4xl font-display font-black"
                  style={{
                    color: homeTeam.primaryColor,
                    textShadow: `0 0 15px ${homeTeam.primaryColor}`,
                  }}
                >
                  {result.homeScore}
                </span>
                <span className="text-xl font-mono text-slate-500 font-bold">:</span>
                <span
                  className="text-4xl font-display font-black"
                  style={{
                    color: awayTeam.primaryColor,
                    textShadow: `0 0 15px ${awayTeam.primaryColor}`,
                  }}
                >
                  {result.awayScore}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full mt-1">
                FINAL WHISTLE
              </span>
            </div>

            {/* Away Side */}
            <div className="flex flex-col items-center text-center space-y-1 w-24">
              <div
                className="w-14 h-14 rounded-2xl p-[2px] shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${awayTeam.primaryColor}, ${awayTeam.secondaryColor})`,
                  boxShadow: `0 0 12px ${awayTeam.primaryColor}88`,
                }}
              >
                <div className="w-full h-full rounded-[14px] bg-[#0c081e] flex items-center justify-center overflow-hidden">
                  {awayTeam.crestImage ? (
                    <img
                      alt={awayTeam.name}
                      src={awayTeam.crestImage}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          awayTeam.name
                        )}&background=0b1329&color=ff2a85&bold=true&size=128`;
                      }}
                    />
                  ) : (
                    <span className="text-xl">
                      {awayTeam.crestIcon === 'flame' ? '🔥' : awayTeam.crestIcon === 'skull' ? '💀' : '📷'}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs font-display font-bold uppercase text-white truncate w-full">
                {awayTeam.name || 'AWAY'}
              </span>
              <span className="text-[9px] font-mono text-pink-400">VISITOR</span>
            </div>
          </div>
        </section>

        {/* Match Telemetry Statistics */}
        <section className="bg-slate-900/70 border border-white/10 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-display font-bold text-slate-300 uppercase border-b border-white/5 pb-1">
            <span>Match Telemetry</span>
            <span className="text-cyan-400 font-mono text-[10px]">MVP: {result.mvp}</span>
          </div>

          {/* Possession Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span style={{ color: homeTeam.primaryColor }}>{result.homePossession}% POSSESSION</span>
              <span style={{ color: awayTeam.primaryColor }}>{result.awayPossession}% POSSESSION</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 flex overflow-hidden p-[1px] border border-white/10">
              <div
                style={{
                  width: `${result.homePossession}%`,
                  backgroundColor: homeTeam.primaryColor,
                  boxShadow: `0 0 8px ${homeTeam.primaryColor}`,
                }}
              />
              <div
                style={{
                  width: `${result.awayPossession}%`,
                  backgroundColor: awayTeam.primaryColor,
                  boxShadow: `0 0 8px ${awayTeam.primaryColor}`,
                }}
              />
            </div>
          </div>

          {/* Grid Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[9px] text-slate-400 block">TOTAL SHOTS</span>
              <span className="text-xs font-bold text-white">
                {result.homeShots} - {result.awayShots}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[9px] text-slate-400 block">BOOSTS USED</span>
              <span className="text-xs font-bold text-cyan-400">{result.homeBoosts}</span>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[9px] text-slate-400 block">XP REWARD</span>
              <span className="text-xs font-bold text-emerald-400">+250 XP</span>
            </div>
          </div>
        </section>

        {/* CTA Buttons */}
        <section className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => {
              sounds.playWhistle();
              onRematch();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-slate-950 font-display font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95 transition cursor-pointer"
          >
            ⚡ REMATCH INSTANTLY
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onNextMatch();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-slate-900 border border-slate-700 hover:border-violet-400 text-slate-200 font-display font-bold text-xs uppercase tracking-wider active:scale-95 transition cursor-pointer"
          >
            CONFIGURE NEXT MATCH
          </button>
        </section>
      </div>
    </div>
  );
};
