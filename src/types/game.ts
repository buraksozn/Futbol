export interface TeamConfig {
  name: string;
  crestId: string;
  crestIcon: string;
  crestLabel: string;
  crestImage?: string;
  primaryColor: string;
  secondaryColor: string;
  glowIntensity: number;
}

export interface GameTheme {
  id: number;
  title: string;
  colorName: string;
  edition: string;
  badge: string;
  accentColor: string;
  fieldColor: string;
  fieldLinesColor: string;
  goalGlowColor: string;
  imgSrc: string;
}

export interface MatchBall {
  id: string;
  name: string;
  src: string;
  speedMultiplier: number;
  bounceMultiplier: number;
  curveFactor: number;
  glowColor: string;
}

export type GoalsRule = '1 Goal (Solo)' | '2 Goals (Dual)';

export type AppScreen = 'TEAM_SELECTION' | 'MATCH_PLAY' | 'MATCH_SUMMARY' | 'LOCKER_ROOM';

export interface MatchResult {
  homeScore: number;
  awayScore: number;
  durationPlayed: number;
  winner: 'HOME' | 'AWAY' | 'DRAW';
  homeShots: number;
  awayShots: number;
  homePossession: number;
  awayPossession: number;
  homeBoosts: number;
  mvp: string;
}
