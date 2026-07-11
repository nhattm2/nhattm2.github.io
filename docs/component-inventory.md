# Kho component — kid-math

> Sinh tự động ngày 2026-07-11 · Độ sâu: deep

Tất cả component là **function component + named export**, dùng **inline style** cho layout và
**biến CSS** (`var(--…)`) cho màu/shadow. Không dùng `React.FC`, không default export.

## Màn hình (`src/components/screens/`)

Mỗi màn hình khớp một nhánh của `Route` và được render bởi `GardenApp`.

| Component | Route | Props chính | Vai trò |
|-----------|-------|-------------|---------|
| `HomeScreen` | `home` | `onNavigate, progress, onResetProgress` | Chọn 1 trong 5 phép tính; vào Huy hiệu; nút reset sao 2-bước (arm 3s). Có `OpCard` nội bộ. |
| `ModeScreen` | `modes` | `op, onNavigate, onBack, progress` | Chọn *Học cùng Gạo* / *Luyện tập* / *Thử thách*. Có `ModeCard` nội bộ. |
| `LevelScreen` | `levels` | `op, mode, onNavigate, onBack, progress` | Chọn cấp độ (phạm vi số ↔ số sao thưởng). |
| `PlayScreen` | `play` | `op, mode, level, onNavigate, onBack, onCorrect` | **Vòng chơi chính**: sinh đề không trùng, 4 lựa chọn (3 cho so sánh), streak, đếm giờ challenge, tiết lộ đáp án sau 2 lần sai, confetti + điểm bay. |
| `LearnScreen` | `learn` | `op, onBack` | Dạy 5 bước có minh hoạ (`STEPS` + `LearnVisual` nội bộ), nút "Ví dụ khác". |
| `ResultScreen` | (nội bộ PlayScreen) | `score, total, mode, onBack, onRetry` | Màn kết thúc: 0-3 sao theo %, thông điệp, chơi lại. |
| `BadgesScreen` | `badges` | `progress, onBack` | Lưới 8 huy hiệu, mờ/khoá nếu chưa đạt. |

## UI tái sử dụng (`src/components/ui/`)

| Component | Loại | Props | Ghi chú |
|-----------|------|-------|---------|
| `GaoPanda` | Display / Mascot | `size, mood` | Gấu trúc dựng bằng CSS thuần (không ảnh); `mood`: happy/thinking/celebrate/sad đổi mắt/miệng/hoạt hình. |
| `Bubble` | Display | `children, side` | Bong bóng thoại có đuôi trái/phải. |
| `TopBar` | Navigation | `onBack, title, stars?, right?` | Thanh đầu chuẩn; tự nhúng `StarBar` khi có `stars`. |
| `StarBar` | Display | `stars, animated?` | Viên "⭐ N". |
| `HintRow` | Display | `count, icon, strike?, big?` | Hàng icon đếm; `strike` gạch bỏ n phần tử đầu (dùng cho phép trừ). |
| `VisualHint` | Display (logic-driven) | `problem, hintIcon?` | **Trung tâm sư phạm**: gọi `pickHintMethod` rồi render đúng phương pháp (count-on, make-ten, count-down, count-up, subtract-from-ten, doubles, skip-count, array, inverse, objects, so sánh cột). |
| `Confetti` | Feedback | `active` | 40 mảnh confetti (memo hoá theo `active`). |
| `SettingsModal` | Overlay | `open, onClose, soundOn, onToggleSound, deviceFrame, onToggleFrame, onResetProgress` | Modal "Cho bố mẹ": bật/tắt âm, khung thiết bị, reset (có `window.confirm`). Dùng class trong `chrome.css`. |

## Quan hệ phụ thuộc

```text
GardenApp
 ├─ HomeScreen ── OpCard · GaoPanda · Bubble · StarBar
 ├─ ModeScreen ── ModeCard · GaoPanda · Bubble · TopBar
 ├─ LevelScreen ─ GaoPanda · Bubble · TopBar
 ├─ PlayScreen ── GaoPanda · Bubble · TopBar · Confetti · VisualHint · ResultScreen
 │                 └─ VisualHint ── HintRow (+ pickHintMethod từ math-engine)
 ├─ LearnScreen ─ GaoPanda · Bubble · HintRow · LearnVisual(nội bộ)
 └─ BadgesScreen ─ GaoPanda · Bubble · TopBar (+ BADGES từ math-engine)

App (ngoài GardenApp) ── SettingsModal · Sounds
```

## Chú thích thiết kế

- **Icon = emoji**, mascot = CSS — app **không có file ảnh/âm thanh** nào (âm thanh tổng hợp WebAudio).
- Nhiều component "con" (OpCard, ModeCard, LearnVisual, LearnStep) sống **nội bộ** trong file
  màn hình dùng chúng — không tách ra `ui/` cho tới khi thật sự tái dùng (YAGNI).
