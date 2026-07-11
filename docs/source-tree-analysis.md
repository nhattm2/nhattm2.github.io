# Phân tích cây thư mục — kid-math

> Sinh tự động ngày 2026-07-11 · Độ sâu: deep

## Cây thư mục có chú thích

```text
kid-math/
├── index.html               # HTML gốc (lang="vi", title "Vườn của Gạo"), mount #root
├── package.json             # Scripts, deps (React/Vite/TS), version 0.1.0
├── vite.config.ts           # Cấu hình Vite + alias @ → src/
├── tsconfig.json            # Tham chiếu tsconfig.app.json & tsconfig.node.json
├── tsconfig.app.json        # TS cho app (strict, jsx react-jsx, paths @/*)
├── tsconfig.node.json       # TS cho vite.config.ts
├── public/                  # Asset tĩnh copy nguyên trạng vào dist/
├── dist/                    # Output build (gitignored, deploy lên gh-pages)
│
└── src/
    ├── main.tsx             # ★ ĐIỂM VÀO — createRoot + StrictMode, import global.css
    ├── App.tsx              # Shell: khung thiết bị, nút Cài đặt, SettingsModal, reset qua appKey
    ├── GardenApp.tsx        # ★ Router + state trung tâm (route, progress, history ref)
    ├── types.ts             # Toàn bộ type dùng chung (Op, Route, Problem, Progress, Answer…)
    ├── vite-env.d.ts        # Khai báo type môi trường Vite
    │
    ├── lib/                 # ── LOGIC THUẦN (không phụ thuộc React) ──
    │   ├── math-engine.ts   # OPS, LEVELS, BADGES, sinh đề, sinh đáp án, chọn phương pháp gợi ý
    │   ├── storage.ts       # localStorage: load/save/clear Progress, cộng sao, mở khoá huy hiệu
    │   └── sounds.ts        # Âm thanh WebAudio tổng hợp (đúng/sai/click/sao/huy hiệu)
    │
    ├── components/
    │   ├── screens/         # ── MÀN HÌNH (theo Route) ──
    │   │   ├── HomeScreen.tsx     # Trang chủ: chọn phép tính, vào huy hiệu, reset sao
    │   │   ├── ModeScreen.tsx     # Chọn chế độ: Học / Luyện tập / Thử thách
    │   │   ├── LevelScreen.tsx    # Chọn mức độ (phạm vi số × số sao)
    │   │   ├── PlayScreen.tsx     # ★ Vòng chơi: sinh đề, chấm, streak, đếm giờ, gợi ý
    │   │   ├── LearnScreen.tsx    # Dạy từng bước (5 bước có minh hoạ) theo phép tính
    │   │   ├── ResultScreen.tsx   # Màn kết quả (điểm, sao 0-3, chơi lại)
    │   │   └── BadgesScreen.tsx   # Bộ sưu tập huy hiệu
    │   │
    │   └── ui/              # ── UI TÁI SỬ DỤNG (presentational) ──
    │       ├── GaoPanda.tsx       # Linh vật gấu trúc (CSS thuần, 4 cảm xúc, hoạt hình)
    │       ├── Bubble.tsx         # Bong bóng thoại
    │       ├── TopBar.tsx         # Thanh đầu (nút back + tiêu đề + StarBar/right)
    │       ├── StarBar.tsx        # Viên hiển thị số sao
    │       ├── HintRow.tsx        # Hàng icon đếm (hỗ trợ gạch bỏ)
    │       ├── VisualHint.tsx     # ★ Gợi ý trực quan theo phương pháp (add/sub/mul/div/cmp)
    │       ├── Confetti.tsx       # Hiệu ứng confetti khi đúng
    │       └── SettingsModal.tsx  # Modal cài đặt (âm thanh, khung, reset)
    │
    └── styles/              # ── CSS THUẦN + biến thiết kế ──
        ├── tokens.css       # ★ Design tokens (màu, shadow, radius, duration, easing)
        ├── global.css       # Reset + style toàn cục
        ├── chrome.css       # Khung thiết bị (device-frame), FAB cài đặt, modal
        └── animations.css   # Keyframes: bob, wiggle, blink, pop-in, shake, float-up, confetti
```

## Thư mục / file quan trọng

| Đường dẫn | Vai trò |
|-----------|---------|
| `src/main.tsx` | Điểm vào ứng dụng — mount React root |
| `src/GardenApp.tsx` | "Bộ định tuyến" + nguồn state trung tâm (route + progress) |
| `src/lib/math-engine.ts` | Toàn bộ logic toán: dữ liệu cấp độ, sinh đề, chọn phương pháp gợi ý |
| `src/lib/storage.ts` | Lớp bền vững localStorage + luật sao/huy hiệu |
| `src/components/screens/PlayScreen.tsx` | Vòng lặp chơi chính (state phức tạp nhất) |
| `src/components/ui/VisualHint.tsx` | Render sư phạm của mọi phương pháp gợi ý |
| `src/styles/tokens.css` | Design system (biến CSS) |

## Ranh giới quan trọng

- **`lib/` không được import React** — chỉ logic/dữ liệu thuần, dễ test và tái dùng.
- **`screens/` điều phối**, **`ui/` trình bày** — UI component không giữ business logic.
- **State chảy một chiều**: `GardenApp` sở hữu `route` + `progress`, truyền xuống qua props;
  callback (`onNavigate`, `onCorrect`, `onBack`) đẩy thay đổi lên trên.
