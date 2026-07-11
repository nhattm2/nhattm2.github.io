# Kiến trúc — Vườn của Gạo (kid-math)

> Sinh tự động ngày 2026-07-11 · Loại: web (SPA) · Cấu trúc: monolith

## Tóm tắt

SPA React chạy hoàn toàn phía client, không backend. Toàn bộ trạng thái phiên nằm trong React
state; tiến độ lâu dài (sao, huy hiệu, tổng câu đúng) lưu trong `localStorage`. Kiến trúc theo
kiểu **component-based** với **routing tự viết** bằng discriminated union và **state tập trung một chiều**.

## Tech stack

| Hạng mục | Công nghệ | Phiên bản |
|----------|-----------|-----------|
| UI framework | React / React DOM | 18.3.1 |
| Ngôn ngữ | TypeScript (`strict`) | 5.6.3 |
| Bundler | Vite + @vitejs/plugin-react | 5.4.10 / 4.3.4 |
| Deploy | gh-pages → GitHub Pages | 6.2.0 |
| Package manager | pnpm | — |

## Mẫu kiến trúc

- **Component-based SPA**: `main.tsx` → `App` (shell) → `GardenApp` (điều phối) → các `screens/`.
- **Routing tự viết** (không router lib): `Route` là discriminated union; màn hình hiện tại chọn
  bằng `route.screen`. Lịch sử điều hướng giữ trong `useRef<Route[]>` với `navigate()`/`back()`.
- **State một chiều**: `GardenApp` sở hữu `route` + `progress`; truyền xuống props; con đẩy thay đổi
  lên qua callback (`onNavigate`, `onCorrect`, `onBack`, `onResetProgress`).
- **Tách lớp**: `lib/` (logic thuần, không React) ↔ `components/screens/` (điều phối) ↔ `components/ui/` (trình bày).

## Quản lý trạng thái

| Loại state | Nơi giữ | Ví dụ |
|------------|---------|-------|
| Điều hướng | `GardenApp` (`useState<Route>` + `useRef` history) | màn hình hiện tại |
| Tiến độ (bền vững) | `localStorage` qua `lib/storage`, mirror vào `useState<Progress>` | sao, huy hiệu, `byOp` |
| State vòng chơi | cục bộ trong `PlayScreen` (`useState`/`useRef`) | đề, lựa chọn, streak, đồng hồ |
| Tuỳ chọn app | `App` (`useState<Tweaks>`) | bật âm, khung thiết bị |

Không có store toàn cục (Redux/Zustand/Context). Reset tiến độ = `clearProgress()` + tăng `appKey`
để **remount** `GardenApp`.

## Kiến trúc dữ liệu (localStorage)

Không có database. "Data model" duy nhất là object `Progress`, serialize JSON dưới key
**`kidmath_progress_v1`**:

```ts
interface Progress {
  stars: number;           // sao trong NGÀY (reset khi sang ngày mới)
  badges: string[];        // id huy hiệu đã mở
  totalCorrect: number;    // tổng câu đúng mọi thời điểm
  byOp: Partial<Record<Op, number>>; // đếm câu đúng theo phép tính
  lastDate: string;        // YYYY-MM-DD (local) — mốc reset sao theo ngày
}
```

**Invariant quan trọng**:
- Sang ngày mới (`lastDate !== today`) ⇒ `stars` về 0, nhưng `badges` & `totalCorrect` **giữ nguyên**.
- Mọi truy cập storage bọc `try/catch`, degrade êm (không ném lỗi ra UI).
- Đổi shape `Progress` ⇒ cân nhắc bump version trong key.

## Logic miền (`lib/math-engine.ts`)

- `OPS`, `LEVELS`, `BADGES` — bảng dữ liệu cấu hình cho 5 phép tính.
- `genProblem(op, level)` — sinh đề; phép so sánh (`cmp`) trả `ans` là `Relation` (`<`/`>`/`=`), ~1/4 khả năng bằng nhau.
- `genChoices(problem)` — 4 lựa chọn số (hoặc cố định `['<','=','>']` cho so sánh), có xáo trộn.
- `pickHintMethod(problem)` — chọn phương pháp sư phạm theo **ràng buộc toán học** (xem comment trong code);
  `VisualHint` render tương ứng.

## Điểm vào & bootstrap

```text
index.html (#root)
  └─ src/main.tsx  → createRoot + <StrictMode>
       └─ App      → khung thiết bị + FAB cài đặt + SettingsModal
            └─ GardenApp (key=appKey) → route switch → screens/*
```

## Chiến lược kiểm thử

**Hiện chưa có test.** Khi bổ sung, ưu tiên **Vitest** (đồng bộ Vite) và test trước lớp `lib/`
thuần (`math-engine`, `storage`) vì đây là nơi tập trung logic dễ hồi quy nhất.

## Triển khai

- Build: `pnpm build` = `tsc -b && vite build` → xuất `dist/`.
- Deploy: `pnpm deploy` = build + `gh-pages -d dist -b gh-pages -t` (kèm dotfiles) → GitHub Pages.
- Không có CI/CD pipeline; không biến môi trường; app tĩnh 100%.
