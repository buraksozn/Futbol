import { GameTheme, MatchBall } from '../types/game';

export const GAME_THEMES: GameTheme[] = [
  {
    id: 1,
    title: 'Champions Arena',
    colorName: 'Champions Neon Green',
    edition: 'UEFA Stars Edition',
    badge: '★ Champions Neon',
    accentColor: '#00ff87',
    fieldColor: '#061a10',
    fieldLinesColor: '#00ff87',
    goalGlowColor: '#00ff87',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCwg3CT3sGZab_NGFOhkdCFsTaRBUPNJNDFI1Zurz_RiktZW_NjZxDq2cQdlIqrc4JjOlm4aQY8ZrCLhaDKBIVuezPL2LnS8-Kbb2QR4vbuHnQHIacyVm0TQDc34ESLmHwQ9jyltXW4gBnKP599gqonaeVnJSyu34DM1L6avIQV1mQ5IlxYhIgO56yMkKwYUnaTNdqFDkkSDuUXLGkUi9jEnvhTa_sik2Ktg18Ik0nDfMabBd6QMLqAr-3PYEKwUzxrA'
  },
  {
    id: 2,
    title: 'Electric Pitch Arena',
    colorName: 'Turf Pro Green',
    edition: 'Pro Stadium Edition',
    badge: '★ Electric Pitch',
    accentColor: '#10b981',
    fieldColor: '#041d14',
    fieldLinesColor: '#34d399',
    goalGlowColor: '#10b981',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjE4pa1se3Mrq07g3q0bfpQI65w6u5TaHPl4Sy8E9hx5HIEt_SQFLl4vkyCIS2Ok8Ln-3hJW8zBgCZh14Vn6g9t0BGfgHyWQnKVJdPeUiUimMg_md19hynbz2KM1svZBqLP0pXTcqGS9bLtcz1F1SDBlCwQSlJAl7CQdswy3mvA9uHfV90NZadyRTezhg0R6G1Z91fyyV4sC_8AK-w3XJvoLlfhTGFwxcXdlnhH-7aligJ3aogKUtSSAF8ycvmN1M-uQ'
  },
  {
    id: 3,
    title: 'Inferno Stadium',
    colorName: 'Blazing Fire Neon Orange',
    edition: 'Inferno Cup Edition',
    badge: '★ Inferno Stadium',
    accentColor: '#ff5500',
    fieldColor: '#1a0904',
    fieldLinesColor: '#ff7733',
    goalGlowColor: '#ff4400',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsTC57VYrQuy5lQ-wtriHF1pG3j8s3SIAQZ4idUASKUz-nFIVieT2Xg1Kq0L-4dScuJrnmsDKLj9fcou675i9aX3uvy1niAnujlACjwOZSeRTmR0YN3FOSQ5rbOQr06ENWoZt5uFRwuWfm3jyPX2AZzv5kgI69-mMorDVVbW6_E09M32P2y9uPErnH-On7z9D3rENgeVQo-W-XDY-9sOkttj54MgcSsCBkzLTpsB-_YdhpK54ahUlSrp9MBle0fKjDkA'
  },
  {
    id: 4,
    title: 'Cyber Ice Arena',
    colorName: 'Sub-Zero Neon Cyan',
    edition: 'Sub-Zero Cold Series',
    badge: '★ Cyber Ice',
    accentColor: '#00f0ff',
    fieldColor: '#041624',
    fieldLinesColor: '#38bdf8',
    goalGlowColor: '#00f0ff',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvK4MzI7ymohkgKNEb4JCQ752_vltLxkVhlM1oQzkzSbnY1Q2eqlkRtgtj-C8ZnmpFSyetGh5q9hXfIGW1n_XSBqSNFXcmOSGiBi3lSExTsdK9GF9G8S2ARULWgS_vhgr4Kar8Nxn2MiQHkpYO4OoWXWKScwLB1Os_wsLqVqLtbc06hxt5r-5OAD7fBVrXf7cZ-BJwfJ5z_p6of6GyQBhVNgICBsNgw2cYLxdZb_GudZhTnzUyvJBfvX-Y5yVWTnR2KA'
  },
  {
    id: 5,
    title: 'Neon Synthwave',
    colorName: 'Dual Magenta & Cyan',
    edition: 'Outrun Retro Series',
    badge: '★ Synthwave Neon',
    accentColor: '#ff2a85',
    fieldColor: '#17061d',
    fieldLinesColor: '#e879f9',
    goalGlowColor: '#ff2a85',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgpbD6m_352FVsaLlMZmVzwKbPN4xBIhb_rrsZ0sa-BsiJgR43PWRQi7EyhVSAPHzysHiQYH1QfKwGwn9X33qdREoVKf7hz-m1EGGr0hAlkRNct5Z-b8fXeXlOPcknr9gjHR5aajmuXpIKm0SPamtcejTRnaVFCKr9XXsUmbSoiV_sR-1snddY724srd0wNUvluJCrJZBZGGsrWFr24RkdzBXijl_YG8cSVUP5KQ75Kdi_cP_4xhOBwL9n8BM2PQlGMA'
  },
  {
    id: 6,
    title: 'Golden Dome',
    colorName: 'Solar Amber Glow',
    edition: 'Grand Final Gold Cup',
    badge: '★ Golden Dome',
    accentColor: '#ffaa00',
    fieldColor: '#1a1304',
    fieldLinesColor: '#facc15',
    goalGlowColor: '#ffaa00',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBD4ceEWnA71eo8dBoZxmlnfC1Op41ptsyfEqyjz8B85Vl8NLXG93tngQ4O3r08Cq2qRdK_r3rPmQoZ3-vkgbScHn3p6MAqd_EMXaEWUyld653Y9aGUcxW6zp4aSfbNzF96mWsoZs2NljwgwpFCKyNTCadsKt4Fh1uG5BeGyXxnDSmaEbU73YI2p4r4Yl_myk1eY22gT86IAN6NtGrvqxMU_JsRp0ZZdbJOmtKpNkekxBpyV0no5ODP6ahBUCkfhDuBA'
  },
  {
    id: 7,
    title: 'Violet Nebula Arena',
    colorName: 'Deep Purple Glow',
    edition: 'Cosmic Duel Edition',
    badge: '★ Violet Nebula',
    accentColor: '#a855f7',
    fieldColor: '#110624',
    fieldLinesColor: '#c084fc',
    goalGlowColor: '#a855f7',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMK5Rwe8xmWJUATj_3ELzKYPK-QvVOEHDomvviuejmWrtFTkk0yhg4SrHvS-UJyegU4sXc_2VNoRHN34_20atL3vjfh96Bc3YpzxTTczup58qKO-yQ5OHpTVyRRRog30r0axEJFSzgVnlCvRmC2Znn5FbQkEAXHGCjDrcGQCPQWUemhR-KZOlVIguVYjgU1IkvLWi0UOY6eVzlb_WtkRPt-3Bu31hZmHlvKBNKj6oikMDB_7DwKcNknJSE0xURD_Xa4w'
  }
];

