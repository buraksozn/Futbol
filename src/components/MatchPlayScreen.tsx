import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameTheme, MatchBall, MatchResult, TeamConfig, GoalsRule } from '../types/game';
import { sounds } from '../utils/audio';

interface MatchPlayScreenProps {
  homeTeam: TeamConfig;
  awayTeam: TeamConfig;
  theme: GameTheme;
  ball: MatchBall;
  goalsRule: GoalsRule;
  duration: number;
  onMatchFinish: (result: MatchResult) => void;
  onBackToMenu: () => void;
  soundEnabled: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface TrailPoint {
  x: number;
  y: number;
  color: string;
  radius: number;
  alpha: number;
}

export const MatchPlayScreen: React.FC<MatchPlayScreenProps> = ({
  homeTeam,
  awayTeam,
  theme,
  ball,
  goalsRule,
  duration,
  onMatchFinish,
  onBackToMenu,
  soundEnabled,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Match HUD state
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const [goalAnnouncement, setGoalAnnouncement] = useState<string | null>(null);
  const [turboStamina, setTurboStamina] = useState(100);

  // Match statistics tracker
  const statsRef = useRef({
    homeShots: 0,
    awayShots: 0,
    homePossessionTime: 0,
    awayPossessionTime: 0,
    homeBoosts: 0,
    isOver: false,
  });

  // Keys active state
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const joystickRef = useRef<{ dx: number; dy: number; active: boolean }>({
    dx: 0,
    dy: 0,
    active: false,
  });

  // Touch controls state for virtual joystick
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Cached crest images for rendering in pitch tokens
  const homeCrestImgRef = useRef<HTMLImageElement | null>(null);
  const awayCrestImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (homeTeam.crestImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = homeTeam.crestImage;
      img.onload = () => {
        homeCrestImgRef.current = img;
      };
      img.onerror = () => {
        homeCrestImgRef.current = null;
      };
    } else {
      homeCrestImgRef.current = null;
    }
  }, [homeTeam.crestImage]);

  useEffect(() => {
    if (awayTeam.crestImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = awayTeam.crestImage;
      img.onload = () => {
        awayCrestImgRef.current = img;
      };
      img.onerror = () => {
        awayCrestImgRef.current = null;
      };
    } else {
      awayCrestImgRef.current = null;
    }
  }, [awayTeam.crestImage]);

  // Match entities state
  const gameStateRef = useRef({
    playerHome: {
      x: 120,
      y: 200,
      vx: 0,
      vy: 0,
      radius: 18,
      speed: 4.4,
      trail: [] as TrailPoint[],
    },
    playerAway: {
      x: 480,
      y: 200,
      vx: 0,
      vy: 0,
      radius: 18,
      speed: 3.8,
      trail: [] as TrailPoint[],
    },
    ball: {
      x: 300,
      y: 200,
      vx: 0,
      vy: 0,
      radius: 11,
      trail: [] as TrailPoint[],
      lastTouch: 'NONE' as 'HOME' | 'AWAY' | 'NONE',
    },
    particles: [] as Particle[],
    goalCooldown: 0,
    screenShake: 0,
  });

