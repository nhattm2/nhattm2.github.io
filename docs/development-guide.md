# Hướng dẫn phát triển — kid-math

> Sinh tự động ngày 2026-07-11

## Yêu cầu

- **Node.js** ≥ 18 (khuyến nghị 20+; types nhắm Node 22).
- **pnpm** (dự án dùng `pnpm-lock.yaml`). Cài: `npm i -g pnpm`.
- Không cần biến môi trường, database hay dịch vụ ngoài.

## Cài đặt

```bash
pnpm install
```

## Lệnh thường dùng

| Lệnh | Tác dụng |
|------|----------|
| `pnpm dev` | Chạy Vite dev server (HMR) |
| `pnpm build` | `tsc -b && vite build` → xuất `dist/` |
| `pnpm preview` | Xem thử bản build production cục bộ |
| `pnpm typecheck` | `tsc -b --pretty false` — kiểm tra kiểu, không emit |
| `pnpm deploy` | Build rồi đẩy `dist/` lên branch `gh-pages` |

> **Không có lint/test gate.** Trước khi coi một thay đổi là xong, hãy chạy `pnpm typecheck`.

## Quy ước code

- **Import alias**: luôn dùng `@/…` (trỏ `src/`), tránh relative `../../`.
- **Type-only import**: dùng `import type { … }`.
- **Component**: function + named export; file `.tsx` trùng tên; không `React.FC`, không default export.
- **Naming**: component `PascalCase`; file lib `kebab-case.ts`; hằng `UPPER_SNAKE`.
- **Immutability**: cập nhật state/`Progress` bằng spread, không mutate.
- **Styling**: inline style cho layout + biến CSS trong `src/styles/` cho màu/shadow/animation.
  Không thêm Tailwind/CSS-in-JS.
- **Tiếng Việt**: mọi chuỗi hiển thị cho trẻ em viết bằng tiếng Việt (app `lang="vi"`).
- **TS nghiêm**: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` đang bật —
  không để biến/tham số thừa, switch phải xử lý đủ case.

## Tác vụ thường gặp

- **Thêm phép tính / cấp độ**: sửa `OPS` & `LEVELS` trong `src/lib/math-engine.ts`, mở rộng `genProblem`,
  và thêm nhánh render trong `VisualHint` + bước dạy trong `LearnScreen`.
- **Thêm huy hiệu**: thêm vào `BADGES` (math-engine) và luật mở khoá trong `addStars` (storage).
- **Thêm màn hình**: mở rộng union `Route` (`types.ts`), thêm component trong `screens/`,
  và nhánh render trong `GardenApp`.
- **Thêm âm thanh**: thêm phương thức vào object `Sounds` (`src/lib/sounds.ts`) — tổng hợp bằng WebAudio,
  không dùng file asset.

## Ràng buộc cần giữ

- **Không thêm dependency nặng** (router, state lib, UI kit, CSS framework) — dự án cố ý tối giản để
  deploy tĩnh lên GitHub Pages.
- Giữ ranh giới `lib/` (không import React) ↔ `screens/` ↔ `ui/`.
- Giữ invariant *reset sao theo ngày* trong `storage.ts`.

## Triển khai

```bash
pnpm deploy   # = pnpm build && gh-pages -d dist -b gh-pages -t
```

Đẩy nội dung `dist/` lên branch `gh-pages`; GitHub Pages phục vụ từ branch đó. Không có bước CI.