export const MATCH_BALLS: MatchBall[] = [
  {
    id: 'no-ball',
    name: 'No Ball',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAv9T-mXUIM9yZF_VpNEFo67Z2HIwDZSncCimhDSpRY-wXOJzUT9HpnkYr7TS9NJIgrQnIk_sNggUIVIYYsAoJyXAjKE1Mb9tS-sefxNnufwZKHPOv4RdeGbtylCCEd4ttdoRkthAB5jMu7tM5dczy9MKq3UfiEoEd_DooXXt0FWg6esSVAGtkOmu0oIGuIhZAntzm13QenN0-iDqZsm7c3bwkYnNfjxSfGQYDsn9VtMZ9t_V0fG9LGMtSJ75VKdn8Hg',
    speedMultiplier: 1.4,
    bounceMultiplier: 1.3,
    curveFactor: 1.5,
    glowColor: '#00ffff'
  },
  {
    id: 'classic',
    name: 'Classic',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBueU3LL_GfGK4mTglgIySjJCjJv93sERitARSdwoiNRFUkwGEijll5SY9ZSF_Tz6VLOiTui13i2zhhLp30lNBwEoUcxzSEZHA3qWrsDvFbKMoUnol2tMcADKEZL16wmu5mhuY6nQUumipxnamSG0MTfK6BMirR8xPpX7TpdWqBrFJQMHAZYL66kvtZRymHebjHEythhOBU5FJd_g1YYR71DSoZGQ3czvYmGFqGKkRjEiZPt9WXBDpMRhs4P4TJMnO-_A',
    speedMultiplier: 1.0,
    bounceMultiplier: 1.0,
    curveFactor: 1.0,
    glowColor: '#ffffff'
  },
  {
    id: 'champions-star',
    name: 'Champions Star',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuksEeSYSeqXzU_pKRN49AYVLuE5DYUUzZ5A_s61e-Ad9GiMO6QrnAY64ALBTj9VLC4fPvUGyMT99WBmqVkL-ZI06MJ4dnC8AcqF2YU73Mzl5keDP6YgmnotfBS4zMhnmcLgn81K_HyUgwq5_nw1vqaUTofLPRFoYIcfqR68VVQg_1m7rKd7xAtnogviwuPmue9PcdCotjEyug0FozRaEnRGIvWnj2iGW6Arq0FV2bbS4JRBJtLQdZxk-pGvjGiHWUKw',
    speedMultiplier: 1.15,
    bounceMultiplier: 1.05,
    curveFactor: 1.2,
    glowColor: '#00ff87'
  },
  {
    id: 'golden-trophy',
    name: 'Golden Trophy',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzeip_W--IEm0e3HOLr6WN6CegK2q8YsKduZhyeghIF2HTCn3oC58OVn9lnLQn4z_S4eG4X5S7sLrhitgGxbeiU5Hx_6G92Oy7PsyjBERIaoqLaVSct_d1xBzcPsUszLmTite33IoArwwvgxx0ZgyowHz4hmZ-jZJNsUoIfyzuYyfCFlZ_nU0aGzB1eu5_XfZXGFUDsnYQ62YFg_bYLOcYd5An8DdFlSoT8CJJdirbTU0saoEIv0jwU4sUnqp_nM42tg',
    speedMultiplier: 1.25,
    bounceMultiplier: 1.1,
    curveFactor: 1.15,
    glowColor: '#ffaa00'
  },
  {
    id: 'splash-art',
    name: 'Splash Art',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtmLmic1r53t2a69B8H-XStqeW0sIiirIci5-0usT6Y02Z512BTY3YB0aHOp4QxFpGyUlMdd7i_kJhp1Df-_PtubS6QTDhGdTIBg0m6kQ2bQe6H5rO7JNjB19HE_xOkkcngEhhs-auH-N80jFTNFNpXCAPkNBGTXseg2wv4IwXCRXYp0s0-2ffHCI8llBVwxISgfkwtcBALI97EyDrSPiL3FbtrTWKEWzkTBbmT1MC9vsQkckK15Pps91-9Dkr_uR1Gg',
    speedMultiplier: 1.08,
    bounceMultiplier: 1.15,
    curveFactor: 1.3,
    glowColor: '#ff2a85'
  },
  {
    id: 'pro-blue',
    name: 'Pro Blue',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTbPjWP8aPHUevrSbWaL1JrK1NvdJIbXXkEle2FiMS8KImtrPRkh2vyEO0h0QOMQEdRZX0B64OvdqVafMoCsQxPkrSIFm4S1FVfWy0nOAaFMkXgIKhekXUz8mQMD2Vy-jBpkov4dqOGtCVjXN7aBwo1It2iPUGTxYg3u596g5RC1FwrUSM5L2xf57PLCPcFGQUYLuPJyeZprJseoYoZ7rpE4rczY8UFIdcjCBnJWoHsQJSqcYMQPfDjd-16CGZ9Wq7sg',
    speedMultiplier: 1.2,
    bounceMultiplier: 1.0,
    curveFactor: 1.05,
    glowColor: '#00f0ff'
  },
  {
    id: 'neon-green-star',
    name: 'Neon Green Star',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6mwGS2IFvCrRyn4a1VO-s-h3Yxijt_A_5YxLhGk_jjAP6-NWjgB0M8t2kQMJvBjue-C7uTJiC7f-0eTT6vl69XHeiwuhPCAGkDGgNZkQRusHnzCvAvMlpL7NoJqZ128IYzQr1WmNbx2znE0ZLCeXScnIL7i5ZwrLhgbf5ME4qnqi61gXIa7U_rDgd3CO5yiqU9lgCydxtNihsXYNcME5fhxJ5gd9DMWMS0zQ0q0QMlaMyYn1TZxrE7vjvjYrfPiX5g',
    speedMultiplier: 1.1,
    bounceMultiplier: 1.2,
    curveFactor: 1.25,
    glowColor: '#00ff66'
  },
  {
    id: 'cyber-blue-hex',
    name: 'Cyber Blue Hex',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA91sBsoFCwwqE061cnMdBMbBruuxn86kzGMauu6ym2Pxbv35MZTgaC8xyyZ27gQep0rerYbRrx_14kRpWnJSbrnU1YZSY622mpbyAT5TiGmtsXx5t_xyVWz1g4YNLXUWpthq72dO3s5gYMRsQwNgr-tax23K95i2_8dO1bPkG2Ffo2eTnK13oQbcbHnyrHr2ygDaEwk0_QwUk4MxhPdOM7JfBTUASVq9jeMvNe17T3I7rN6EsBsJSC7MBeUjMvYm-DQ',
    speedMultiplier: 1.3,
    bounceMultiplier: 0.95,
    curveFactor: 1.1,
    glowColor: '#38bdf8'
  },
  {
    id: 'neon-pulse',
    name: 'Neon Pulse',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtfeRXDE7d6b1qXoUEwhlKy169WaA_vMSnQY8frr2ouD4X4FVh4cjqZOjyBIZlpIZyT1h4zwlca-MGPx99usIdehlInh4KO_CSJstypzJR87J3genxz-u8ntS5CO1GP28e1QCLUmoCVLpLcE7Ko-n248YXRHoPJs1PuQr_Wvvefp691e_cxCU_VToZ3pFoYW-nHfV7vITDN_CJDJUbvA6QkzJfGXRc6hNWwj6xniptkhROZwFw3NvEi3uUHf475U4twQ',
    speedMultiplier: 1.22,
    bounceMultiplier: 1.15,
    curveFactor: 1.35,
    glowColor: '#ff2a85'
  },
  {
    id: 'mono-classic',
    name: 'Mono Classic',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH-FiH0CYdVdISCERMxZewkYcuN_35p2NJPVeOYsbwM0vOJPxssWkPQuiAtp1yhuuQieJ5cmceU0UuT739WoiTprEoNTI2QzT_eWF9NequhkPkWNAKSKqtLOF6ju2Rv-nF_UzGbFP1h6oRtB0fJDbAyaEGWZYDBPCVaBG3DMwkTcuiE13BIKaI_rsb73iVqGDl0B-lF00LfRkAoEOCHR63192u7g2J7d9jCbXiQRdA-BEawiimG_pg_c9vIkS_pXCIfg',
    speedMultiplier: 1.0,
    bounceMultiplier: 1.0,
    curveFactor: 1.0,
    glowColor: '#e2e8f0'
  },
  {
    id: 'cyber-blue-wire',
    name: 'Cyber Blue Wire',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZb5Ipsg5uT0BhWKOagEOilnDVd4n6Upahkd0kvGraXHyUmlFWrEUEooXyf5iaT7tluxOBudqs_mfAaew_A4f7DcpOmZHZ665xHPUerjn8yNOl4m3nOFc6t1mTSu9g2AXNrbLtjDSBK_ZuyG4Aw7sGwdX0IR8NqHdBdXT-TggXwV_K8_akvHnkJhB_unyRxgg5iOkvJpVMCWw7XXlBqe9TTj3MjuIkcuoU_rzg3VcgMwNeM86oeWUj68sWjNMiooW91A',
    speedMultiplier: 1.18,
    bounceMultiplier: 1.12,
    curveFactor: 1.2,
    glowColor: '#00f0ff'
  },
  {
    id: 'solar-gold-white',
    name: 'Solar Gold',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLaNaS-nlMp-mViQoqP5Yj-7LmdkCG-sUpYJSkjTJ-5BzLsR9TCJPp4LdQs7rijYEc-IR9syf_eew7SJFJIv6zIkEn5QAd-nTg-gcwg1ZoOqe-5G0sTZAYcFoyH4b7NolHPBPP2isgHz83CQA6IXUpE0Eru80V_BXFkCxdoFps_i7bLz7JiMR7tVyBYxT42_SqYaZgUJH363T6L-VeK01PaN24jQiihKD7typklPn7AsRXQgSSHlhRXJpZ7PD9UyeYwg',
    speedMultiplier: 1.28,
    bounceMultiplier: 1.1,
    curveFactor: 1.18,
    glowColor: '#ffd700'
  },
  {
    id: 'solid-gold',
    name: 'Solid Gold',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAH2Snm6wJyAxiHc1YiH4PWFBSwqO0ujesIHGqa6Q5K6mV5kFmwXUYHb8U-aJz5lQZS3WbFZT1m9xVwC4qsfQzVk3cGbGhF_tBoosCEFgph9chFIHjSO6YirOuwMrET9MGmir_BzISWaVAARwdljTJtWaAOQhbkldJ2F2JgCoUb56eSo41BOEOYuqYRwNAtXJazidUxFVlGQu-JypLermnfvu2FVWjNHTPUYOu4STehxsmtv95iNXfpNGqSX1NxIrvsNw',
    speedMultiplier: 1.35,
    bounceMultiplier: 1.25,
    curveFactor: 1.3,
    glowColor: '#ffaa00'
  }
];

