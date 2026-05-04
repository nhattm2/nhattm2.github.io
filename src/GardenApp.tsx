import { useRef, useState } from 'react';
import type { Op, Progress, Route } from '@/types';
import { addStars, loadProgress } from '@/lib/storage';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { ModeScreen } from '@/components/screens/ModeScreen';
import { LevelScreen } from '@/components/screens/LevelScreen';
import { PlayScreen } from '@/components/screens/PlayScreen';
import { LearnScreen } from '@/components/screens/LearnScreen';
import { BadgesScreen } from '@/components/screens/BadgesScreen';

const HOME: Route = { screen: 'home' };

export function GardenApp() {
  const [route, setRoute] = useState<Route>(HOME);
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const history = useRef<Route[]>([HOME]);

  function navigate(next: Route) {
    history.current.push(next);
    setRoute(next);
  }

  function back() {
    history.current.pop();
    const prev = history.current[history.current.length - 1] ?? HOME;
    setRoute(prev);
  }

  function handleCorrect(stars: number, op: Op) {
    setProgress(addStars(stars, op));
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--bg)',
        color: 'var(--ink)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="scene-decor">
        <span style={{ top: '6%', left: '8%', fontSize: 40 }}>☁️</span>
        <span style={{ top: '4%', right: '12%', fontSize: 28 }}>🌸</span>
        <span style={{ bottom: '8%', left: '6%', fontSize: 36 }}>🌷</span>
        <span style={{ bottom: '6%', right: '8%', fontSize: 32 }}>🌿</span>
      </div>

      {route.screen === 'home' && <HomeScreen onNavigate={navigate} progress={progress} />}
      {route.screen === 'modes' && (
        <ModeScreen op={route.op} onNavigate={navigate} onBack={back} progress={progress} />
      )}
      {route.screen === 'levels' && (
        <LevelScreen
          op={route.op}
          mode={route.mode}
          onNavigate={navigate}
          onBack={back}
          progress={progress}
        />
      )}
      {route.screen === 'play' && (
        <PlayScreen
          key={`${route.op}-${route.level.id}-${history.current.length}`}
          op={route.op}
          mode={route.mode}
          level={route.level}
          onNavigate={navigate}
          onBack={back}
          onCorrect={handleCorrect}
        />
      )}
      {route.screen === 'learn' && <LearnScreen op={route.op} onBack={back} />}
      {route.screen === 'badges' && <BadgesScreen progress={progress} onBack={back} />}
    </div>
  );
}