  // Finish match handler
  const endMatch = useCallback(
    (finalHomeScore: number, finalAwayScore: number) => {
      if (statsRef.current.isOver) return;
      statsRef.current.isOver = true;

      sounds.playWhistle();

      const totalTime =
        statsRef.current.homePossessionTime + statsRef.current.awayPossessionTime || 1;
      const homePoss = Math.round((statsRef.current.homePossessionTime / totalTime) * 100);
      const awayPoss = 100 - homePoss;

      let winner: 'HOME' | 'AWAY' | 'DRAW' = 'DRAW';
      let mvp = 'Cyber Striker';
      if (finalHomeScore > finalAwayScore) {
        winner = 'HOME';
        mvp = homeTeam.name || 'Home Player';
      } else if (finalAwayScore > finalHomeScore) {
        winner = 'AWAY';
        mvp = awayTeam.name || 'Away AI';
      }

      onMatchFinish({
        homeScore: finalHomeScore,
        awayScore: finalAwayScore,
        durationPlayed: duration - timeLeft,
        winner,
        homeShots: Math.max(statsRef.current.homeShots, finalHomeScore),
        awayShots: Math.max(statsRef.current.awayShots, finalAwayScore),
        homePossession: homePoss,
        awayPossession: awayPoss,
        homeBoosts: statsRef.current.homeBoosts,
        mvp,
      });
    },
    [awayTeam.name, duration, homeTeam.name, onMatchFinish, timeLeft]
  );

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.key === 'Shift') {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          endMatch(homeScore, awayScore);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, homeScore, awayScore, endMatch]);

  // Turbo stamina regenerator
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setTurboStamina((prev) => Math.min(100, prev + 2));
    }, 150);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Trigger goal celebration
  const triggerGoal = useCallback(
    (scoringTeam: 'HOME' | 'AWAY') => {
      sounds.playGoal();
      gameStateRef.current.screenShake = 14;

      if (scoringTeam === 'HOME') {
        const nextScore = homeScore + 1;
        setHomeScore(nextScore);
        statsRef.current.homeShots += 1;
        setGoalAnnouncement(`GOAL! ${homeTeam.name || 'HOME'}`);

        if (goalsRule === '1 Goal (Solo)') {
          setTimeout(() => endMatch(nextScore, awayScore), 1200);
          return;
        }
        if (goalsRule === '2 Goals (Dual)' && nextScore >= 2) {
          setTimeout(() => endMatch(nextScore, awayScore), 1200);
          return;
        }
      } else {
        const nextScore = awayScore + 1;
        setAwayScore(nextScore);
        statsRef.current.awayShots += 1;
        setGoalAnnouncement(`GOAL! ${awayTeam.name || 'AWAY'}`);

        if (goalsRule === '1 Goal (Solo)') {
          setTimeout(() => endMatch(homeScore, nextScore), 1200);
          return;
        }
        if (goalsRule === '2 Goals (Dual)' && nextScore >= 2) {
          setTimeout(() => endMatch(homeScore, nextScore), 1200);
          return;
        }
      }

      // Reset positions to kickoff after 1.4s
      gameStateRef.current.goalCooldown = 80;
      setTimeout(() => {
        setGoalAnnouncement(null);
        const st = gameStateRef.current;
        st.playerHome.x = 140;
        st.playerHome.y = 200;
        st.playerHome.vx = 0;
        st.playerHome.vy = 0;

        st.playerAway.x = 460;
        st.playerAway.y = 200;
        st.playerAway.vx = 0;
        st.playerAway.vy = 0;

        st.ball.x = 300;
        st.ball.y = 200;
        st.ball.vx = 0;
        st.ball.vy = 0;
        st.ball.lastTouch = 'NONE';
      }, 1400);
    },
    [awayScore, awayTeam.name, endMatch, goalsRule, homeScore, homeTeam.name]
  );

  // Manual kick trigger
  const handleKickAction = () => {
    const st = gameStateRef.current;
    const p = st.playerHome;
    const b = st.ball;

    const dx = b.x - p.x;
    const dy = b.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < p.radius + b.radius + 24) {
      sounds.playKick(1.4);
      statsRef.current.homeShots += 1;
      const angle = Math.atan2(dy, dx);
      const kickPower = 8.5 * ball.speedMultiplier;
      b.vx = Math.cos(angle) * kickPower;
      b.vy = Math.sin(angle) * kickPower;
      b.lastTouch = 'HOME';

      // Spawn spark particles
      for (let i = 0; i < 8; i++) {
        st.particles.push({
          x: b.x,
          y: b.y,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          color: homeTeam.primaryColor,
          size: Math.random() * 3 + 2,
          alpha: 1,
          life: 0,
          maxLife: 20,
        });
      }
    }
  };

  // Turbo boost action
  const handleBoostAction = () => {
    if (turboStamina > 25) {
      sounds.playBoost();
      setTurboStamina((prev) => Math.max(0, prev - 30));
      statsRef.current.homeBoosts += 1;
      const p = gameStateRef.current.playerHome;
      p.speed = 7.5;
      setTimeout(() => {
        p.speed = 4.4;
      }, 700);

      // Spawn boost trail
      for (let i = 0; i < 6; i++) {
        gameStateRef.current.particles.push({
          x: p.x,
          y: p.y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          color: homeTeam.secondaryColor,
          size: 4,
          alpha: 1,
          life: 0,
          maxLife: 25,
        });
      }
    }
  };

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const pitchWidth = 600;
    const pitchHeight = 400;
    const goalHeight = 120;
    const goalTop = (pitchHeight - goalHeight) / 2;
    const goalBottom = goalTop + goalHeight;

    const render = () => {
      if (!isPaused) {
        const state = gameStateRef.current;
        const pHome = state.playerHome;
        const pAway = state.playerAway;
        const b = state.ball;

        // Screen shake decay
        if (state.screenShake > 0) {
          state.screenShake *= 0.88;
        }

        // Possession tracker
        if (b.lastTouch === 'HOME') {
          statsRef.current.homePossessionTime += 1;
        } else if (b.lastTouch === 'AWAY') {
          statsRef.current.awayPossessionTime += 1;
        }

        // HOME PLAYER INPUT HANDLING
        let moveX = 0;
        let moveY = 0;

        if (keysRef.current['arrowleft'] || keysRef.current['a']) moveX -= 1;
        if (keysRef.current['arrowright'] || keysRef.current['d']) moveX += 1;
        if (keysRef.current['arrowup'] || keysRef.current['w']) moveY -= 1;
        if (keysRef.current['arrowdown'] || keysRef.current['s']) moveY += 1;

        if (joystickRef.current.active) {
          moveX = joystickRef.current.dx;
          moveY = joystickRef.current.dy;
        }

        if (keysRef.current[' '] || keysRef.current['shift']) {
          handleKickAction();
        }

        // Apply Home movement
        const len = Math.sqrt(moveX * moveX + moveY * moveY);
        if (len > 0.05) {
          pHome.vx = (moveX / len) * pHome.speed;
          pHome.vy = (moveY / len) * pHome.speed;
        } else {
          pHome.vx *= 0.8;
          pHome.vy *= 0.8;
        }

        pHome.x += pHome.vx;
        pHome.y += pHome.vy;

        // Keep inside pitch
        pHome.x = Math.max(pHome.radius, Math.min(pitchWidth - pHome.radius, pHome.x));
        pHome.y = Math.max(pHome.radius, Math.min(pitchHeight - pHome.radius, pHome.y));

        // AWAY AI MOVEMENT
        if (state.goalCooldown <= 0) {
          const targetX = b.x > 300 ? b.x : 480;
          const targetY = b.y;
          const aiDx = targetX - pAway.x;
          const aiDy = targetY - pAway.y;
          const aiDist = Math.sqrt(aiDx * aiDx + aiDy * aiDy);

          if (aiDist > 5) {
            pAway.vx = (aiDx / aiDist) * pAway.speed;
            pAway.vy = (aiDy / aiDist) * pAway.speed;
          }

          pAway.x += pAway.vx;
          pAway.y += pAway.vy;
          pAway.x = Math.max(pAway.radius, Math.min(pitchWidth - pAway.radius, pAway.x));
          pAway.y = Math.max(pAway.radius, Math.min(pitchHeight - pAway.radius, pAway.y));

          // Away AI kick
          const distToBall = Math.hypot(b.x - pAway.x, b.y - pAway.y);
          if (distToBall < pAway.radius + b.radius + 10) {
            sounds.playKick(1.2);
            statsRef.current.awayShots += 1;
            const kickAngle = Math.atan2(pitchHeight / 2 - b.y, 40 - b.x);
            b.vx = Math.cos(kickAngle) * (7.2 * ball.speedMultiplier);
            b.vy = Math.sin(kickAngle) * (7.2 * ball.speedMultiplier);
            b.lastTouch = 'AWAY';
          }
        }

        // BALL MOVEMENT & FRICTION
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.985; // friction
        b.vy *= 0.985;

        // Player collisions with Ball
        const checkPlayerBallCollision = (player: typeof pHome, team: 'HOME' | 'AWAY') => {
          const cdx = b.x - player.x;
          const cdy = b.y - player.y;
          const cdist = Math.hypot(cdx, cdy);
          const minDist = player.radius + b.radius;

          if (cdist < minDist) {
            sounds.playKick(0.8);
            b.lastTouch = team;
            const overlap = minDist - cdist;
            const nx = cdx / cdist;
            const ny = cdy / cdist;

            b.x += nx * overlap;
            b.y += ny * overlap;

            // Transfer velocity
            b.vx += player.vx * 1.35 * ball.bounceMultiplier;
            b.vy += player.vy * 1.35 * ball.bounceMultiplier;
          }
        };

        checkPlayerBallCollision(pHome, 'HOME');
        checkPlayerBallCollision(pAway, 'AWAY');

        // WALL BOUNCES & GOAL DETECTION
        // Top and bottom walls
        if (b.y - b.radius < 0) {
          b.y = b.radius;
          b.vy = -b.vy * 0.9 * ball.bounceMultiplier;
          sounds.playWallBounce();
        } else if (b.y + b.radius > pitchHeight) {
          b.y = pitchHeight - b.radius;
          b.vy = -b.vy * 0.9 * ball.bounceMultiplier;
          sounds.playWallBounce();
        }

        // Left goal vs wall
        if (b.x - b.radius < 0) {
          if (b.y > goalTop && b.y < goalBottom) {
            // GOAL FOR AWAY!
            if (state.goalCooldown <= 0) {
              triggerGoal('AWAY');
            }
          } else {
            b.x = b.radius;
            b.vx = -b.vx * 0.9 * ball.bounceMultiplier;
            sounds.playWallBounce();
          }
        }

        // Right goal vs wall
        if (b.x + b.radius > pitchWidth) {
          if (b.y > goalTop && b.y < goalBottom) {
            // GOAL FOR HOME!
            if (state.goalCooldown <= 0) {
              triggerGoal('HOME');
            }
          } else {
            b.x = pitchWidth - b.radius;
            b.vx = -b.vx * 0.9 * ball.bounceMultiplier;
            sounds.playWallBounce();
          }
        }

        // UPDATE TRAILS
        pHome.trail.unshift({
          x: pHome.x,
          y: pHome.y,
          color: homeTeam.primaryColor,
          radius: pHome.radius * 0.85,
          alpha: 0.7,
        });
        if (pHome.trail.length > 8) pHome.trail.pop();

        pAway.trail.unshift({
          x: pAway.x,
          y: pAway.y,
          color: awayTeam.primaryColor,
          radius: pAway.radius * 0.85,
          alpha: 0.7,
        });
        if (pAway.trail.length > 8) pAway.trail.pop();

        b.trail.unshift({
          x: b.x,
          y: b.y,
          color: ball.glowColor,
          radius: b.radius * 0.75,
          alpha: 0.6,
        });
        if (b.trail.length > 10) b.trail.pop();

        // Particles update
        for (let i = state.particles.length - 1; i >= 0; i--) {
          const pt = state.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life++;
          pt.alpha = 1 - pt.life / pt.maxLife;
          if (pt.life >= pt.maxLife) {
            state.particles.splice(i, 1);
          }
        }

        if (state.goalCooldown > 0) {
          state.goalCooldown--;
        }
      }

      // ================= DRAW STAGE =================
      ctx.save();
      const shakeOffset = (Math.random() - 0.5) * gameStateRef.current.screenShake;
      ctx.translate(shakeOffset, shakeOffset);

      // Pitch background
      ctx.fillStyle = theme.fieldColor || '#061a10';
      ctx.fillRect(0, 0, pitchWidth, pitchHeight);

      // Turf grid lines pattern
      ctx.strokeStyle = `${theme.fieldLinesColor}22`;
      ctx.lineWidth = 1;
      for (let x = 0; x <= pitchWidth; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, pitchHeight);
        ctx.stroke();
      }
      for (let y = 0; y <= pitchHeight; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(pitchWidth, y);
        ctx.stroke();
      }

      // Stadium field markings
      ctx.strokeStyle = theme.fieldLinesColor;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = theme.fieldLinesColor;
      ctx.shadowBlur = 8;

      // Outer boundary
      ctx.strokeRect(10, 10, pitchWidth - 20, pitchHeight - 20);

      // Center line
      ctx.beginPath();
      ctx.moveTo(pitchWidth / 2, 10);
      ctx.lineTo(pitchWidth / 2, pitchHeight - 10);
      ctx.stroke();

      // Center circle
      ctx.beginPath();
      ctx.arc(pitchWidth / 2, pitchHeight / 2, 55, 0, Math.PI * 2);
      ctx.stroke();

      // Center spot
      ctx.fillStyle = theme.fieldLinesColor;
      ctx.beginPath();
      ctx.arc(pitchWidth / 2, pitchHeight / 2, 4, 0, Math.PI * 2);
      ctx.fill();

      // Goal Boxes
      // Left penalty box
      ctx.strokeRect(10, (pitchHeight - 180) / 2, 80, 180);
      // Right penalty box
      ctx.strokeRect(pitchWidth - 90, (pitchHeight - 180) / 2, 80, 180);

      // Glowing Goal Posts & Netting
      // Left Goal (Home side)
      ctx.fillStyle = `${homeTeam.primaryColor}22`;
      ctx.fillRect(0, goalTop, 10, goalHeight);
      ctx.strokeStyle = homeTeam.primaryColor;
      ctx.shadowColor = homeTeam.primaryColor;
      ctx.shadowBlur = 12;
      ctx.strokeRect(0, goalTop, 10, goalHeight);

      // Right Goal (Away side)
      ctx.fillStyle = `${awayTeam.primaryColor}22`;
      ctx.fillRect(pitchWidth - 10, goalTop, 10, goalHeight);
      ctx.strokeStyle = awayTeam.primaryColor;
      ctx.shadowColor = awayTeam.primaryColor;
      ctx.shadowBlur = 12;
      ctx.strokeRect(pitchWidth - 10, goalTop, 10, goalHeight);

      ctx.shadowBlur = 0; // reset shadow

      // RENDER PLAYER TRAILS
      const drawTrail = (trail: TrailPoint[], secondaryColor: string) => {
        trail.forEach((point, i) => {
          const fade = (1 - i / trail.length) * point.alpha;
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.radius * (1 - i / (trail.length * 1.8)), 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? point.color : secondaryColor;
          ctx.globalAlpha = fade * 0.45;
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;
      };

      drawTrail(gameStateRef.current.playerHome.trail, homeTeam.secondaryColor);
      drawTrail(gameStateRef.current.playerAway.trail, awayTeam.secondaryColor);

      // RENDER BALL TRAIL
      gameStateRef.current.ball.trail.forEach((point, i) => {
        const fade = (1 - i / gameStateRef.current.ball.trail.length) * point.alpha;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius * (1 - i / 14), 0, Math.PI * 2);
        ctx.fillStyle = ball.glowColor;
        ctx.globalAlpha = fade * 0.5;
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // RENDER PARTICLES
      gameStateRef.current.particles.forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // DRAW HOME PLAYER
      const pHome = gameStateRef.current.playerHome;
      ctx.save();
      ctx.shadowColor = homeTeam.primaryColor;
      ctx.shadowBlur = 14;

      // Outer ring with secondary color
      ctx.beginPath();
      ctx.arc(pHome.x, pHome.y, pHome.radius + 2, 0, Math.PI * 2);
      ctx.fillStyle = homeTeam.secondaryColor;
      ctx.fill();

      // Inner body with primary color
      ctx.beginPath();
      ctx.arc(pHome.x, pHome.y, pHome.radius, 0, Math.PI * 2);
      ctx.fillStyle = homeTeam.primaryColor;
      ctx.fill();

      // Dark core
      ctx.beginPath();
      ctx.arc(pHome.x, pHome.y, pHome.radius * 0.65, 0, Math.PI * 2);
      ctx.fillStyle = '#0c081e';
      ctx.fill();

      // Player crest icon/text
      if (homeCrestImgRef.current && homeCrestImgRef.current.complete) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(pHome.x, pHome.y, pHome.radius * 0.65, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(
          homeCrestImgRef.current,
          pHome.x - pHome.radius * 0.65,
          pHome.y - pHome.radius * 0.65,
          pHome.radius * 1.3,
          pHome.radius * 1.3
        );
        ctx.restore();
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px Sora, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(homeTeam.name ? homeTeam.name.substring(0, 3) : '1', pHome.x, pHome.y);
      }
      ctx.restore();

      // DRAW AWAY PLAYER (AI)
      const pAway = gameStateRef.current.playerAway;
      ctx.save();
      ctx.shadowColor = awayTeam.primaryColor;
      ctx.shadowBlur = 14;

      // Outer ring with secondary
      ctx.beginPath();
      ctx.arc(pAway.x, pAway.y, pAway.radius + 2, 0, Math.PI * 2);
      ctx.fillStyle = awayTeam.secondaryColor;
      ctx.fill();

      // Body with primary
      ctx.beginPath();
      ctx.arc(pAway.x, pAway.y, pAway.radius, 0, Math.PI * 2);
      ctx.fillStyle = awayTeam.primaryColor;
      ctx.fill();

      // Dark core
      ctx.beginPath();
      ctx.arc(pAway.x, pAway.y, pAway.radius * 0.65, 0, Math.PI * 2);
      ctx.fillStyle = '#0c081e';
      ctx.fill();

      // AI crest or text
      if (awayCrestImgRef.current && awayCrestImgRef.current.complete) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(pAway.x, pAway.y, pAway.radius * 0.65, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(
          awayCrestImgRef.current,
          pAway.x - pAway.radius * 0.65,
          pAway.y - pAway.radius * 0.65,
          pAway.radius * 1.3,
          pAway.radius * 1.3
        );
        ctx.restore();
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px Sora, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(awayTeam.name ? awayTeam.name.substring(0, 2) : 'AI', pAway.x, pAway.y);
      }
      ctx.restore();

      // DRAW MATCH BALL
      const b = gameStateRef.current.ball;
      ctx.save();
      ctx.shadowColor = ball.glowColor;
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Neon core
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = ball.glowColor;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();

      ctx.restore(); // restore shake

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    isPaused,
    theme,
    ball,
    homeTeam,
    awayTeam,
    triggerGoal,
  ]);

  // Touch joystick handling for mobile controls
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    joystickRef.current.active = true;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartRef.current.x;
    const diffY = touch.clientY - touchStartRef.current.y;
    const distance = Math.hypot(diffX, diffY);
    const maxRadius = 40;

    if (distance > 0) {
      joystickRef.current.dx = Math.min(1, Math.max(-1, diffX / maxRadius));
      joystickRef.current.dy = Math.min(1, Math.max(-1, diffY / maxRadius));
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    joystickRef.current.dx = 0;
    joystickRef.current.dy = 0;
    joystickRef.current.active = false;
  };

  return (
    <div className="relative min-h-screen bg-[#080514] text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      {/* Stadium Top Lights & Grid */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 cyber-grid" />
        <div className="absolute top-0 left-0 right-0 h-60 stadium-light-left opacity-60" />
        <div className="absolute top-0 left-0 right-0 h-60 stadium-light-right opacity-60" />
      </div>

      {/* TOP HUD SCOREBOARD */}
      <header className="relative z-20 w-full max-w-[420px] mx-auto pt-2 px-3">
        <div className="bg-[#0e0824]/90 backdrop-blur-md border border-violet-500/30 rounded-2xl p-2.5 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
          <div className="flex items-center justify-between">
            {/* HOME TEAM */}
            <div className="flex items-center gap-2">
              {homeTeam.crestImage ? (
                <div
                  className="w-6 h-6 rounded-full overflow-hidden border p-[1px] shrink-0 bg-black/60"
                  style={{ borderColor: homeTeam.primaryColor, boxShadow: `0 0 6px ${homeTeam.primaryColor}` }}
                >
                  <img src={homeTeam.crestImage} alt="" className="w-full h-full object-cover rounded-full" />
                </div>
              ) : (
                <span
                  className="w-3 h-3 rounded-full transition-all"
                  style={{
                    backgroundColor: homeTeam.primaryColor,
                    boxShadow: `0 0 8px ${homeTeam.primaryColor}`,
                  }}
                />
              )}
              <div className="text-left">
                <span className="text-xs font-display font-black uppercase text-white truncate block max-w-[80px]">
                  {homeTeam.name || 'HOME'}
                </span>
                <span className="text-[9px] font-mono text-cyan-400">PLAYER</span>
              </div>
            </div>

            {/* SCORE & TIME */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-display font-black text-cyan-400 font-mono drop-shadow-[0_0_8px_#00F0FF]">
                  {homeScore}
                </span>
                <span className="text-xs font-mono text-purple-400 font-bold">:</span>
                <span className="text-2xl font-display font-black text-pink-400 font-mono drop-shadow-[0_0_8px_#FF2A85]">
                  {awayScore}
                </span>
              </div>

              {/* Countdown badge */}
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-950/70 border border-violet-500/40 text-[10px] font-mono text-violet-200 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{timeLeft}s</span>
              </div>
            </div>

            {/* AWAY TEAM */}
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-xs font-display font-black uppercase text-white truncate block max-w-[80px]">
                  {awayTeam.name || 'AWAY'}
                </span>
                <span className="text-[9px] font-mono text-pink-400">AI STRIKER</span>
              </div>
              {awayTeam.crestImage ? (
                <div
                  className="w-6 h-6 rounded-full overflow-hidden border p-[1px] shrink-0 bg-black/60"
                  style={{ borderColor: awayTeam.primaryColor, boxShadow: `0 0 6px ${awayTeam.primaryColor}` }}
                >
                  <img src={awayTeam.crestImage} alt="" className="w-full h-full object-cover rounded-full" />
                </div>
              ) : (
                <span
                  className="w-3 h-3 rounded-full transition-all"
                  style={{
                    backgroundColor: awayTeam.primaryColor,
                    boxShadow: `0 0 8px ${awayTeam.primaryColor}`,
                  }}
                />
              )}
            </div>
          </div>

          {/* Quick HUD Sub-bar (Arena & Pause) */}
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-white/5 pt-1.5 mt-1.5">
            <span className="text-emerald-400 font-semibold uppercase flex items-center gap-1 truncate max-w-[170px]">
              ★ {theme.title}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="hover:text-white underline cursor-pointer text-violet-300"
              >
                {isPaused ? '▶ RESUME' : '❚❚ PAUSE'}
              </button>
              <button
                type="button"
                onClick={onBackToMenu}
                className="hover:text-red-400 cursor-pointer"
              >
                QUIT
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* PITCH CANVAS CONTAINER */}
      <main className="relative z-10 w-full max-w-[420px] mx-auto flex-1 flex flex-col items-center justify-center p-2">
        <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-[0_0_25px_rgba(0,255,135,0.35)] bg-slate-950 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full h-full object-contain"
          />

          {/* GOAL CELEBRATION OVERLAY */}
          {goalAnnouncement && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-30 animate-in zoom-in-95 duration-200">
              <div className="text-3xl font-display font-black uppercase text-yellow-300 drop-shadow-[0_0_20px_#ffe600] tracking-wider animate-bounce">
                ⚽ {goalAnnouncement}
              </div>
              <div className="text-xs font-mono uppercase text-cyan-300 tracking-widest mt-1">
                KICKOFF INCOMING...
              </div>
            </div>
          )}

          {/* PAUSE MODAL OVERLAY */}
          {isPaused && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center z-40 p-4">
              <h3 className="text-xl font-display font-black uppercase text-white mb-2">
                MATCH PAUSED
              </h3>
              <p className="text-[11px] font-mono text-slate-300 text-center mb-4 max-w-[250px]">
                Controls: Use Arrow Keys / WASD to Move, Spacebar to Kick. On Mobile, use the on-screen controls below!
              </p>
              <div className="flex gap-2 w-full max-w-[220px]">
                <button
                  type="button"
                  onClick={() => setIsPaused(false)}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-display font-bold text-xs uppercase cursor-pointer"
                >
                  RESUME
                </button>
                <button
                  type="button"
                  onClick={onBackToMenu}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 font-display font-bold text-xs uppercase cursor-pointer"
                >
                  LEAVE
                </button>
              </div>
            </div>
          )}
        </div>

        {/* STAMINA & TURBO GAUGE */}
        <div className="w-full mt-2 px-1">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 mb-0.5">
            <span className="flex items-center gap-1 text-cyan-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              TURBO BOOST GAUGE
            </span>
            <span>{turboStamina}% CHARGED</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 border border-cyan-500/30 overflow-hidden p-[1px]">
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{
                width: `${turboStamina}%`,
                background: `linear-gradient(90deg, ${homeTeam.secondaryColor}, ${homeTeam.primaryColor})`,
                boxShadow: `0 0 10px ${homeTeam.primaryColor}`,
              }}
            />
          </div>
        </div>
      </main>

      {/* MOBILE TOUCH CONTROLS (VIRTUAL JOYSTICK & ACTION BUTTONS) */}
      <footer className="relative z-20 w-full max-w-[420px] mx-auto p-3 pb-safe">
        <div className="flex items-center justify-between gap-4">
          {/* Virtual Joystick Area */}
          <div
            className="w-28 h-28 rounded-full bg-slate-900/80 border-2 border-violet-500/40 flex items-center justify-center relative touch-none select-none shadow-[0_0_15px_rgba(139,92,246,0.3)] active:border-cyan-400 cursor-pointer"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 shadow-[0_0_10px_#00F0FF] flex items-center justify-center text-slate-950 font-bold text-xs transition-transform pointer-events-none"
              style={{
                transform: `translate(${joystickRef.current.dx * 25}px, ${joystickRef.current.dy * 25}px)`,
              }}
            >
              🕹️
            </div>
            <span className="absolute -bottom-4 text-[8px] font-mono uppercase text-slate-400">
              DRAG TO MOVE
            </span>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-3">
            {/* Turbo Boost Button */}
            <button
              type="button"
              onClick={handleBoostAction}
              disabled={turboStamina < 25}
              className={`w-16 h-16 rounded-2xl border flex flex-col items-center justify-center transition active:scale-95 cursor-pointer ${
                turboStamina >= 25
                  ? 'bg-gradient-to-b from-purple-900/60 to-violet-800/80 border-violet-400 text-violet-200 shadow-[0_0_15px_rgba(147,51,234,0.5)]'
                  : 'bg-slate-900 border-slate-700 text-slate-600 opacity-60'
              }`}
            >
              <span className="text-base">⚡</span>
              <span className="text-[9px] font-mono font-bold tracking-wider uppercase mt-0.5">
                BOOST
              </span>
            </button>

            {/* Shoot / Kick Button */}
            <button
              type="button"
              onClick={handleKickAction}
              className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 text-slate-950 border border-white/40 shadow-[0_0_20px_rgba(0,240,255,0.6)] flex flex-col items-center justify-center active:scale-95 transition cursor-pointer"
            >
              <span className="text-xl">⚽</span>
              <span className="text-[10px] font-display font-black tracking-wider uppercase text-slate-950">
                KICK
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