export const CREST_PRESETS = [
  { id: 'camera', label: 'Select Crest', icon: 'camera' },
  { id: 'shield-lightning', label: 'Lightning Bolt', icon: 'zap' },
  { id: 'flame', label: 'Inferno Flame', icon: 'flame' },
  { id: 'skull', label: 'Cyber Skull', icon: 'skull' },
  { id: 'crown', label: 'Royal Crown', icon: 'crown' },
  { id: 'star', label: 'Galaxy Star', icon: 'star' },
  { id: 'target', label: 'Sniper Core', icon: 'crosshair' },
  { id: 'sword', label: 'Dual Blades', icon: 'swords' }
];

export const COLOR_PALETTE_SWATCHES = [
  { hex: '#00F0FF', name: 'Cyan' },
  { hex: '#7B3FE4', name: 'Violet' },
  { hex: '#FF2A85', name: 'Pink' },
  { hex: '#FFAA00', name: 'Amber' },
  { hex: '#00FF66', name: 'Green' },
  { hex: '#FFE600', name: 'Acid' },
  { hex: '#FF4500', name: 'Orange' },
  { hex: '#38BDF8', name: 'Ice' },
  { hex: '#9333EA', name: 'Purple' },
  { hex: '#FFFFFF', name: 'White' },
  { hex: '#FF1493', name: 'Deep Pink' },
  { hex: '#00E5FF', name: 'Neon Aqua' },
  { hex: '#76FF03', name: 'Volt Lime' },
  { hex: '#D500F9', name: 'Neon Magenta' },
  { hex: '#FFD600', name: 'Cyber Gold' }
];
