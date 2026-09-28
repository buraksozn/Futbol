import React, { useState, useMemo, useRef } from 'react';
import { CREST_CLUBS, CREST_FLAGS, CREST_PLAYERS, CrestItem } from '../data/crestData';
import { sounds } from '../utils/audio';

type CrestCategory = 'FLAGS' | 'FOOTBALL_CLUBS' | 'FOOTBALL_PLAYERS' | 'IMAGE_UPLOAD';

interface ChooseCrestModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamSide: 'HOME' | 'AWAY';
  currentTeamName: string;
  currentCrestId: string;
  currentCrestLabel: string;
  currentCrestImage?: string;
  primaryColor: string;
  secondaryColor: string;
  onSave: (newName: string, newCrestId: string, newCrestLabel: string, newCrestImage: string) => void;
}

export const ChooseCrestModal: React.FC<ChooseCrestModalProps> = ({
  isOpen,
  onClose,
  teamSide,
  currentTeamName,
  currentCrestId,
  currentCrestLabel,
  currentCrestImage,
  primaryColor,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<CrestCategory>('FLAGS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
    image: string;
  }>({
    id: currentCrestId || 'flag-ar',
    name: currentCrestLabel || currentTeamName || 'Argentina',
    image: currentCrestImage || 'https://flagcdn.com/w160/ar.png',
  });

  // Custom upload state
  const [customImage, setCustomImage] = useState<string | null>(
    currentCrestImage || 'https://flagcdn.com/w160/ar.png'
  );
  const [zoomScale, setZoomScale] = useState<number>(100);
  const [haloColor, setHaloColor] = useState<string>('#00F0FF');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const haloSwatches = [
    { name: 'Cyan', color: '#00F0FF' },
    { name: 'Green', color: '#00FF87' },
    { name: 'Pink', color: '#FF2A85' },
    { name: 'Yellow', color: '#FFD600' },
    { name: 'Purple', color: '#B347FF' },
  ];

  // Active list filtered by search
  const filteredItems = useMemo(() => {
    let source: CrestItem[] = [];
    if (activeTab === 'FLAGS') source = CREST_FLAGS;
    else if (activeTab === 'FOOTBALL_CLUBS') source = CREST_CLUBS;
    else if (activeTab === 'FOOTBALL_PLAYERS') source = CREST_PLAYERS;

    if (!searchQuery.trim()) return source;
    const q = searchQuery.toLowerCase();
    return source.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.subtext && item.subtext.toLowerCase().includes(q))
    );
  }, [activeTab, searchQuery]);

  if (!isOpen) return null;

  const handleSelectItem = (item: CrestItem) => {
    sounds.playClick();
    setSelectedItem({
      id: item.id,
      name: item.name,
      image: item.image,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        sounds.playClick();
        setCustomImage(result);
        setSelectedItem({
          id: 'custom-upload-' + Date.now(),
          name: file.name.replace(/\.[^/.]+$/, '').toUpperCase(),
          image: result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    sounds.playClick();
    const finalImage =
      activeTab === 'IMAGE_UPLOAD' && customImage ? customImage : selectedItem.image;
    const finalName = selectedItem.name.toUpperCase();
    onSave(finalName, selectedItem.id, selectedItem.name, finalImage);
    onClose();
  };

  const getSubtitle = () => {
    if (activeTab === 'IMAGE_UPLOAD') return 'CUSTOM IMAGE STUDIO';
    if (activeTab === 'FOOTBALL_PLAYERS') return 'PLAYER SELECTION';
    return `${teamSide} TEAM CREST`;
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-2 bg-black/85 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[390px] h-[94vh] rounded-3xl bg-[#0c081e] border-2 border-cyan-500/40 p-3 pt-4 shadow-[0_0_35px_rgba(0,240,255,0.3)] flex flex-col justify-between overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 font-mono text-[11px] font-bold uppercase transition active:scale-95 cursor-pointer"
          >
            CANCEL
          </button>

          <div className="text-center">
            <h2 className="text-sm font-display font-black tracking-wider uppercase text-white flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              CHOOSE CREST
            </h2>
            <p className="text-[9px] font-mono text-cyan-300/80 uppercase tracking-widest">
              {getSubtitle()}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="px-3.5 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-display font-black text-[11px] uppercase tracking-wider shadow-[0_0_10px_rgba(0,240,255,0.5)] active:scale-95 transition cursor-pointer flex items-center gap-1"
          >
            <span>✓</span> SAVE
          </button>
        </div>

        {/* Search Bar (visible on Flags, Clubs, Players) */}
        {activeTab !== 'IMAGE_UPLOAD' && (
          <div className="pt-2 pb-1.5 shrink-0">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search player, club or country..."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-8 pr-8 py-2 text-[11px] font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </span>
            </div>
          </div>
        )}

        {/* Category Tabs Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('FLAGS');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-display font-bold tracking-wider uppercase transition shrink-0 cursor-pointer ${
              activeTab === 'FLAGS'
                ? 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                : 'bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <span>🌐</span> FLAGS
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('FOOTBALL_CLUBS');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-display font-bold tracking-wider uppercase transition shrink-0 cursor-pointer ${
              activeTab === 'FOOTBALL_CLUBS'
                ? 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                : 'bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <span>⚽</span> FOOTBALL CLUBS
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('FOOTBALL_PLAYERS');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-display font-bold tracking-wider uppercase transition shrink-0 cursor-pointer ${
              activeTab === 'FOOTBALL_PLAYERS'
                ? 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                : 'bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <span>👤</span> FOOTBALL PLAYERS
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('IMAGE_UPLOAD');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-display font-bold tracking-wider uppercase transition shrink-0 cursor-pointer ${
              activeTab === 'IMAGE_UPLOAD'
                ? 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                : 'bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <span>📁</span> IMAGE UPLOAD
          </button>
        </div>

        {/* Status sub-bar for Flags, Clubs, Players */}
        {activeTab !== 'IMAGE_UPLOAD' && (
          <div className="flex items-center justify-between text-[10px] font-mono py-1 px-1 shrink-0">
            <span className="text-cyan-300 uppercase flex items-center gap-1 truncate max-w-[200px]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              SELECTED: <span className="font-bold text-white">{selectedItem.name}</span>
            </span>
            <span className="text-purple-300 font-mono">
              {filteredItems.length} {activeTab === 'FLAGS' ? 'Badges' : activeTab === 'FOOTBALL_CLUBS' ? 'Clubs' : 'Players'} Available
            </span>
          </div>
        )}

        {/* TAB 1, 2, 3: 4-COLUMN CAROUSEL GRID */}
        {activeTab !== 'IMAGE_UPLOAD' && (
          <div className="flex-1 overflow-y-auto no-scrollbar py-1 pr-0.5">
            <div className="grid grid-cols-4 gap-2">
              {filteredItems.map((item) => {
                const isSelected = selectedItem.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectItem(item)}
                    className="flex flex-col items-center group relative cursor-pointer active:scale-95 transition"
                  >
                    {/* Squircle frame container - NO inner black circle */}
                    <div
                      className={`w-17 h-17 rounded-2xl flex items-center justify-center transition-all duration-200 relative overflow-hidden ${
                        isSelected
                          ? 'border-2 border-cyan-400 bg-cyan-950/40 shadow-[0_0_18px_rgba(0,240,255,0.7)] ring-1 ring-cyan-400/40'
                          : 'border border-slate-700/80 bg-[#0c102a]/90 hover:border-cyan-500/60 hover:bg-[#11173d]'
                      }`}
                    >
                      {activeTab === 'FOOTBALL_CLUBS' ? (
                        /* Direct club crest - large, prominent, transparent with no black circle behind */
                        <img
                          alt={item.name}
                          src={item.image}
                          className="w-full h-full object-contain p-2 transition-transform duration-200 group-hover:scale-110 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              item.name
                            )}&background=0b1329&color=00f0ff&bold=true&size=128`;
                          }}
                        />
                      ) : activeTab === 'FLAGS' ? (
                        /* Flag filling the card with rounded corners */
                        <div className="w-full h-full p-2 flex items-center justify-center">
                          <img
                            alt={item.name}
                            src={item.image}
                            className="w-full h-full object-cover rounded-xl shadow-md transition-transform duration-200 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        /* Player portrait filling frame */
                        <img
                          alt={item.name}
                          src={item.image}
                          className="w-full h-full object-cover object-top transition-transform duration-200 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              item.name
                            )}&background=0b1329&color=00f0ff&bold=true&size=128`;
                          }}
                        />
                      )}

                      {/* Selected check badge */}
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-[0_0_8px_#00F0FF] z-10">
                          ✓
                        </div>
                      )}
                    </div>

                    {/* Label below */}
                    <span
                      className={`text-[10px] font-display font-medium mt-1 truncate max-w-[76px] text-center transition-colors ${
                        isSelected ? 'text-cyan-300 font-bold' : 'text-slate-300 group-hover:text-white'
                      }`}
                    >
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOM IMAGE UPLOAD STUDIO (Screenshot_1671.png) */}
        {activeTab === 'IMAGE_UPLOAD' && (
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 py-1 pr-0.5">
            {/* Custom image upload header badge */}
            <div className="flex items-center justify-between text-[10px] font-mono px-1">
              <span className="text-cyan-400 font-bold uppercase">CUSTOM IMAGE UPLOAD</span>
              <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                READY TO UPLOAD
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-2xl border-2 border-dashed border-cyan-400/50 bg-[#090b20] p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-cyan-400 hover:bg-[#0c102a] transition relative group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.4)] mb-2 group-hover:scale-105 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              <div className="text-xs font-display font-black uppercase text-white tracking-wide">
                TAP TO SELECT IMAGE OR DRAG & DROP
              </div>
              <div className="text-[10px] font-mono text-cyan-300/80 uppercase mt-0.5">
                UPLOAD FROM GALLERY OR DEVICE
              </div>
              <div className="text-[9px] font-mono text-slate-400 mt-1">
                Supports PNG, JPG, WEBP (Max 10MB)
              </div>

              <button
                type="button"
                className="mt-2.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-display font-black text-[11px] uppercase tracking-wider shadow-[0_0_12px_rgba(0,240,255,0.4)] flex items-center gap-1.5"
              >
                <span>📁</span> BROWSE FILES
              </button>
            </div>

            {/* Pitch & Token Live Preview */}
            <div className="rounded-2xl border border-violet-500/30 bg-[#0e0824]/90 p-3 space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="flex items-center gap-1 text-slate-200 font-bold uppercase">
                  <span>👁</span> PITCH & TOKEN LIVE PREVIEW
                </span>
                <span className="text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  CIRCULAR TOKEN HUD
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Simulated green cyber pitch token box */}
                <div className="w-22 h-22 rounded-2xl border border-emerald-500/40 bg-[#041a0d] p-1 flex flex-col items-center justify-center relative overflow-hidden shrink-0">
                  {/* Pitch grid lines */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #00ff87 1px, transparent 1px), linear-gradient(to bottom, #00ff87 1px, transparent 1px)',
                      backgroundSize: '12px 12px',
                    }}
                  />

                  {/* Circular token preview */}
                  <div
                    className="w-14 h-14 rounded-full p-[2px] transition-all relative z-10 flex items-center justify-center overflow-hidden"
                    style={{
                      backgroundColor: haloColor,
                      boxShadow: `0 0 14px ${haloColor}`,
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center">
                      <img
                        alt="Token"
                        src={customImage || selectedItem.image}
                        className="w-full h-full object-cover transition-transform"
                        style={{ transform: `scale(${zoomScale / 100})` }}
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            selectedItem.name
                          )}&background=0b1329&color=00f0ff&bold=true&size=128`;
                        }}
                      />
                    </div>
                  </div>

                  <span className="text-[7px] font-mono font-bold uppercase text-slate-300 mt-1 z-10">
                    SAMPLE TOKEN
                  </span>
                </div>

                {/* Controls: Zoom & Halo Colors */}
                <div className="flex-1 space-y-2">
                  {/* Zoom slider */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-300 flex items-center gap-1">
                        <span>🔍</span> ZOOM / SCALE
                      </span>
                      <span className="text-cyan-400 font-bold">{zoomScale}%</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={150}
                      value={zoomScale}
                      onChange={(e) => setZoomScale(Number(e.target.value))}
                      className="w-full cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-slate-500">
                      <span>50%</span>
                      <span>100%</span>
                      <span>150%</span>
                    </div>
                  </div>

                  {/* Neon Halo Color Selector */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-300 uppercase">NEON HALO COLOR</span>
                      <span className="font-bold text-cyan-300">
                        {haloSwatches.find((h) => h.color === haloColor)?.name || 'Cyan'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {haloSwatches.map((h) => (
                        <button
                          key={h.name}
                          type="button"
                          onClick={() => setHaloColor(h.color)}
                          className={`w-6 h-6 rounded-full transition-transform active:scale-90 cursor-pointer ${
                            haloColor === h.color ? 'scale-115 ring-2 ring-white' : ''
                          }`}
                          style={{
                            backgroundColor: h.color,
                            boxShadow: `0 0 8px ${h.color}`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informational tip box */}
            <div className="rounded-xl border border-violet-500/20 bg-violet-950/30 p-2.5 flex items-start gap-2 text-[9px] font-mono text-slate-300">
              <span className="text-cyan-400 text-xs">💡</span>
              <p>
                Uploaded images will be cropped into a circular pitch token with a vibrant neon halo.
                Transparent PNG or square images yield optimal results.
              </p>
            </div>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-display font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition active:scale-95 cursor-pointer"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:opacity-95 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>✓</span> APPLY & SAVE
          </button>
        </div>
      </div>
    </div>
  );
};
