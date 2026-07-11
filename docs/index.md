# Chỉ mục tài liệu — Vườn của Gạo (kid-math)

> 👆 Đây là **điểm vào chính** cho phát triển có AI hỗ trợ. Sinh tự động ngày 2026-07-11.

## Tổng quan dự án

- **Loại**: web (SPA phía client) · **Cấu trúc kho**: monolith
- **Ngôn ngữ chính**: TypeScript · **Kiến trúc**: component-based SPA + routing tự viết
- **Mục đích**: web app dạy Toán lớp 1 bằng tiếng Việt cho trẻ em (linh vật gấu trúc Gạo)

## Tham chiếu nhanh

- **Tech stack**: React 18.3 · TypeScript 5.6 (strict) · Vite 5.4 · pnpm · gh-pages
- **Điểm vào**: `src/main.tsx` → `App` → `GardenApp`
- **Bền vững**: `localStorage` key `kidmath_progress_v1` (không backend, không DB)
- **Deploy**: `pnpm deploy` → branch `gh-pages`

## Tài liệu đã sinh

- [Tổng quan dự án](./project-overview.md)
- [Kiến trúc](./architecture.md)
- [Phân tích cây thư mục](./source-tree-analysis.md)
- [Kho component](./component-inventory.md)
- [Hướng dẫn phát triển](./development-guide.md)

## Tài liệu liên quan (đã có sẵn)

- [Project Context cho AI](../_bmad-output/project-context.md) — luật/quy ước cô đọng để agent viết code nhất quán

## Không áp dụng

- **API contracts** — N/A: app chạy hoàn toàn client, không có endpoint.
- **Data models (DB)** — N/A: không có database; "mô hình dữ liệu" duy nhất là object `Progress`
  trong `localStorage` (xem mục *Kiến trúc dữ liệu* trong [architecture.md](./architecture.md)).

## Bắt đầu nhanh

```bash
pnpm install
pnpm dev          # chạy dev server
pnpm typecheck    # kiểm tra kiểu trước khi coi là xong
```

Xem [Hướng dẫn phát triển](./development-guide.md) để biết quy ước code và tác vụ thường gặp.
