import React, { useState, useEffect } from 'react';
import { COLOR_PALETTE_SWATCHES } from '../data/gameData';
import { sounds } from '../utils/audio';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  initialColor: string;
  onApplyColor: (color: string, glowIntensity?: number) => void;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  onClose,
  subtitle,
  initialColor,
  onApplyColor,
}) => {
  const [selectedHex, setSelectedHex] = useState(initialColor);
  const [glowIntensity, setGlowIntensity] = useState(90);

  useEffect(() => {
    if (isOpen) {
      setSelectedHex(initialColor);
    }
  }, [isOpen, initialColor]);

  if (!isOpen) return null;

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.trim().toUpperCase();
    if (!val.startsWith('#')) val = '#' + val;
    setSelectedHex(val);
  };

  const handlePresetSelect = (hex: string) => {
    sounds.playClick();
    setSelectedHex(hex);
  };

  const handleRandomColor = () => {
    sounds.playClick();
    const randomItem = COLOR_PALETTE_SWATCHES[Math.floor(Math.random() * COLOR_PALETTE_SWATCHES.length)];
    setSelectedHex(randomItem.hex);
  };

  const handleApply = () => {
    sounds.playClick();
    onApplyColor(selectedHex, glowIntensity);
    onClose();
  };

  const formattedHex = selectedHex.startsWith('#') ? selectedHex : '#' + selectedHex;
  const rawHex = formattedHex.replace('#', '');

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[390px] rounded-t-3xl sm:rounded-3xl bg-[#0c081e] border-t-2 sm:border-2 border-violet-500/40 p-4 pt-5 shadow-[0_-10px_35px_rgba(123,63,228,0.4)] flex flex-col space-y-3.5 max-h-[90vh] overflow-y-auto no-scrollbar transform transition-transform duration-300">
        {/* Top Handle for mobile */}
        <div className="w-12 h-1 rounded-full bg-slate-600/60 mx-auto -mt-1 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-violet-500/25 pb-3">
          <div>
            <h3 className="text-base font-display font-black tracking-wider uppercase text-white flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full transition-colors duration-300"
                style={{ backgroundColor: formattedHex, boxShadow: `0 0 10px ${formattedHex}` }}
              />
              SELECT TRAIL COLOR
            </h3>
            <p className="text-[10px] font-mono text-violet-300/80 uppercase tracking-widest">
              {subtitle}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close Color Modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 hover:border-violet-400 text-slate-300 hover:text-white flex items-center justify-center transition text-sm active:scale-90"
          >
            ✕
          </button>
        </div>

        {/* Live Preview & Neon Motion Simulation */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            <span>Active Neon Trail Glow</span>
            <span className="font-bold text-white font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
              {formattedHex}
            </span>
          </div>

          <div className="relative h-12 w-full rounded-lg bg-black/60 border border-white/5 flex items-center justify-between px-3 overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                background: `radial-gradient(ellipse at center, ${formattedHex} 0%, transparent 70%)`,
                opacity: (glowIntensity / 100) * 0.45,
              }}
            />
            <div className="flex items-center gap-1.5 z-10">
              <span
                className="w-2 h-2 rounded-full opacity-30 transition-all duration-300"
                style={{ backgroundColor: formattedHex }}
              />
              <span
                className="w-2.5 h-2.5 rounded-full opacity-60 transition-all duration-300"
                style={{ backgroundColor: formattedHex }}
              />
              <span
                className="w-3.5 h-3.5 rounded-full opacity-80 transition-all duration-300"
                style={{
                  backgroundColor: formattedHex,
                  boxShadow: `0 0 ${Math.round((glowIntensity / 100) * 8)}px ${formattedHex}`,
                }}
              />
              <span
                className="w-5 h-5 rounded-full transition-all duration-300 relative flex items-center justify-center"
                style={{
                  backgroundColor: formattedHex,
                  boxShadow: `0 0 ${Math.round((glowIntensity / 100) * 16) + 4}px ${formattedHex}`,
                }}
              >
                <span className="w-2 h-2 rounded-full bg-white" />
              </span>
            </div>

            <div className="text-[9px] font-mono uppercase tracking-widest text-slate-400 z-10 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              NEON TURBO ACTIVE
            </div>
          </div>
        </div>

        {/* Cyber Neon Presets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeWidth="2" />
              </svg>
              NEON PRESETS
            </span>
            <span className="text-[9px] font-mono text-cyan-300 uppercase tracking-widest">
              {COLOR_PALETTE_SWATCHES.length} Cyber Tones
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {COLOR_PALETTE_SWATCHES.map((swatch) => {
              const isSelected = swatch.hex.toUpperCase() === formattedHex.toUpperCase();
              return (
                <button
                  key={swatch.hex}
                  type="button"
                  onClick={() => handlePresetSelect(swatch.hex)}
                  className={`relative flex flex-col items-center p-2 rounded-xl bg-slate-900/90 border transition active:scale-95 group cursor-pointer ${
                    isSelected ? 'border-cyan-400 bg-slate-800 ring-1 ring-cyan-400' : 'border-white/10 hover:border-violet-400'
                  }`}
                >
                  <span
                    className="w-7 h-7 rounded-lg transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: swatch.hex,
                      boxShadow: isSelected ? `0 0 10px ${swatch.hex}` : `0 0 4px ${swatch.hex}55`,
                    }}
                  />
                  <span className="text-[8px] font-mono text-slate-300 mt-1 uppercase truncate max-w-full">
                    {swatch.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Color Input with Native Picker and Hex Input */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              CUSTOM HEX & PICKER
            </span>
            <span className="text-[9px] font-mono text-pink-300 uppercase tracking-widest">
              RGB Spectrum
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label
              className="relative cursor-pointer shrink-0 w-11 h-11 rounded-xl border border-white/20 p-1 bg-slate-900 flex items-center justify-center hover:border-cyan-400 transition"
              title="Pick custom color"
            >
              <input
                type="color"
                value={formattedHex}
                onChange={(e) => setSelectedHex(e.target.value.toUpperCase())}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <span
                className="w-full h-full rounded-lg transition-all"
                style={{
                  backgroundColor: formattedHex,
                  boxShadow: `0 0 8px ${formattedHex}`,
                }}
              />
            </label>

            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                #
              </span>
              <input
                type="text"
                value={rawHex}
                maxLength={7}
                onChange={handleHexChange}
                placeholder="00F0FF"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-7 pr-3 py-2.5 text-xs font-mono font-bold uppercase text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 tracking-wider"
              />
            </div>

            <button
              type="button"
              onClick={handleRandomColor}
              title="Pick Random Color"
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-violet-400 text-violet-300 text-xs font-mono uppercase font-bold flex items-center gap-1 active:scale-95 transition cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              RND
            </button>
          </div>
        </div>

        {/* Glow Intensity Slider */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[11px] font-display font-medium text-slate-300">
            <span className="flex items-center gap-1 text-[10px] uppercase font-bold">
              <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
              </svg>
              Trail Glow Intensity
            </span>
            <span className="font-mono text-cyan-300 font-bold text-[10px]">
              {glowIntensity}% {glowIntensity > 80 ? '(Ultra)' : glowIntensity > 50 ? '(Neon)' : '(Soft)'}
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={glowIntensity}
            onChange={(e) => setGlowIntensity(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Modal Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 font-display font-bold text-xs uppercase tracking-wider hover:bg-slate-800 active:scale-95 transition cursor-pointer"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:opacity-95 active:scale-95 transition cursor-pointer"
          >
            APPLY COLOR
          </button>
        </div>
      </div>
    </div>
  );
};
