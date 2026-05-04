import { useEffect, useState } from 'react';
import { GardenApp } from '@/GardenApp';
import { SettingsModal } from '@/components/ui/SettingsModal';
import { Sounds } from '@/lib/sounds';
import { clearProgress } from '@/lib/storage';

interface Tweaks {
  soundOn: boolean;
  deviceFrame: boolean;
}

const INITIAL_TWEAKS: Tweaks = { soundOn: true, deviceFrame: true };

export function App() {
  const [tweaks, setTweaks] = useState<Tweaks>(INITIAL_TWEAKS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [appKey, setAppKey] = useState(0);

  useEffect(() => {
    Sounds.setEnabled(tweaks.soundOn);
  }, [tweaks.soundOn]);

  function setTweak<K extends keyof Tweaks>(key: K, val: Tweaks[K]) {
    setTweaks((prev) => ({ ...prev, [key]: val }));
  }

  function resetProgress() {
    clearProgress();
    setAppKey((k) => k + 1);
  }

  const content = <GardenApp key={appKey} onResetProgress={resetProgress} />;

  return (
    <>
      <div className="page-bg" />
      <div className="device-stage">
        {tweaks.deviceFrame ? (
          <div className="device-frame">
            <div className="screen">{content}</div>
          </div>
        ) : (
          <div className="frameless-screen">{content}</div>
        )}
      </div>
      <button
        className="settings-fab"
        onClick={() => {
          setSettingsOpen(true);
          Sounds.click();
        }}
        aria-label="Cài đặt"
      >
        ⚙️
      </button>
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        soundOn={tweaks.soundOn}
        onToggleSound={() => setTweak('soundOn', !tweaks.soundOn)}
        deviceFrame={tweaks.deviceFrame}
        onToggleFrame={() => setTweak('deviceFrame', !tweaks.deviceFrame)}
        onResetProgress={resetProgress}
      />
    </>
  );
}
