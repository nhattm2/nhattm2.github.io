import type { Op, Progress, Route } from '@/types';
import { GaoPanda } from '@/components/ui/GaoPanda';
import { Bubble } from '@/components/ui/Bubble';
import { TopBar } from '@/components/ui/TopBar';
import { OPS } from '@/lib/math-engine';

interface ModeScreenProps {
  op: Op;
  onNavigate: (next: Route) => void;
  onBack: () => void;
  progress: Progress;
}

interface ModeCardProps {
  icon: string;
  color: string;
  title: string;
  desc: string;
  onClick: () => void;
}

function ModeCard({ icon, color, title, desc, onClick }: ModeCardProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 20,
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        boxShadow: 'var(--shadow)',
        textAlign: 'left',
        color: 'var(--ink)',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 30,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{desc}</div>
      </div>
      <div style={{ fontSize: 22, color: 'var(--ink-soft)' }}>›</div>
    </button>
  );
}

export function ModeScreen({ op, onNavigate, onBack, progress }: ModeScreenProps) {
  const opMeta = OPS[op];
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '28px 32px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TopBar onBack={onBack} title={`Phép ${opMeta.name}`} stars={progress.stars} />
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 12 }}>
        <GaoPanda size={80} />
        <Bubble>Bé chọn cách học nhé:</Bubble>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
        <ModeCard
          icon="📖"
          color="#a8e6c8"
          title="Học cùng Gạo"
          desc="Xem ví dụ minh hoạ từng bước"
          onClick={() => onNavigate({ screen: 'learn', op })}
        />
        <ModeCard
          icon="✏️"
          color="#ffb59a"
          title="Luyện tập"
          desc="Làm bài có gợi ý hình ảnh"
          onClick={() => onNavigate({ screen: 'levels', op, mode: 'practice' })}
        />
        <ModeCard
          icon="⏱️"
          color="#ffd56b"
          title="Thử thách"
          desc="60 giây — bao nhiêu câu đúng?"
          onClick={() => onNavigate({ screen: 'levels', op, mode: 'challenge' })}
        />
      </div>
    </div>
  );
}
