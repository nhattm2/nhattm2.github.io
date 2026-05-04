interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
  deviceFrame: boolean;
  onToggleFrame: () => void;
  onResetProgress: () => void;
}

export function SettingsModal({
  open,
  onClose,
  soundOn,
  onToggleSound,
  deviceFrame,
  onToggleFrame,
  onResetProgress,
}: SettingsModalProps) {
  if (!open) return null;

  function handleReset() {
    if (window.confirm('Bạn chắc muốn xoá toàn bộ tiến độ của bé?')) {
      onResetProgress();
      onClose();
    }
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 id="settings-title">Cài đặt</h2>
        <div
          style={{
            fontSize: 13,
            color: 'var(--ink-soft)',
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Cho bố mẹ
        </div>

        <div className="row">
          <div>
            <label htmlFor="sound-toggle">🔊 Âm thanh</label>
            <div className="desc">Phát nhạc khi đúng/sai</div>
          </div>
          <button
            id="sound-toggle"
            className="toggle-pill"
            data-on={soundOn}
            onClick={onToggleSound}
            aria-label="Bật/tắt âm"
            aria-pressed={soundOn}
          />
        </div>

        <div className="row">
          <div>
            <label htmlFor="frame-toggle">📱 Khung điện thoại</label>
            <div className="desc">Cho hiển thị desktop</div>
          </div>
          <button
            id="frame-toggle"
            className="toggle-pill"
            data-on={deviceFrame}
            onClick={onToggleFrame}
            aria-label="Khung điện thoại"
            aria-pressed={deviceFrame}
          />
        </div>

        <div className="row">
          <div>
            <label>🔄 Reset tiến độ</label>
            <div className="desc">Xoá sao và huy hiệu</div>
          </div>
          <button className="danger-btn" onClick={handleReset}>
            Reset
          </button>
        </div>

        <button className="modal-close" onClick={onClose}>
          Xong
        </button>
      </div>
    </div>
  );
}
