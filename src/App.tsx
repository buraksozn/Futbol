import React, { useState } from 'react';
import { GAME_THEMES, MATCH_BALLS } from './data/gameData';
import { AppScreen, GoalsRule, MatchBall, MatchResult, TeamConfig } from './types/game';
import { TeamSelectionScreen } from './components/TeamSelectionScreen';
import { MatchPlayScreen } from './components/MatchPlayScreen';
import { MatchSummaryScreen } from './components/MatchSummaryScreen';
import { LockerRoomScreen } from './components/LockerRoomScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('TEAM_SELECTION');

  // Teams configuration
  const [homeTeam, setHomeTeam] = useState<TeamConfig>({
    name: 'HOME',
    crestId: 'camera',
    crestIcon: 'camera',
    crestLabel: 'Select Crest',
    primaryColor: '#00F0FF',
    secondaryColor: '#7B3FE4',
    glowIntensity: 90,
  });

  const [awayTeam, setAwayTeam] = useState<TeamConfig>({
    name: 'AWAY',
    crestId: 'camera',
    crestIcon: 'camera',
    crestLabel: 'Select Crest',
    primaryColor: '#FF2A85',
    secondaryColor: '#FFAA00',
    glowIntensity: 90,
  });

  // Match settings
  const [selectedThemeIndex, setSelectedThemeIndex] = useState<number>(0);
  const [selectedGoals, setSelectedGoals] = useState<GoalsRule>('1 Goal (Solo)');
  const [selectedBall, setSelectedBall] = useState<MatchBall>(
    MATCH_BALLS.find((b) => b.id === 'classic') || MATCH_BALLS[0]
  );
  const [matchDuration, setMatchDuration] = useState<number>(58);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Latest match result
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const handleStartMatch = () => {
    setCurrentScreen('MATCH_PLAY');
  };

  const handleMatchFinish = (result: MatchResult) => {
    setMatchResult(result);
    setCurrentScreen('MATCH_SUMMARY');
  };

  const handleRematch = () => {
    setCurrentScreen('MATCH_PLAY');
  };

  const handleBackToSelection = () => {
    setCurrentScreen('TEAM_SELECTION');
  };

  return (
    <div className="w-full min-h-screen bg-[#080514] text-slate-100 flex flex-col justify-center items-center">
      {currentScreen === 'TEAM_SELECTION' && (
        <TeamSelectionScreen
          homeTeam={homeTeam}
          setHomeTeam={setHomeTeam}
          awayTeam={awayTeam}
          setAwayTeam={setAwayTeam}
          selectedThemeIndex={selectedThemeIndex}
          setSelectedThemeIndex={setSelectedThemeIndex}
          selectedGoals={selectedGoals}
          setSelectedGoals={setSelectedGoals}
          selectedBall={selectedBall}
          setSelectedBall={setSelectedBall}
          matchDuration={matchDuration}
          setMatchDuration={setMatchDuration}
          onStartMatch={handleStartMatch}
          onOpenLockerRoom={() => setCurrentScreen('LOCKER_ROOM')}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
        />
      )}

      {currentScreen === 'MATCH_PLAY' && (
        <MatchPlayScreen
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          theme={GAME_THEMES[selectedThemeIndex]}
          ball={selectedBall}
          goalsRule={selectedGoals}
          duration={matchDuration}
          onMatchFinish={handleMatchFinish}
          onBackToMenu={handleBackToSelection}
          soundEnabled={soundEnabled}
        />
      )}

      {currentScreen === 'MATCH_SUMMARY' && matchResult && (
        <MatchSummaryScreen
          result={matchResult}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          onRematch={handleRematch}
          onNextMatch={handleBackToSelection}
        />
      )}

      {currentScreen === 'LOCKER_ROOM' && (
        <LockerRoomScreen
          currentThemeIndex={selectedThemeIndex}
          onSelectTheme={setSelectedThemeIndex}
          currentBallId={selectedBall.id}
          onSelectBall={setSelectedBall}
          onBack={handleBackToSelection}
        />
      )}
    </div>
  );
}
